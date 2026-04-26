# SESSION HANDOFF — eitc.fazr.co.kr

> 다음 Claude Code 세션이 이 파일을 먼저 읽고 현재 상태를 파악한다.

## 마지막 세션: 2026-04-26 (세션 9 — Cloudflare 차단 해결 + 내부링크 보강)

### 프로젝트 상태: ✅ 라이브 운영 + Cloudflare 차단 해제 + 색인 요청 완료

- **사이트**: https://eitc.fazr.co.kr (라이브)
- **저장소**: https://github.com/defazr/eitc.fazr.git
- **최신 commit**: `f40d575`
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
| 세션8 | 06d4499→1573165 | PR-5 글 5편 + JSON-LD + SEO + Calculator UX 대수술 |
| 세션9 | f40d575 | Cloudflare ASN 차단 해결 + 내부링크 보강 (아래 상세) |

### 세션9 상세 (2026-04-26)

**Cloudflare ASN 차단 발견/해결:**
- Cloudflare WAF에서 ASN 15169(Google) 차단 → Googlebot 403 → 신규 글 5개 색인 불가
- 사용자가 Cloudflare WAF 규칙 수정하여 차단 해제
- curl 검증: Googlebot UA + 네이버봇(Yeti) UA → 6개 URL 전부 HTTP 200
- GSC 5개 URL 색인 요청 + sitemap 재제출 완료
- 4/27~28 재크롤링 대기 → 5/1 시즌 진입 목표

**내부링크 보강 (`f40d575`):**
- hometax-application-guide: "안내문 받았다면 이렇게 진행하세요" 섹션 추가
- /eligibility: eligible/reduced 결과에 "신청 방법 확인하기" CTA + 하단 "함께 보면 좋은 정보"
- /calculator: 계산 결과 하단 "신청 준비하기" 섹션

### Calculator 현재 구조

```
입력 폼 (가구유형 → 소득 → 재산 → 신청유형 → 체크박스)
  ↓
[계산하기] 버튼 (PC+모바일 공통, handleCalculate)
  ↓
결과 영역 (ref={resultRef}, 자동 스크롤 block:"start")
  - 예상 수급 대상 / 조건부 / 차단 카드
  - 상세 결과표
  - "신청 준비하기" 내부링크 (hometax-application-guide)  ← NEW
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
  - eligible/reduced → "신청 방법 확인하기" CTA  ← NEW
  - blocked → CTA 미표시
  ↓
광고 슬롯
  ↓
"함께 보면 좋은 정보" 내부링크  ← NEW
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

### 이후 백로그

1. FAQ Q17 "홈택스" (후순위, ROI 낮음)
2. Cloudflare verified bots 허용 규칙 (선택, 시즌 후)
3. support.fazr → eitc.fazr 백링크 1~2개
4. 5월 시즌 모니터링 후 추가 작업 결정

### 운영 체크리스트 (사용자 직접)

- [x] GSC/네이버/다음 색인 등록
- [x] AdSense + ads.txt
- [x] Cloudflare ASN 차단 해제
- [x] 신규 글 5개 GSC 색인 요청
- [x] sitemap 재제출
- [ ] 4/29 데이터 점검 (GSC 색인, 노출/클릭, 네이버, 광고 전환, 카톡)
- [ ] 리치 결과 테스트 (FAQPage JSON-LD 확인)
- [ ] 전환율 모니터링

### 알려진 한계 (수용됨)

- **Chrome iOS 시크릿 모드 앵커광고 플로팅**: 코드로 해결 불가. 실사용자 영향 미미.
- **Cloudflare robots.txt 자동 삽입**: AI Audit 규칙. 다음 인증 정상. 무해.

### 일정

```
4/27~28 — 절대 건드리지 말 것 (재크롤링 대기)
4/29 (수) — 데이터 점검
4/30 (목) — D-1 점검
5/1 (금) — 시즌 진입
```
