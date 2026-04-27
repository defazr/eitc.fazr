# SESSION HANDOFF — eitc.fazr.co.kr

> 다음 Claude Code 세션이 이 파일을 먼저 읽고 현재 상태를 파악한다.

## 마지막 세션: 2026-04-27 (세션 10 — 세무서 데이터 133개 + Vercel 빌드 스킵)

### 프로젝트 상태: 라이브 운영 + 5/8 페이지 작업 준비 완료

- **사이트**: https://eitc.fazr.co.kr (라이브)
- **저장소**: https://github.com/defazr/eitc.fazr.git
- **최신 commit**: `b0aeb52`
- **배포**: Vercel eitc-fazr, GitHub 자동 배포
- **Vercel Ignored Build Step**: .md만 변경 시 빌드 스킵 설정됨

### 기술 스택

- Next.js 16.2.2 (App Router) + TypeScript
- Tailwind v4 + @tailwindcss/typography
- shadcn/ui v4 (@base-ui/react — render prop 사용)
- vitest v4.1.4 (83 테스트 통과)
- calc.fazr 엔진 (commit 6702242, 수정 금지)
- sharp (devDependency, og 이미지 처리용)

### SSOT

- **eitc-ssot-v1.2.md** (프로젝트 루트, 726줄) — 모든 수치·로직·구조의 최종 출처

### 완료된 작업

| PR/세션 | 커밋 | 내용 |
|---|---|---|
| PR-1 | 652755e | regions 삭제, 텍스트 치환, 메타데이터 |
| PR-2 | a204dd0 | calc.fazr 엔진 복사, wrapper/guard/flags, 59 테스트 |
| PR-3 | b0a4f5b | calculator+eligibility 페이지 재구현 |
| PR-4 | 000dfe0→a2e0ae3 | 콘텐츠 투입, FAQ 15개, Updates 5편, AdSense 슬롯 7개, 검색엔진 키 |
| PR-4.1 | 544c14d→3a89aa2 | 404 페이지, 301 redirect, 홈 카드, 크로스링크, og 이미지 3종 |
| 세션5 | 7b5e35e→6f03502 | Google Ads 전환 추적, GA4 이벤트, 푸터 사업자 정보, 카카오톡 채널 |
| 세션6 | d654ba8 | 계산기 전환률 개선 — D-Day 배너, 버튼 항상활성화, 기대감 문구 |
| 세션7 | 5858a8d | ads.txt 추가, AdSense next/script 전환, Chrome iOS 시크릿 플로팅 수용 |
| 세션8 | 06d4499→1573165 | PR-5 글 5편 + JSON-LD + SEO + Calculator UX 대수술 |
| 세션9 | f40d575 | Cloudflare ASN 차단 해결 + 내부링크 보강 |
| 세션10 | b0aeb52 | 세무서 데이터 133개 + Vercel 빌드 스킵 (아래 상세) |

### 세션10 상세 (2026-04-27)

**support.fazr audit:**
- support는 인구감소지역 89개 데이터, eitc는 세무서 133개 데이터
- 도메인 다름 → eitc 독자 설계 확정
- 페이지 레이아웃 패턴만 참고

**세무서 데이터 추가 (`b0aeb52`):**

```
src/data/regions/
  types.ts        — TaxOffice, Region, RegionKey (key/slug 분리)
  taxOffices.ts   — 133개 세무서 데이터 + 17개 지역 빌드
  utils.ts        — getRegionByKey, getRegionBySlug, getTaxOfficesByDistrict, searchTaxOffice
  __tests__/taxOffices.test.ts — 22개 테스트

scripts/
  parseTaxOffices.ts — CSV→TS 1회성 변환 스크립트 (재실행 가능)
```

- 서울 25개 자치구 전부 역매핑 완료
- 강남구→3개, 송파구→2개, 서초구→2개, 도봉구→2개, 영등포구→2개, 중구→2개
- 페이지/라우트 변경 없음

**Vercel Ignored Build Step:**
```
git diff --quiet HEAD^ HEAD -- src/ public/ package.json next.config.ts tsconfig.json tailwind.config.ts
```
- .md 파일만 push 시 빌드 스킵

### 세무서 데이터 사용법 (5/8 작업 시)

```typescript
import { getRegionByKey, getTaxOfficesByDistrict } from "@/data/regions/utils";

const seoul = getRegionByKey("seoul");
// { key: "seoul", slug: "seoul", name: "서울", fullName: "서울특별시", taxOffices: [28개], districtToOffices: {...} }

const offices = getTaxOfficesByDistrict("seoul", "강남구");
// [강남세무서, 삼성세무서, 역삼세무서]
```

### key vs slug 분리 원칙

```
key: 내부 식별자 (변경 X) — getRegionByKey("seoul")
slug: URL용 (변경 가능) — /regions/seoul, /regions/seoul-gangnam-gu
초기: key === slug (동일)
6월 시군구 확장 시 slug만 변경
```

### Calculator 현재 구조

```
입력 폼 (가구유형 → 소득 → 재산 → 신청유형 → 체크박스)
  ↓
[계산하기] 버튼 (PC+모바일 공통, handleCalculate)
  ↓
결과 영역 (ref={resultRef}, 자동 스크롤 block:"start")
  - 예상 수급 대상 / 조건부 / 차단 카드
  - 상세 결과표
  - "신청 준비하기" 내부링크 (hometax-application-guide)
  - 공유 버튼
  - 카카오 채널 버튼
  - 면책 배너
```

- ~~모바일 sticky footer~~ **삭제됨** — 복구 금지
- ~~ScrollToTopOnNavigation~~ **삭제됨** — support.fazr와 동일

### Eligibility 현재 구조

```
5문항 체크리스트
  ↓
[확인하기] 버튼
  ↓
결과 카드 (eligible/reduced/blocked)
  - eligible/reduced → "신청 방법 확인하기" CTA
  - blocked → CTA 미표시
  ↓
광고 슬롯
  ↓
"함께 보면 좋은 정보" 내부링크
  ↓
면책 배너
```

### /updates 시스템

- 콘텐츠: `src/data/updates.ts` — `UpdatePost { slug, title, description, date, content, faq? }`
- 정렬: `.sort((a, b) => b.date.localeCompare(a.date))` — 최신글 상단
- **content에 # h1 넣지 말 것** — page.tsx가 title을 h1으로 렌더링
- 광고: 목록 2번째 뒤 `2240954488`, 상세 본문 전 `6086273688`
- JSON-LD: Article (전 글) + FAQPage (faq 필드 있는 글만 조건부)

### FAQ

- 파일: `src/data/faq.ts` — `FaqItem { id, question, answer, category }`
- 총 16개 (Q1-Q16), FAQPage JSON-LD 자동 반영
- Q16: 미신청 기한 후 신청 (category: application)

### 핵심 규칙

1. **engine.ts 직접 import 금지** — wrapper.ts만 경유
2. **디자인 불변** — shadcn/ui 기존만, 신규 컴포넌트/색상 금지
3. **콘텐츠 1:1 복사** — content v1.1.md에서, 수치·문장 변경 금지
4. **body/html 높이 클래스 금지** — iOS 스크롤 버그
5. **환경변수 이름 변경 금지** — `NEXT_PUBLIC_ADSENSE_PUB_ID` (6곳 참조)
6. **Next.js metadata 병합 함정** — openGraph/twitter 오버라이드 시 글로벌 필드 명시 필수
7. **VignetteCleanup 건드리지 마라**
8. **push 전 사용자 확인 필수**
9. **updates content에 # h1 넣지 말 것**
10. **기한 후 신청 마감 = 12월 1일** (11/30 아님)
11. **calculator sticky footer 삭제됨** — 복구 금지
12. **ScrollToTopOnNavigation 삭제됨** — Next.js 기본 동작 사용
13. **key vs slug 분리** — key=내부식별자(변경X), slug=URL용(변경가능)
14. **Vercel Ignored Build Step** — .md만 변경 시 빌드 스킵, 문서는 src/ 밖에 둘 것

### 이후 백로그

1. **5/8~ 서울 지역 페이지** — 세무서 데이터 import, support.fazr 레이아웃 참고
2. **6월 17개 시도 확장** — 1개 템플릿 + 17번 복사
3. FAQ Q17 "홈택스" (후순위, ROI 낮음)
4. Cloudflare verified bots 허용 규칙 (선택, 시즌 후)
5. support.fazr → eitc.fazr 백링크 1~2개

### 운영 체크리스트 (사용자 직접)

- [x] GSC/네이버/다음 색인 등록
- [x] AdSense + ads.txt
- [x] Cloudflare ASN 차단 해제
- [x] 신규 글 5개 GSC 색인 요청
- [x] sitemap 재제출
- [x] Vercel Ignored Build Step 설정
- [ ] 4/29 데이터 점검 (GSC 색인, 노출/클릭, 네이버, 광고 전환, 카톡)
- [ ] 리치 결과 테스트 (FAQPage JSON-LD 확인)
- [ ] 전환율 모니터링

### 알려진 한계 (수용됨)

- **Chrome iOS 시크릿 모드 앵커광고 플로팅**: 코드로 해결 불가. 실사용자 영향 미미.
- **Cloudflare robots.txt 자동 삽입**: AI Audit 규칙. 다음 인증 정상. 무해.

### 일정

```
4/29 (화) — 데이터 점검
4/30 (수) — D-1 점검
5/1 (목) — 시즌 진입
5/8~ — 서울 지역 페이지 작성 시작
6월~ — 17개 시도 확장
```
