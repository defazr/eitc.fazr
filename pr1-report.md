# PR-1 완료 리포트
생성일: 2026-04-11

## 처리 결과
- [x] Initial commit 생성 (808b0d6)
- [x] pr-1/cleanup-and-rename 브랜치 생성
- [x] regions 삭제 (src/app/regions/, src/data/regions.json, src/data/types.ts)
- [x] "고유가" 치환: 67건 → 0건
- [x] "support.fazr" 치환: 9건 → 0건
- [x] "/regions" 참조 제거: 전부 → 0건
- [x] subsidy.ts 삭제 (calculator/page + eligibility/page에 임시 스텁 적용)
- [x] 메타데이터 변경 (layout.tsx, sitemap.ts, robots, updates/layout, package.json)
- [x] package.json name: "eitc-fazr"

## 검증 결과
```
grep "고유가" src/     → 0건 ✓
grep "support.fazr" src/ → 0건 ✓
grep "support-fazr" package.json → 0건 ✓
grep "/regions" src/   → 0건 ✓
```

## TypeScript 에러
```
npx tsc --noEmit → 에러 0건 ✓
```
calculator/page.tsx와 eligibility/page.tsx에 임시 스텁을 넣어 빌드 에러 방지함.
PR-2에서 calc.fazr 엔진으로 교체 시 스텁 제거 예정.

## 삭제된 파일
- src/app/regions/ (디렉터리 전체)
- src/app/regions/[slug]/ (디렉터리 전체)
- src/data/regions.json
- src/data/types.ts
- src/data/subsidy.ts

## 수정된 파일
- .gitignore (작업문서 제외 규칙 추가)
- package.json (name → eitc-fazr)
- src/app/layout.tsx (메타데이터 전면 교체)
- src/app/page.tsx (히어로, 통계, CTA 교체 + SUBSIDY_CONFIG 제거)
- src/app/sitemap.ts (regions 제거 + baseUrl 변경)
- src/app/robots.txt/route.ts (sitemap URL 변경)
- src/app/calculator/layout.tsx (메타데이터)
- src/app/calculator/page.tsx (텍스트 + subsidy 스텁)
- src/app/eligibility/page.tsx (텍스트 + subsidy 스텁)
- src/app/faq/page.tsx (텍스트)
- src/app/updates/page.tsx (텍스트)
- src/app/updates/layout.tsx (OG URL)
- src/app/updates/[slug]/page.tsx (regions 링크 교체)
- src/components/navigation.tsx (로고 + 메뉴)
- src/components/footer.tsx (텍스트 + copyright + regions 링크 제거)
- src/data/banner.ts (텍스트)
- src/data/updates.ts (텍스트)

## 다음 단계
PR-2: calc.fazr 엔진 5파일 복사 + 래퍼 3개 작성
