# SESSION HANDOFF — eitc.fazr.co.kr

> 다음 Claude Code 세션이 이 파일을 먼저 읽고 현재 상태를 파악한다.

## 마지막 세션: 2026-04-12 (세션 4 — SEO/UX 보강)

### 프로젝트 상태: ✅ 라이브 운영 + SEO 완비

- **사이트**: https://eitc.fazr.co.kr (라이브)
- **저장소**: https://github.com/defazr/eitc.fazr.git
- **최신 commit**: `3a89aa2`
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
| PR-4.1 | 544c14d→3a89aa2 | 404 페이지, 301 redirect, 홈 카드, 크로스링크, 카드 문구 정정, 스크롤 UX, og 이미지 3종, 전 페이지 OG/Twitter 메타 완비 |

### og 이미지 시스템

| 페이지 | 이미지 | og:type |
|---|---|---|
| 홈 (글로벌) | /og-default.jpg | website |
| /calculator | /og-calculator.jpg | website |
| /eligibility, /faq, /updates, /updates/[slug] | /og-guide.jpg | website/article |

- 전 페이지 og:url/type/locale/siteName/image(width/height/alt) + twitter:card 완비
- 기존 public/og/ 디렉토리 (og-main.jpg, og-updates.jpg) — 참조 안 함, 정리 필요

### 엔진 구조 (src/lib/eitc/)

```
src/lib/eitc/
├─ engine.ts        ← calc.fazr eitcCtc.ts 복사 (수정 금지)
├─ wrapper.ts       ← 자녀세액공제 차감 + guardInput (engine 유일 import)
├─ eligibilityGuard.ts ← UI 차단 (engine 미사용)
├─ flags.ts         ← feature flags (반기/장애인/bypass)
├─ index.ts         ← barrel (engine 직접 노출 차단)
└─ __tests__/       ← 6파일 61테스트
```

### UX 컴포넌트

- **ScrollToTopOnNavigation** (scroll-to-top-on-navigation.tsx): route change → top scroll, hash 보존
- **ScrollTopButton** (scroll-top-button.tsx): 플로팅 "맨 위로" 버튼 — 건드리지 마라
- **navigation.tsx handleHomeClick**: 로고 + 모바일 "홈" 클릭 → 같은 페이지면 smooth scroll top

### 핵심 규칙

1. **engine.ts 직접 import 금지** — wrapper.ts만 경유
2. **디자인 불변** — shadcn/ui 기존만, 신규 컴포넌트/색상 금지
3. **콘텐츠 1:1 복사** — content v1.1.md에서, 수치·문장 변경 금지
4. **body/html 높이 클래스 금지** — iOS 스크롤 버그
5. calc.fazr 경로: `/Users/dapala.corp/python/root/scripts/calc/calc-fazr`
6. **환경변수 이름 변경 금지** — `NEXT_PUBLIC_ADSENSE_PUB_ID` (6곳 참조)
7. **Next.js metadata 병합 함정** — openGraph/twitter 오버라이드 시 글로벌 필드 명시 필수
8. **VignetteCleanup 건드리지 마라**
9. **push 전 사용자 확인 필수**

### 다음 작업 (PR-5 백로그)

- 키워드 보완 (근로장려금 기준/조회/조건 등)
- 내부 링크 보강 (홈 → Updates 동선)
- 새 FAQ 3~5문항 또는 새 Update 1~2편
- 기존 본문 미세 키워드 자연 삽입 (GPT 검수 후)
- public/og/ 옛 이미지 정리

### 운영 체크리스트 (사용자 직접)

- [ ] GSC 색인 요청 + _next/chunks "수정 검증 시작"
- [ ] 네이버 서치어드바이저 등록
- [ ] 다음 웹마스터도구 등록
- [ ] AdSense 사이트 추가
- [ ] 모바일 전수 테스트
- [ ] 페이스북/카카오톡 og 카드 디버거 확인
