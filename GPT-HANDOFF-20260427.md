# GPT 핸드오프 — 2026-04-27 (D-4 to 5/1)

## 세션 주제: 세무서 데이터 133개 추가 + support.fazr audit + Vercel 빌드 스킵

---

## 세션10 작업 요약

### 1. support.fazr regions 구조 audit

GPT/사용자 지적으로 작업 전 audit 먼저 진행.

| 항목 | support.fazr | eitc.fazr |
|---|---|---|
| 데이터 | `src/data/regions.json` (89개 인구감소지역) | `src/data/regions/taxOffices.ts` (133개 세무서) |
| 타입 | `Region { slug, province, name, fullName, type, amount, area }` | `TaxOffice { name, address, phone, code, region, districts, ... }` |
| URL 패턴 | `/regions/[slug]` (busan-dong-gu) | 아직 없음 (5/8 작업 예정) |
| 도메인 | 인구감소지역 (특별/우대, 지급액) | 세무서 (관할구역, 자치구 매핑) |

**결론**: 도메인이 완전히 달라 데이터 구조 공유 불필요. eitc 독자 설계 확정. 페이지 레이아웃 패턴만 참고.

### 2. 세무서 데이터 133개 추가 (`b0aeb52`)

**CSV 출처**: 공공데이터포털 국세청 세무서별 관할구역 (20260408, EUC-KR)

**생성된 파일 (5개)**:

| 파일 | 역할 |
|---|---|
| `src/data/regions/types.ts` | TaxOffice, Region, RegionKey 타입 (key/slug 분리) |
| `src/data/regions/taxOffices.ts` | 133개 세무서 + 17개 지역 빌드 함수 |
| `src/data/regions/utils.ts` | getRegionByKey, getRegionBySlug, getTaxOfficesByDistrict, searchTaxOffice |
| `src/data/regions/__tests__/taxOffices.test.ts` | 22개 테스트 |
| `scripts/parseTaxOffices.ts` | CSV 파싱 1회성 변환 스크립트 (재사용 가능) |

**지역별 세무서 수**:

```
서울 28 | 경기 27 | 경북 9 | 부산 9 | 충남 8
강원 7  | 경남 7  | 인천 6 | 전북 6 | 충북 5
대구 5  | 전남 5  | 광주 4 | 대전 3 | 울산 2
세종 1  | 제주 1  | 합계 133
```

**서울 25개 자치구 역매핑 (핵심)**:

```
강남구 → 강남세무서, 삼성세무서, 역삼세무서 (3개)
강동구 → 강동세무서
강북구 → 도봉세무서
강서구 → 강서세무서
관악구 → 관악세무서
광진구 → 성동세무서
구로구 → 구로세무서
금천구 → 금천세무서
노원구 → 노원세무서
도봉구 → 노원세무서, 도봉세무서 (2개, 창동=노원)
동대문구 → 동대문세무서
동작구 → 동작세무서
마포구 → 마포세무서
서대문구 → 서대문세무서
서초구 → 반포세무서, 서초세무서 (2개)
성동구 → 성동세무서
성북구 → 성북세무서
송파구 → 송파세무서, 잠실세무서 (2개)
양천구 → 양천세무서
영등포구 → 동작세무서, 영등포세무서 (2개)
용산구 → 용산세무서
은평구 → 은평세무서
종로구 → 종로세무서
중구 → 남대문세무서, 중부세무서 (2개)
중랑구 → 중랑세무서
```

**key vs slug 분리 원칙**:
- key: 내부 식별자 (변경 X) — `getRegionByKey("seoul")`
- slug: URL용 (변경 가능) — `/regions/seoul`
- 초기 설정: key === slug (동일)
- 6월 시군구 확장 시 slug만 변경하여 대응

### 3. Vercel Ignored Build Step 설정

사용자가 Vercel 대시보드에서 직접 설정 완료:
```
git diff --quiet HEAD^ HEAD -- src/ public/ package.json next.config.ts tsconfig.json tailwind.config.ts
```
- .md 파일만 push 시 빌드 스킵
- 핸드오프 push로 불필요한 빌드 방지

---

## 커밋 이력

| 커밋 | 내용 |
|---|---|
| `b0aeb52` | feat(data): 국세청 세무서 데이터 추가 (133개) — 5/8 페이지 작업 준비 |

---

## 현재 운영 상태

- **최신 commit**: `b0aeb52`
- **빌드**: 통과
- **테스트**: 83/83 (기존 61 + 신규 22)
- **페이지 수**: 15개 + not-found (변화 없음)
- **FAQ**: 16개

---

## 데이터 사용법 (5/8 작업 시)

```typescript
// 지역 조회
import { getRegionByKey, getTaxOfficesByDistrict } from "@/data/regions/utils";

const seoul = getRegionByKey("seoul");
// → { key: "seoul", slug: "seoul", name: "서울", fullName: "서울특별시", taxOffices: [...28개], districtToOffices: {...} }

// 자치구별 세무서 조회
const offices = getTaxOfficesByDistrict("seoul", "강남구");
// → [강남세무서, 삼성세무서, 역삼세무서]

// 검색
import { searchTaxOffice } from "@/data/regions/utils";
searchTaxOffice("잠실");
// → [잠실세무서]
```

---

## 파싱 스크립트 재실행 (데이터 갱신 시)

```bash
# CSV가 EUC-KR인 경우 먼저 변환
iconv -f EUC-KR -t UTF-8 input.csv > input_utf8.csv

# 스크립트 실행
npx tsx scripts/parseTaxOffices.ts input_utf8.csv
# → src/data/regions/taxOffices.ts 자동 생성
```

---

## 파싱 에지 케이스 처리 방식

```
1. 가운뎃점(·) 구분자 → 일반 구분자와 동일 처리
2. 주석 텍스트("거제지서 안내는...") → managementArea에 보존, districts에서 제외
3. 괄호 예외("창동 제외") → districts에 구 포함, subDistricts에 원문 보존
4. 전화번호 → 원본 그대로 (정규화 X)
5. "전체"/"전역" → 해당 시/군/구만 districts에 추가, 상위 단위면 빈 배열
```

---

## 다음 작업

### 4/29 (수) 데이터 점검
1. GSC 색인 상태 (Cloudflare 풀린 후 변화)
2. GSC 노출/클릭 추이
3. 네이버 변화
4. 광고 전환수
5. 카톡 친구 수

### 5/1 (목) 시즌 진입

### 5/8~ 서울 지역 페이지 작성
- 데이터 import만 하면 됨
- support.fazr 페이지 레이아웃 패턴 참고
- Hero → 세무서 정보 카드 → CTA → 광고 → 관련 지역

### 6월 17개 시도 확장
- 동일 템플릿 + region key 변경
- 1개 템플릿으로 17개 페이지 생성

### 개발 백로그
1. FAQ Q17 "홈택스" (후순위)
2. Cloudflare verified bots 허용 규칙 (선택)
3. support.fazr → eitc.fazr 백링크 1~2개

---

## 세션 키 러닝

1. **작업 전 기존 코드베이스 audit 먼저** — support.fazr에 이미 /regions 89개 있었음. 확인 안 했으면 구조 미스매치 위험
2. **key/slug 분리** — 내부 식별자(key)와 URL용(slug) 분리하면 SEO 리팩토링 시 안전
3. **Vercel Ignored Build Step** — .md 핸드오프 push로 불필요한 빌드 방지. 다른 fazr 프로젝트에도 적용 권장
4. **CSV 파싱 스크립트 보존** — 1회성이지만 데이터 갱신 시 재사용 가능. scripts/ 디렉토리에 커밋
