# SESSION HANDOFF — eitc.fazr.co.kr

> 다음 Claude Code 세션이 이 파일을 먼저 읽고 현재 상태를 파악한다.

## 마지막 세션: 2026-04-22 (세션 8 — PR-5 + SEO + UX 대수술)

### 프로젝트 상태: ✅ 라이브 운영 + 글 10편 + JSON-LD + Calculator UX 개선

- **사이트**: https://eitc.fazr.co.kr (라이브)
- **저장소**: https://github.com/defazr/eitc.fazr.git
- **최신 commit**: `1573165`
- **배포**: Vercel eitc-fazr, GitHub 자동 배포

### 기술 스택

- Next.js 16.2.2 (App Router) + TypeScript
- Tailwind v4 + @tailwindcss/typography
- shadcn/ui v4 (@base-ui/react — render prop 사용)
- vitest v4.1.4 (61 테스트 통과)
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
| 세션8 | 06d4499→1573165 | PR-5 글 5편 + JSON-LD + SEO + Calculator UX 대수술 (아래 상세) |

### 세션8 상세 (2026-04-22)

**PR-5 콘텐츠:**
- 글 5편 (property-seizure-250, late-application-guide, hometax-application-guide, auto-application-system, payment-check-guide)
- Article JSON-LD (전 글) + FAQPage JSON-LD (신규 5편, 29개 Q/A)
- 크로스링크, 날짜 수정(11/30→12/1), 중복 h1 제거, 날짜 내림차순 정렬

**SEO:**
- /eligibility 메타 + H1 → "대상자 확인" 키워드 타겟
- FAQ Q16 "미신청" 추가 (16개로 증가)

**Calculator UX:**
- "계산하기" 버튼 신규 (입력 폼 아래, PC+모바일 공통)
- 계산 완료 → resultRef 자동 스크롤 (block: "start")
- **모바일 sticky footer 완전 제거** (결과 가림 + 역할 중복)
- handleReset, formRef 삭제

**Eligibility UX:**
- 확인하기 → 결과 카드 자동 스크롤 (block: "center")

**스크롤:**
- ScrollToTopOnNavigation 컴포넌트 제거 (support.fazr에 없음, Next.js 기본 동작)

### Calculator 현재 구조

```
입력 폼 (가구유형 → 소득 → 재산 → 신청유형 → 체크박스)
  ↓
[계산하기] 버튼 (PC+모바일 공통, handleCalculate)
  ↓
결과 영역 (ref={resultRef}, 자동 스크롤 block:"start")
  - 예상 수급 대상 / 조건부 / 차단 카드
  - 상세 결과표
  - 공유 버튼
  - 카카오 채널 버튼
  - 면책 배너
```

- ~~모바일 sticky footer~~ **삭제됨** — 복구 금지
- ~~ScrollToTopOnNavigation~~ **삭제됨** — support.fazr와 동일

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

### 이후 백로그

1. FAQ Q17 "홈택스" (후순위, ROI 낮음)
2. 5월 시즌 모니터링 후 추가 작업 결정

### 운영 체크리스트 (사용자 직접)

- [x] GSC/네이버/다음 색인 등록
- [x] AdSense + ads.txt
- [ ] 신규 글 5개 + Q16 색인 요청
- [ ] 리치 결과 테스트 (FAQPage JSON-LD)
- [ ] 모바일 실기기 UX 테스트 (스크롤, 결과 노출)
- [ ] 전환율 모니터링

### 알려진 한계 (수용됨)

- **Chrome iOS 시크릿 모드 앵커광고 플로팅**: 코드로 해결 불가. 실사용자 영향 미미.
- **Cloudflare robots.txt 자동 삽입**: AI Audit 규칙. 다음 인증 정상. 무해.
