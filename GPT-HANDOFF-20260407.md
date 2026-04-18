# GPT Handoff — 2026-04-07

> Claude Code 세션 종료 시점의 프로젝트 상태를 GPT에게 전달하는 문서.

---

## 프로젝트 요약

- **사이트**: https://support.fazr.co.kr
- **목적**: "고유가 피해지원금" SEO 트래픽 선점 → 내부 사이트 트래픽 분산 + 애드센스 수익
- **정책 상태**: 시행 전 (국회 추경 심사 중)
- **기술 스택**: Next.js 16 + TypeScript + Tailwind v4 + shadcn/ui v4

---

## 오늘 완료된 작업

### 구현 (처음부터 끝까지)
- 빈 repo에서 MVP 전체 구현 → Vercel 배포 → 커스텀 도메인 연결
- 103개 페이지 (정적 6 + 지역 89 + 업데이트 3 + 기타)
- 블루 계열 정부/금융 스타일 UI

### SEO
- sitemap.xml (98 URL), robots.txt (다음 웹마스터 인증 포함)
- 네이버 서치어드바이저 메타태그
- 전 페이지 canonical URL + robots index/follow
- OG 이미지 2종 (메인용 + 업데이트용) + 파비콘
- FAQ JSON-LD 구조화 데이터 (10개 항목)

### 콘텐츠
- FAQ 10개 (모든 Q에 "고유가" 키워드, "현재 기준 + 변경될 수 있음" 패턴)
- 업데이트 글 3개 (결론 먼저, 질문형 제목, 문단 2~3줄 컷)

### 내부링크
- 전체 구조 분석 후 약한 연결 5개 해소
- /updates 고립 → 홈/calculator/faq/eligibility에서 유입
- 홈 인링크 → calculator/eligibility/faq에서 돌아오기
- /faq 인링크 강화, eligibility ↔ faq/regions 양방향
- 앵커 텍스트에 "고유가 피해지원금" 키워드 포함

### 애드센스
- AdSlot 컴포넌트 (환경변수 없으면 placeholder)
- 3곳 배치: 메인 Hero 아래, calculator 결과 아래, updates 글 중간
- 테스트 송출 확인 완료 → 현재 OFF (환경변수 비어있음)
- 슬롯 ID: 4106279506, 1480116169, 7853952826

### UI 수정
- 수정 지시서 v1 반영 (UI/UX 5개 + 전환률 4개)
- 햄버거 메뉴: 불투명 배경, 오버레이 bg-black/50, 활성 하이라이트, 스크롤 잠금
- @tailwindcss/typography 설치 (prose 스타일 정상화)

---

## 현재 상태

| 항목 | 상태 |
|---|---|
| 사이트 라이브 | ✅ https://support.fazr.co.kr |
| Vercel 배포 | ✅ GitHub 연동 자동 배포 |
| 애드센스 | ⏸ OFF (코드 준비 완료, env만 넣으면 ON) |
| GA4 | ❌ 미연결 (NEXT_PUBLIC_GA_ID 환경변수 필요) |
| Google Search Console | 🔄 사용자가 수동 색인 요청 중 |
| 네이버 서치어드바이저 | ✅ 등록 완료 |
| 다음 웹마스터 | ✅ 등록 완료 |

---

## 데이터 파일 구조

```
src/data/
├── regions.json    — 89개 인구감소지역 (slug, province, name, type, amount, area)
├── subsidy.ts      — 지원금 기준 + 계산 로직 + 소득 기준표
├── gov-links.ts    — 정부 외부 링크 (현재 비활성, 정책 확정 시 URL 교체)
├── banner.ts       — 스키니바 텍스트 (정책 상태별)
├── updates.ts      — 업데이트 글 3개 (slug, title, description, date, content)
└── types.ts        — Region 타입 정의
```

---

## 광고 확장 계획 (GPT 합의)

현재 3곳만. 트래픽 붙으면 확장:
1. (현재) 메인, calculator, updates/[slug]
2. (2단계) /faq — 체류시간 높음
3. (3단계) /regions/[slug] 일부만
4. (4단계) /eligibility, /regions

---

## 내부링크 구조 (최종)

```
/ (허브) ← 모든 서브페이지에서 돌아옴
 ├ /calculator (전환) ← 인링크 11+개 (가장 강함)
 ├ /eligibility (조건) ↔ /faq, /regions, /updates 양방향
 ├ /regions (롱테일) ↔ /eligibility, /faq 양방향
 │   └ /regions/[slug] × 89 ↔ /calculator, /eligibility, /regions
 ├ /faq (검색) ← eligibility, regions, calculator에서 유입
 └ /updates (신선도) ← 홈, calculator, faq, eligibility에서 유입
```

---

## 다음 할 일

1. **색인 확인** — Search Console에서 14개 핵심 페이지 색인 상태 모니터링
2. **GA4 연결** — 환경변수 NEXT_PUBLIC_GA_ID 설정
3. **카카오톡 공유 테스트** — OG 이미지 정상 출력 확인
4. **모바일 실기기 테스트** — 반응형 + CTA 동작
5. **애드센스 ON** — 트래픽 유입 시작되면 환경변수 추가
6. **콘텐츠 freshness** — 정책 변경 시 updates 글 추가 + data 파일 업데이트

---

## 기술 주의사항 (다음 세션 Claude Code용)

- shadcn/ui v4는 `@base-ui/react` 기반. `asChild` 없음 → `render` prop 사용
- Tailwind v4 플러그인은 `@plugin` 구문 (globals.css)
- `@tailwindcss/typography` 설치됨 → prose 클래스 정상 작동
- Vercel env에 줄바꿈 주의 (`%0A` 문제 발생했었음)
- 정적 페이지가 대부분 → `npm run build`로 103페이지 전부 사전 렌더링
