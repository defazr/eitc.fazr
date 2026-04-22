# GPT 핸드오프 — 2026-04-22 (D-9 to 5/1)

## 세션 주제: PR-5 콘텐츠 5편 + JSON-LD (Article + FAQPage) 완료

### 배경
- 네이버가 10개 이하 소규모 사이트 색인 우선순위 낮음
- 검색 볼륨 높은 키워드 타겟 글 5개 추가로 페이지 수 확장 (10→15개)
- SEO 구조화 데이터 강화 (Article + FAQPage JSON-LD)

---

## 완료된 코드 변경

### 커밋 이력 (전부 main 직접 push)

| 커밋 | 내용 |
|---|---|
| `06d4499` | 글 5편 추가 + 크로스링크 + Article JSON-LD + 기존 글 날짜 수정 + 핸드오프 |
| `e0009b0` | UPDATES 배열 날짜 내림차순 정렬 (최신글 상단) |
| `4378a3d` | 신규 5편 content 중복 h1 제거 (page.tsx h1과 중복됨) |
| `44594b6` | FAQPage JSON-LD 29개 Q/A 추가 (UpdatePost.faq 필드) |

### 신규 글 5편

| # | slug | 제목 | FAQ 수 |
|---|------|------|--------|
| 1 | `property-seizure-250` | 압류금지 250만원 상향 | 5 |
| 2 | `late-application-guide` | 미신청 기한 후 신청 | 6 |
| 3 | `hometax-application-guide` | 홈택스 신청 가이드 | 6 |
| 4 | `auto-application-system` | 자동신청 제도 | 6 |
| 5 | `payment-check-guide` | 입금일 조회 | 6 |

### 추가 변경사항
- **기존 1번 글(2026-application-period)** 날짜 수정: `11월 30일` → `12월 1일` (3곳 + 괄호 보충)
- **1·2번 신규 글** 크로스링크 추가 (함께 읽으면 좋은 글)
- **UpdatePost 인터페이스** `faq?: { question, answer }[]` 필드 추가
- **UPDATES 배열** `.sort()` 날짜 내림차순 — 향후 글 추가 시 자동 정렬
- **[slug]/page.tsx** Article JSON-LD (전 글) + FAQPage JSON-LD (faq 있는 글만 조건부)

---

## 날짜 사실 확인 (중요)

| 항목 | 정확한 날짜 |
|---|---|
| 정기신청 | 2026.5.1. ~ 6.1. (5/31 일요일 → 6/1까지) |
| 기한 후 신청 | 2026.6.2. ~ **12.1.** (11/30 아님!) |
| 신청 불가 | 2026.12.2. 이후 |

글 본문에서 첫 등장 시 괄호 보충: "(일부 안내에서는 11월 30일까지로 표기되기도 하나, 홈택스 기준 12월 1일까지 신청 가능합니다)"

---

## 발견된 이슈

### content h1 중복 (해결됨)
- UpdatePost.content에 `# 제목`을 넣으면 page.tsx의 h1(post.title)과 중복 표시
- 기존 5편은 본문 시작이라 정상, 신규 5편만 `#` 있어서 이중 표시
- 해결: content에서 `# 제목\n\n` 제거 (`4378a3d`)

### Cloudflare robots.txt 차이 (미해결, 무해)
- 코드(route.ts)는 단순 3줄이지만 Cloudflare AI Audit가 앞에 AI 봇 차단 규칙 자동 삽입
- 다음 인증 해시는 정상 포함 — 인증 자체는 문제없음
- 필요 시 Cloudflare 대시보드 → Security → Bots → AI Audit OFF

---

## JSON-LD 구조 (현재 상태)

| 페이지 | Article | FAQPage |
|---|---|---|
| /faq | ❌ | ✅ 15개 Q/A (기존) |
| /updates/[slug] 기존 5편 | ✅ | ❌ (faq 필드 없음) |
| /updates/[slug] 신규 5편 | ✅ | ✅ 29개 Q/A |

---

## 현재 운영 상태

### main 최신 커밋: `44594b6`
- 빌드 통과
- 테스트 61/61 통과
- Vercel 자동 배포 완료

### 페이지 수: 15개 + not-found
- 홈, calculator, eligibility, faq, updates
- 글 10편 (기존 5 + 신규 5)

---

## 다음 작업

### 사용자 직접 (운영)
- [ ] 신규 글 5개 GSC 색인 요청
- [ ] 네이버 서치어드바이저 색인 요청
- [ ] 리치 결과 테스트 (search.google.com/test/rich-results)로 FAQPage 확인
- [ ] 전환율 모니터링

### 개발 백로그
1. FAQ Q16 "미신청" (월 22,200)
2. FAQ Q17 "홈택스" (월 4,500+)
3. /eligibility 메타 수정 "대상자 확인" (월 4,400+)

---

## 세션 키 러닝

1. **content에 # h1 넣지 말 것** — page.tsx가 title을 h1으로 렌더링, 중복됨
2. **날짜 팩트체크 필수** — GPT 할루시네이션으로 11/30 → 12/1 수정 필요했음
3. **JSON-LD는 본문과 1:1 일치** — 별도 faq 필드로 관리하되 본문 Q/A와 동일해야 구글 불일치 패널티 회피
4. **UPDATES 배열 .sort() 적용** — 수동 정렬 대신 날짜 내림차순 자동 정렬
5. **글 추가 패턴 확립**: UPDATE_SLUGS 배열 + UPDATES 배열 + faq 배열 → 빌드 → 커밋
