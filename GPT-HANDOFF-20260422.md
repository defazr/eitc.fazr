# GPT 핸드오프 — 2026-04-22 (D-9 to 5/1)

## 세션 주제: PR-5 콘텐츠 5편 + SEO + Calculator/Eligibility UX 대수술

---

## 완료된 작업 전체

### 1. PR-5 콘텐츠 5편 + JSON-LD (`06d4499`→`44594b6`)

| slug | 제목 | FAQ 수 |
|---|---|---|
| property-seizure-250 | 압류금지 250만원 상향 | 5 |
| late-application-guide | 미신청 기한 후 신청 | 6 |
| hometax-application-guide | 홈택스 신청 가이드 | 6 |
| auto-application-system | 자동신청 제도 | 6 |
| payment-check-guide | 입금일 조회 | 6 |

- Article JSON-LD (전 글) + FAQPage JSON-LD (신규 5편, 29개 Q/A)
- 1·2번 글 크로스링크, UPDATES 배열 날짜 내림차순 자동 정렬
- 기존 1번 글(2026-application-period) 날짜 수정 11/30→12/1

### 2. SEO 개선

- `/eligibility` 메타 + H1 → "대상자 확인" 키워드 타겟 (`9ee5dd2`)
- FAQ Q16 "미신청" 추가 — 월 22,200 검색 볼륨 (`825ef87`)
- FAQ Q17 "홈택스"는 GPT 판단으로 ROI 낮아 후순위

### 3. Calculator UX 대수술 (`e06e86e`→`1573165`)

**변경 전:**
- "지금 바로 내 금액 확인하기 →" 버튼 2개 (PC + 모바일 sticky)
- 둘 다 handleCalculate() 호출
- 결과 나와도 스크롤 없음 → 사용자가 결과 못 봄

**변경 후:**
- "계산하기" 버튼 1개 (입력 폼 아래, PC+모바일 공통)
- 계산 완료 → 결과 영역 자동 스크롤 (block: "start")
- **모바일 sticky footer 완전 제거**

**삭제 경위:**
1. 처음에 sticky를 "리셋 버튼"으로 전환 시도
2. 결과 카드 금액을 가리는 문제 발견
3. 숨기면 리셋 역할 못 함, 보이면 결과 가림 → 딜레마
4. "계산하기" 버튼이 이미 있으니 sticky 자체가 불필요 → 삭제

### 4. Eligibility UX (`e06e86e`)

- "확인하기" 클릭 → 결과 카드 자동 스크롤 (block: "center")

### 5. 스크롤 정리 (`db5a7bb`)

- `ScrollToTopOnNavigation` 컴포넌트 제거
- support.fazr에 이 컴포넌트 없이 정상 작동 확인 → Next.js 기본 동작에 위임
- 커스텀 스크롤 코드가 광고 인터럽트(vignette)와 충돌 가능성

---

## 커밋 이력 (전체)

| 커밋 | 내용 |
|---|---|
| `06d4499` | PR-5 글 5편 + 크로스링크 + Article JSON-LD + 날짜 수정 |
| `e0009b0` | UPDATES 배열 날짜 내림차순 정렬 |
| `4378a3d` | 신규 5편 content 중복 h1 제거 |
| `44594b6` | FAQPage JSON-LD 29개 Q/A 추가 |
| `3a32967` | 핸드오프 문서 업데이트 |
| `9ee5dd2` | /eligibility 메타 + H1 수정 |
| `825ef87` | FAQ Q16 미신청 추가 |
| `e06e86e` | calculator + eligibility 결과 자동 스크롤 |
| `70e1fd6` | calculator 버튼 분리 (계산하기 + sticky 리셋) |
| `09a5285` | sticky 리셋 스크롤 타겟 → 입력 폼 |
| `8872f3b` | 결과 표시 중 sticky 숨김 (임시) |
| `cd78495` | **모바일 sticky footer 완전 제거** |
| `db5a7bb` | ScrollToTopOnNavigation 제거 |
| `1573165` | 결과 스크롤 block center → start |

---

## 날짜 사실 확인 (중요)

| 항목 | 정확한 날짜 |
|---|---|
| 정기신청 | 2026.5.1. ~ 6.1. |
| 기한 후 신청 | 2026.6.2. ~ **12.1.** (11/30 아님!) |
| 신청 불가 | 2026.12.2. 이후 |

---

## 발견된 이슈 + 해결

| 이슈 | 해결 |
|---|---|
| content h1 중복 | content에서 # 제목 제거 (`4378a3d`) |
| Cloudflare robots.txt 차이 | 무해, 다음 인증 정상 (미해결, 무해) |
| sticky footer 결과 가림 | sticky 완전 제거 (`cd78495`) |
| ScrollToTopOnNavigation 광고 충돌 | 컴포넌트 제거 (`db5a7bb`) |

---

## 현재 운영 상태

- **최신 commit**: `1573165`
- **빌드**: 통과
- **테스트**: 61/61 통과
- **페이지 수**: 15개 + not-found
- **FAQ**: 16개 (Q16 미신청 추가)

---

## 다음 작업

### 사용자 직접 (운영)
- [ ] 신규 글 5개 + Q16 GSC/네이버 색인 요청
- [ ] 리치 결과 테스트 (FAQPage JSON-LD 확인)
- [ ] 전환율 모니터링 (계산하기 버튼 전환)
- [ ] 모바일 실기기 UX 테스트 (스크롤, 결과 노출)

### 개발 백로그
1. FAQ Q17 "홈택스" (후순위)
2. 5월 시즌 모니터링 후 추가 작업 결정

---

## 세션 키 러닝

1. **support.fazr 코드 비교가 최고의 디버깅** — ScrollToTopOnNavigation 불필요 확인
2. **sticky footer는 만능이 아님** — 결과 가림 + 역할 중복 시 과감히 삭제
3. **content에 # h1 넣지 말 것** — page.tsx가 title을 h1으로 렌더링
4. **날짜 팩트체크 필수** — GPT 할루시네이션으로 11/30 → 12/1 수정
5. **JSON-LD faq 필드는 본문과 1:1 일치** — 불일치 시 구글 패널티
6. **UX 변경은 시나리오 점검 필수** — A(리셋) vs B(스크롤만) 토론 후 결국 C(삭제)
