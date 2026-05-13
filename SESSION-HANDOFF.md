# SESSION HANDOFF — eitc.fazr.co.kr

> 다음 Claude Code 세션이 이 파일을 먼저 읽고 현재 상태를 파악한다.

## 마지막 세션: 2026-05-13 (세션 11 — Canonical URL 정규화)

### 프로젝트 상태: 라이브 운영 + Canonical 배포 완료, 검색엔진 반영 대기

- **사이트**: https://eitc.fazr.co.kr (라이브)
- **저장소**: https://github.com/defazr/eitc.fazr.git
- **최신 commit**: `aeb2eec` (PR #5 머지)
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

- **eitc-ssot-v1.2.md** (프로젝트 루트, 726줄) — 모든 수치/로직/구조의 최종 출처

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
| 세션10 | b0aeb52 | 세무서 데이터 133개 + Vercel 빌드 스킵 |
| 세션11 | aeb2eec | **Canonical URL 정규화 (PR #5)** |

### 세션11 상세 (2026-05-13)

**Canonical URL 정규화 — layout 전역 상속 제거 + 홈 개별 설정**

변경:
- `src/app/layout.tsx` — `alternates: { canonical: "/" }` 제거 (전역 상속 방지)
- `src/app/page.tsx` — `alternates: { canonical: "/" }` 추가 (홈 개별 설정)

오디트 발견:
- calculator/eligibility는 라우트별 layout.tsx에서 이미 canonical 설정됨
- faq, updates, updates/[slug]도 기존 canonical 설정 완료
- 6개 페이지 유형 전부 canonical 커버 확인
- Round 1.5 (컴포넌트 분리) 불필요 확정

### Canonical 현황 (전 페이지)

| 페이지 | canonical | 설정 위치 |
|---|---|---|
| `/` | `https://eitc.fazr.co.kr` | page.tsx |
| `/calculator` | `https://eitc.fazr.co.kr/calculator` | calculator/layout.tsx |
| `/eligibility` | `https://eitc.fazr.co.kr/eligibility` | eligibility/layout.tsx |
| `/faq` | `https://eitc.fazr.co.kr/faq` | faq/page.tsx |
| `/updates` | `https://eitc.fazr.co.kr/updates` | updates/page.tsx |
| `/updates/[slug]` | `https://eitc.fazr.co.kr/updates/{slug}` | updates/[slug]/page.tsx generateMetadata |
| 404 | 없음 | 대상 제외 |

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

### /updates 시스템

- 콘텐츠: `src/data/updates.ts` — `UpdatePost { slug, title, description, date, content, faq? }`
- 정렬: `.sort((a, b) => b.date.localeCompare(a.date))` — 최신글 상단
- **content에 # h1 넣지 말 것** — page.tsx가 title을 h1으로 렌더링
- JSON-LD: Article (전 글) + FAQPage (faq 필드 있는 글만 조건부)

### 핵심 규칙

1. **engine.ts 직접 import 금지** — wrapper.ts만 경유
2. **디자인 불변** — shadcn/ui 기존만, 신규 컴포넌트/색상 금지
3. **콘텐츠 1:1 복사** — content v1.1.md에서, 수치/문장 변경 금지
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
15. **layout.tsx에 alternates.canonical 추가 금지** — 각 페이지/라우트 layout에서 개별 설정

### 이후 백로그

1. **5/20 데이터 확인** — 네이버/GSC canonical 반영 추이
2. **Round 2: Calculator SEO 보강** — 5/20 데이터 확인 후 결정
3. **서울 지역 페이지** — 세무서 데이터 import, support.fazr 레이아웃 참고
4. **6월 17개 시도 확장** — 1개 템플릿 + 17번 복사
5. FAQ Q17 "홈택스" (후순위, ROI 낮음)
6. Cloudflare verified bots 허용 규칙 (선택, 시즌 후)
7. support.fazr → eitc.fazr 백링크 1~2개

### 운영 체크리스트 (포그린 직접)

- [x] GSC/네이버/다음 색인 등록
- [x] AdSense + ads.txt
- [x] Cloudflare ASN 차단 해제
- [x] 신규 글 5개 GSC 색인 요청
- [x] sitemap 재제출
- [x] Vercel Ignored Build Step 설정
- [x] Canonical 정규화 배포
- [x] 네이버 Search Advisor 홈 수집 요청
- [x] GSC 홈 색인 요청
- [ ] 5/14 GSC 색인 요청 4개 (/calculator, /eligibility, /faq, /updates)
- [ ] 5/20 데이터 확인 (네이버 파라미터 URL 노출, GSC 색인, AdSense)
- [ ] Round 2 결정

### 알려진 한계 (수용됨)

- **Chrome iOS 시크릿 모드 앵커광고 플로팅**: 코드로 해결 불가. 실사용자 영향 미미.
- **Cloudflare robots.txt 자동 삽입**: AI Audit 규칙. 다음 인증 정상. 무해.

### 일정

```
5/14 (수) — GSC 색인 요청 4개
5/20 (화) — 1주 후 데이터 확인, Round 2 결정
5/24 (토) — AdSense 입금 예정
6월~ — 17개 시도 확장 (효과 확인 후)
```
