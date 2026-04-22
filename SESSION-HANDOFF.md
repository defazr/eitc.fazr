# SESSION HANDOFF — eitc.fazr.co.kr

> 다음 Claude Code 세션이 이 파일을 먼저 읽고 현재 상태를 파악한다.

## 마지막 세션: 2026-04-22 (세션 8 — PR-5 콘텐츠 5편 + JSON-LD 완료)

### 프로젝트 상태: ✅ 라이브 운영 + 글 10편 + Article/FAQPage JSON-LD

- **사이트**: https://eitc.fazr.co.kr (라이브)
- **저장소**: https://github.com/defazr/eitc.fazr.git
- **최신 commit**: `44594b6`
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
| 세션8 | 06d4499→44594b6 | PR-5: 글 5편 추가, 크로스링크, 날짜 수정(11/30→12/1), 최신글 정렬, h1 중복 제거, Article + FAQPage JSON-LD |

### /updates 글 목록 (날짜 내림차순 자동 정렬)

| date | slug | 제목 | faq |
|---|---|---|---|
| 2026-04-22 | property-seizure-250 | 압류금지 250만원 상향 | 5 |
| 2026-04-22 | late-application-guide | 미신청 기한 후 신청 | 6 |
| 2026-04-22 | hometax-application-guide | 홈택스 신청 가이드 | 6 |
| 2026-04-22 | auto-application-system | 자동신청 제도 | 6 |
| 2026-04-22 | payment-check-guide | 입금일 조회 | 6 |
| 2026-04-11 | 2026-application-period | 신청기간 총정리 | - |
| 2026-04-11 | 2026-child-tax-credit-guide | 자녀장려금 가이드 | - |
| 2026-04-11 | 2026-payment-date | 지급일 정리 | - |
| 2026-04-11 | property-threshold-explained | 재산 기준 정리 | - |
| 2026-04-11 | child-tax-credit-deduction | 자녀세액공제 중복 차감 | - |

### /updates 시스템 구조

- 콘텐츠: `src/data/updates.ts` (TS 데이터 파일)
- 인터페이스: `UpdatePost { slug, title, description, date, content, faq? }`
- 타입 안전: `UPDATE_SLUGS` 상수 배열
- 정렬: `.sort((a, b) => b.date.localeCompare(a.date))` — 최신글 상단
- **content에 # h1 넣지 말 것** — page.tsx가 title을 h1으로 렌더링
- 광고: 목록 2번째 뒤 `2240954488`, 상세 본문 전 `6086273688`

### JSON-LD 구조

| 페이지 | Article | FAQPage |
|---|---|---|
| /faq | ❌ | ✅ 15개 (기존) |
| /updates/[slug] 기존 5편 | ✅ | ❌ |
| /updates/[slug] 신규 5편 | ✅ | ✅ 29개 |

### og 이미지 시스템

| 페이지 | 이미지 | og:type |
|---|---|---|
| 홈 (글로벌) | /og-default.jpg | website |
| /calculator | /og-calculator.jpg | website |
| /eligibility, /faq, /updates, /updates/[slug] | /og-guide.jpg | website/article |

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
10. **updates content에 # h1 넣지 말 것** — page.tsx h1과 중복
11. **기한 후 신청 마감 = 12월 1일** (11/30 아님, 국세청 공식)

### 이후 백로그

1. FAQ Q16 "미신청" (월 22,200)
2. FAQ Q17 "홈택스" (월 4,500+)
3. /eligibility 메타 수정 "대상자 확인" (월 4,400+)

### 운영 체크리스트 (사용자 직접)

- [x] GSC 색인 요청
- [x] 네이버 서치어드바이저 등록
- [x] 다음 웹마스터도구 등록
- [x] AdSense 사이트 추가
- [x] ads.txt 추가 (2026-04-21)
- [ ] 신규 글 5개 GSC/네이버 색인 요청
- [ ] 리치 결과 테스트 (FAQPage JSON-LD 확인)
- [ ] 전환율 모니터링

### 알려진 한계 (수용됨)

- **Chrome iOS 시크릿 모드 앵커광고 플로팅**: 코드로 해결 불가. 실사용자 영향 미미 (99%+ 기본 모드). 세션7 진단 완료, 수정 보류.
- **Cloudflare robots.txt 자동 삽입**: AI Audit 규칙이 robots.txt 앞에 추가됨. 다음 인증 해시는 정상. 무해.
