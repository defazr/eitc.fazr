# SESSION HANDOFF — eitc.fazr.co.kr

> 다음 Claude Code 세션이 이 파일을 먼저 읽고 현재 상태를 파악한다.

## 마지막 세션: 2026-04-11 (eitc 전환 세션 1)

### 프로젝트 상태: 🔧 PR-3 완료, PR-4 대기

- **목표 사이트**: https://eitc.fazr.co.kr (근로·자녀장려금)
- **저장소**: https://github.com/defazr/eitc.fazr.git
- **원본**: support.fazr.co.kr (고유가 피해지원금) 복사 후 전환 중
- **배포**: 아직 안 함 (Vercel 프로젝트 미생성)

### 기술 스택

- Next.js 16.2.2 (App Router) + TypeScript
- Tailwind v4 + @tailwindcss/typography
- shadcn/ui v4 (@base-ui/react — render prop 사용)
- vitest v4.1.4 (59 테스트 통과)
- calc.fazr 엔진 (commit 6702242, 수정 금지)

### SSOT

- **eitc-ssot-v1.2.md** (프로젝트 루트, 726줄) — 모든 수치·로직·구조의 최종 출처

### Git 이력

```
b0a4f5b pr-3/calculator-and-eligibility (HEAD)
a204dd0 pr-2/engine-and-wrappers
652755e pr-1/cleanup-and-rename
808b0d6 main: initial commit (copied from support.fazr)
```

아직 push 안 함. 모든 브랜치 로컬에만 존재.

### 완료된 PR

| PR | 커밋 | 내용 |
|---|---|---|
| PR-1 | 652755e | regions 삭제, 텍스트 치환(67→0), 메타데이터 |
| PR-2 | a204dd0 | calc.fazr 엔진 복사, wrapper/guard/flags, 59 테스트 |
| PR-3 | b0a4f5b | calculator+eligibility 페이지 재구현 |

### 엔진 구조 (src/lib/eitc/)

```
src/lib/eitc/
├─ engine.ts        ← calc.fazr eitcCtc.ts 복사 (수정 금지)
├─ wrapper.ts       ← 자녀세액공제 차감 + guardInput (engine 유일 import)
├─ eligibilityGuard.ts ← UI 차단 (engine 미사용)
├─ flags.ts         ← feature flags (반기/장애인/bypass)
├─ index.ts         ← barrel (engine 직접 노출 차단)
└─ __tests__/       ← 5파일 59테스트
```

### 핵심 규칙

1. **engine.ts 직접 import 금지** — wrapper.ts만 경유 (D-1 #3)
2. **디자인 불변** — shadcn/ui 기존만, 신규 컴포넌트/색상 금지
3. **콘텐츠 1:1 복사** — content v1.1.md에서, 수치·문장 변경 금지
4. **body/html 높이 클래스 금지** — iOS 스크롤 버그
5. calc.fazr 경로: `/Users/dapala.corp/python/root/scripts/calc/calc-fazr`

### PR-4 작업 범위 (다음 세션)

1. 홈 페이지 (page.tsx) 재작성
2. FAQ (faq/page.tsx) 15개 질문 교체
3. updates.ts 5편 교체 + react-markdown 설치
4. updates/[slug]/page.tsx 마크다운 렌더링
5. git push (merge → main → push)
6. Vercel 프로젝트 생성 + 도메인 연결

### 남은 잔재

- `src/data/updates.ts`: slug에 "oil-subsidy" (PR-4에서 전면 교체)
- react-markdown 미설치
- `.vercel/` 이전 support 프로젝트 흔적 (삭제 필요)

### 디자인 시스템

- Primary: #0369A1 (딥블루)
- Background: #F8FAFC
- Text: #020617
- design-system/고유가-피해지원금/ (참고용, git 미추적)

### 주의사항

1. **SSOT가 최종 출처** — eitc-ssot-v1.2.md
2. **engine.ts 절대 수정 금지**
3. **디자인 변경 금지** — "예쁘게 개선" 류 차단
4. **body 높이 클래스 금지**
5. **VignetteCleanup 건드리지 마라**
6. **push 전 사용자 확인 필수**
