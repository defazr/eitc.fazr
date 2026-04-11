# GPT-HANDOFF — 2026-04-11 Session 2

> Claude Code → GPT(Claude UI) 핸드오프 문서
> 작성: Claude Code (eitc 세션)
> 날짜: 2026-04-11

## 세션 요약

이 세션에서 eitc.fazr 프로젝트의 **PR-1 ~ PR-3**을 모두 완료했다.
support.fazr 복사본에서 출발하여 근로·자녀장려금 사이트로 전환하는 핵심 작업이 끝났다.

## 완료된 작업

### 0단계: 사전 준비
- `.git` 재초기화 → `https://github.com/defazr/eitc.fazr.git` remote 연결
- 프로젝트 구조 분석 (`eitc-analysis.md`)
- 근로장려금 산정표 수집 + SSOT 초안 작성 (`eitc-ssot.md`)
- SSOT v1.2 저장 (`eitc-ssot-v1.2.md`, 726줄)
- 환경 점검 (`eitc-env-check.md`)

### PR-1 (commit `652755e`)
- regions 라우트 삭제 (src/app/regions/, regions.json, types.ts)
- "고유가 피해지원금" → "근로·자녀장려금" 전역 치환 (67건 → 0건)
- "support.fazr" → "eitc.fazr" (9건 → 0건)
- subsidy.ts 삭제 + 빈 스텁 적용
- 메타데이터 전면 교체 (layout, sitemap, robots, package.json)

### PR-2 (commit `a204dd0`)
- calc.fazr 엔진 6파일 복사 (commit 6702242, diff 검증 완료)
- src/lib/eitc/ 구조:
  - engine.ts (핵심 엔진, 수정 금지)
  - wrapper.ts (F-1: 자녀세액공제 차감 + guardInput)
  - eligibilityGuard.ts (F-2: UI 차단, 우선순위 5단계)
  - flags.ts (F-4: feature flags)
  - index.ts (barrel, engine 직접 노출 차단)
- src/data/taxRules/ 4파일 (eitcTable, ctcTable, types, 2026)
- vitest 설정 + 59개 테스트 전부 통과
- engine 직접 import 0건 검증

### PR-3 (commit `b0a4f5b`)
- /eligibility 재구현: 5문항 체크리스트 + 3분기(eligible/reduced/blocked)
- /calculator 재구현: 3카드 폼 + 상세 결과 + eligibility guard 선행
- 보완 패치 5개 전부 적용:
  - 패치1: 숫자 입력 (type=text, inputMode=numeric, 콤마 제거)
  - 패치2: calculator에서 eligibility guard 선 실행
  - 패치3: breakdown 규칙 (eitc=최종+플래그, ctc=3단계)
  - 패치4: 0원 결과 3상태 분기
  - 패치5: 단일 FormState 객체
- npm run build 성공, TypeScript 0 에러

## 현재 프로젝트 상태

### 파일 구조 (src/)
```
src/
├─ app/
│  ├─ layout.tsx (메타데이터 완료)
│  ├─ page.tsx (PR-1 치환만, PR-4에서 재작성 필요)
│  ├─ calculator/ (PR-3 완료)
│  ├─ eligibility/ (PR-3 완료)
│  ├─ faq/page.tsx (PR-1 치환만, PR-4에서 재작성 필요)
│  ├─ updates/ (PR-1 치환만, PR-4에서 재작성 필요)
│  ├─ sitemap.ts (완료)
│  └─ robots.txt/ (완료)
├─ components/ (전부 재사용, 변경 최소)
├─ data/
│  ├─ banner.ts (완료)
│  ├─ gov-links.ts (미변경)
│  ├─ updates.ts (PR-4에서 교체)
│  └─ taxRules/ (PR-2에서 완료)
└─ lib/
   ├─ eitc/ (PR-2에서 완료, 테스트 포함)
   └─ utils.ts
```

### Git 이력
```
b0a4f5b pr-3/calculator-and-eligibility (HEAD)
a204dd0 pr-2/engine-and-wrappers
652755e pr-1/cleanup-and-rename
808b0d6 main: initial commit
```

### 테스트
- 59개 전부 통과 (engine 12 + wrapper 7 + guard 6 + random 15 + appendix1 19)
- npm run build 성공

### 남은 잔재
- `src/data/updates.ts`: slug에 "oil-subsidy" 포함 (PR-4에서 전면 교체)
- react-markdown 미설치 (PR-4에서 설치)
- git push 아직 안 함 (사용자 확인 대기)

## PR-4 작업 범위 (다음 세션)

1. **홈 페이지** (`src/app/page.tsx`) 재작성
2. **FAQ** (`src/app/faq/page.tsx`) 15개 질문으로 교체
3. **updates.ts** 5편 교체 (content v1.1.md 기준)
4. **updates/[slug]/page.tsx** 마크다운 렌더링 (react-markdown + remark-gfm)
5. **Vercel 프로젝트 생성** + 도메인 연결
6. **git push** (전 브랜치 merge → main → push)

## 핵심 주의사항

1. **engine.ts 직접 import 금지** — wrapper.ts만 경유
2. **디자인 불변** — shadcn/ui 기존 것만, 신규 금지
3. **콘텐츠 1:1 복사** — 수치·문장 변경 금지
4. **SSOT**: `eitc-ssot-v1.2.md`가 최종 출처
5. calc.fazr 경로: `/Users/dapala.corp/python/root/scripts/calc/calc-fazr`
