# SESSION HANDOFF — eitc.fazr.co.kr

> 다음 Claude Code 세션이 이 파일을 먼저 읽고 현재 상태를 파악한다.

## 마지막 세션: 2026-04-21 (세션 7 — 광고 인프라 안정화)

### 프로젝트 상태: ✅ 라이브 운영 + 광고 로딩 패턴 정비 + 계산기 sticky 앵커 충돌 해결

- **사이트**: https://eitc.fazr.co.kr (라이브)
- **저장소**: https://github.com/defazr/eitc.fazr.git
- **최신 commit**: `5858a8d`
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
| 세션5 | 7b5e35e→6f03502 | Google Ads 전환 추적, GA4 이벤트, 푸터 사업자 정보, 카카오톡 채널 연동 |
| 세션6 | d654ba8 | 계산기 전환률 개선 — D-Day 배너, 버튼 항상활성화+검증, 모바일 sticky footer, 기대감 문구 |
| 세션7 | 5858a8d | ads.txt 추가, AdSense next/script 전환, 계산기 sticky `bottom-[100px]` + `pb-52`, Chrome iOS 시크릿 플로팅 수용 |

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

### 세션6 계산기 UX 개선 (2026-04-18)

- D-Day 배너: 5/1 기준 자동 계산, 제목 아래 파란색 배너
- 버튼 항상 활성화: disabled 제거, 소득·재산 미입력 시 alert + scrollIntoView(block:"center")
- PC/모바일 분리: PC hidden md:block / 모바일 md:hidden fixed sticky footer
- 기대감 문구: "입력 3개만 하면 30초 안에 내 예상 금액 확인"
- 버튼 텍스트: "지금 바로 내 금액 확인하기 →"
- 전환율 목표: 1.8% → 5%+

### 세션7 광고 인프라 안정화 (2026-04-21)

- **ads.txt 추가** (PR #1): `public/ads.txt` — `google.com, pub-7976139023602789, DIRECT, f08c47fec0942fa0`
- **main `min-h-dvh` → `min-h-svh`** (PR #2): 플로팅 해결엔 효과 없었으나 무해. support.fazr는 `dvh` 사용 중. 현재 svh 유지.
- **AdSense 스크립트 `next/script` 전환** (PR #3): 원시 `<script async>` → `<Script strategy="afterInteractive">`. `<head>` 제거, `<body>` 이동. support/fuel/calc와 동일 패턴.
- **계산기 sticky footer 오프셋** (PR #4): `src/app/calculator/page.tsx` sticky `bottom-0` → `bottom-[100px]`, wrapper `pb-24` → `pb-52`. 앵커광고와 sticky CTA 둘 다 정상 노출.
- **Chrome iOS 시크릿 플로팅**: 기본 모드 정상, 시크릿만 문제. 코드 이슈 아닌 Chrome iOS WebKit quirk로 수용. 실사용자 영향 미미.
- **가설 검증 기록** (효과 없음, 모두 원복): marquee OFF (`073d3e2`), ScrollTopButton OFF (`27e16c9`), AdSlot format rectangle (`7e0adc2` → 원복 `5858a8d`).
- **support.fazr 라이브 HTML 비교로 진단**: eitc는 support에서 복제된 사이트(`808b0d6`). 구조 diff로 범인 후보 좁힘.

### 다음 작업 (PR-5 백로그, GSC/네이버 데이터 보고 결정)

필수 3개:
1. FAQ Q16 "미신청" (월 22,200)
2. FAQ Q17 "홈택스" (월 4,500+)
3. /eligibility 메타 수정 "대상자 확인" (월 4,400+)

선택 1개:
4. Update 신규 1편 "지급일 총정리" (월 5,000+)

### 운영 체크리스트 (사용자 직접)

- [x] GSC 색인 요청
- [x] 네이버 서치어드바이저 등록
- [x] 다음 웹마스터도구 등록
- [x] AdSense 사이트 추가
- [x] ads.txt 추가 (2026-04-21)
- [ ] AdSense 콘솔 ads.txt "인증됨" 확인 (수 시간~1일 소요)
- [ ] 전환율 모니터링 (4/18~4/20 vs 이전 4일)
- [ ] 모바일/PC 실기기 테스트 (세션6·7 변경 확인)
- [ ] 네이버 데이터 수집 → PR-5 착수 결정

### 알려진 한계 (수용됨)

- **Chrome iOS 시크릿 모드 앵커광고 플로팅**: 코드로 해결 불가. 실사용자 영향 미미 (99%+ 기본 모드). 세션7 진단 완료, 수정 보류.
