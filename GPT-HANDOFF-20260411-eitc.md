# GPT Handoff — 2026-04-11 (eitc.fazr 세션 3 최종)

> Claude Code 세션 최종 상태. PR-4 + PR-4.1 완료. 라이브 배포 + 환경변수 + 검색엔진 키 + AdSense 슬롯 전부 반영.

---

## 프로젝트 상태: ✅ 라이브 운영 중

- **사이트**: https://eitc.fazr.co.kr
- **총 페이지**: 10개 (홈 + calculator + eligibility + faq + updates + 글 5편) + not-found
- **GitHub**: defazr/eitc.fazr (main branch, 최신 commit `544c14d`)
- **Vercel**: eitc-fazr 프로젝트, GitHub 자동 배포

---

## 전체 커밋 히스토리

```
544c14d feat(pr-4.1): not-found + 옛 slug 301 + 홈 가이드 카드 + support.fazr cross-link
a2e0ae3 feat(eitc): 검색엔진 verification 키 + AdSense 슬롯 eitc.fazr 전환
25e8f21 fix(pr-4): 계산기 단위 명시 + FAQ 카드 콘텐츠 정합성
201022e merge: PR-4 콘텐츠 투입 + 배포 준비
000dfe0 feat(pr-4): 콘텐츠 투입 + 마크다운 전환 + smoke test
5eba628 docs: session 2 handoff — PR-1~3 완료 기록
b0a4f5b feat(pr-3): implement calculator + eligibility pages
a204dd0 feat(pr-2): copy calc.fazr engine + add eitc.fazr wrappers
652755e chore(pr-1): remove regions, rename to eitc, update metadata
808b0d6 chore: initial commit (copied from support.fazr)
```

---

## 완료된 PR 요약

| PR | commits | 내용 |
|---|---|---|
| PR-1 | `652755e` | regions 삭제 + 고유가→근로·자녀장려금 텍스트 치환 + 메타데이터 |
| PR-2 | `a204dd0` | calc.fazr 엔진 5파일 복사 + wrapper/eligibilityGuard/flags, 59 테스트 |
| PR-3 | `b0a4f5b` | calculator + eligibility 페이지 재구현 |
| PR-4 | `000dfe0`→`a2e0ae3` | 콘텐츠 투입 + ReactMarkdown + FAQ 15개 + Updates 5편 + BUG 수정 + 검색엔진 키 교체 + AdSense 슬롯 7개 |
| PR-4.1 | `544c14d` | not-found 404 + 옛 slug 301 redirect + 홈 가이드 카드 + support.fazr cross-link |

---

## 이번 세션 (세션 3) 작업 전체

### PR-4: 콘텐츠 투입 + 배포 준비
- 홈 page.tsx: content v1.1 기준 텍스트 교체 + 핵심 3카드 + 일정 섹션
- FAQ 15개: src/data/faq.ts 신규 + ReactMarkdown 렌더 + JSON-LD
- Updates 5편: 마크다운 본문 투입, oil-subsidy 잔재 완전 제거
- [slug]/page.tsx: dangerouslySetInnerHTML → ReactMarkdown 전환, 요약 박스 하드코딩 제거
- DisclaimerBanner: SSOT v1.2 면책 문구 반영
- react-markdown + remark-gfm 설치
- smoke test 2개 추가 (총 61개 통과)
- UPDATE_SLUGS 상수 배열 추가

### BUG 수정 (commit `25e8f21`)
- BUG-1: 계산기 총급여액 라벨 "연간" 명시 + placeholder 예시 + helper text
- BUG-2: FAQ debt 카드 → "빚 때문에 막막하다면" / "개인회생·파산 절차와 자격 조건을 확인해보세요"
- BUG-3: support.fazr 잔재 0건 확인 (클리어)

### 검색엔진 + AdSense 전환 (commit `a2e0ae3`)
- 네이버 verification: support.fazr 키 → eitc.fazr 키 (`3f66...`)
- 다음 robots 주석: support.fazr 키 → eitc.fazr 키 (`8aab...`)
- AdSense 슬롯 6개(support.fazr) → 7개(eitc.fazr) 전량 교체
- ⚠️ support.fazr 슬롯을 eitc.fazr에서 쓰면 AdSense 정책 위반 — Phase 0에서 발견하여 사고 방지

### PR-4.1: 운영 직전 보강 (commit `544c14d`)
- not-found.tsx 신규: 404 페이지 + CTA 3개 (계산기/자격/가이드) + 홈 복귀 버튼
- next.config.ts: 301 redirect 4개 (oil-subsidy 3개 + regions 와일드카드)
- 홈: Updates 최신 3편 카드 그리드 추가 (UPDATES 데이터 재사용, 콘텐츠 작성 0줄)
- 홈: support.fazr cross-link 카드 추가 (emerald 색상)
- footer: support.fazr 서비스 링크 추가

---

## 환경변수 (Vercel — eitc-fazr 프로젝트)

| 변수 | 값 | 상태 |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://eitc.fazr.co.kr` | ✅ 활성 |
| `NEXT_PUBLIC_ADSENSE_PUB_ID` | `pub-7976139023602789` | ✅ 활성 |
| `NEXT_PUBLIC_GA_ID` | `G-0G8PJDCNXP` | ✅ 활성 |

⚠️ 환경변수 이름 `NEXT_PUBLIC_ADSENSE_PUB_ID` 절대 변경 금지 (6곳 참조)

---

## 광고 슬롯 7개 (eitc.fazr 전용)

| # | 페이지 | 슬롯 ID | format |
|---|---|---|---|
| 1 | 홈 (히어로 직후) | 5413912733 | horizontal |
| 2 | 홈 (CTA Links 뒤) | 6166164738 | auto |
| 3 | /calculator (결과 직후) | 6180199492 | rectangle |
| 4 | /eligibility (하단) | 8057830900 | auto |
| 5 | /faq (멀티플렉스) | 3554036151 | autorelaxed |
| 6 | /updates/[slug] (본문 중간) | 6086273688 | rectangle |
| 7 | /updates (목록 중간) | 2240954488 | autorelaxed |

---

## 라이브 검증 최종 결과 (2026-04-11)

| 항목 | 결과 |
|---|---|
| AdSense | `ca-pub-7976139023602789` ✅ |
| GA4 | `G-0G8PJDCNXP` ✅ |
| 네이버 verification | 메타 태그 존재 ✅ |
| 다음 robots 주석 | `8aab...` ✅ |
| 홈 광고 슬롯 | 2개 (5413912733, 6166164738) ✅ |
| robots.txt | Allow: / + sitemap ✅ |
| 404 페이지 | HTTP 404 정상 반환 ✅ |
| 옛 slug redirect | 308 permanent → 새 slug ✅ |
| regions redirect | 308 → / ✅ |
| 홈 update slugs | 3개 노출 ✅ |
| support.fazr 노출 | 5건 (홈 + footer) ✅ |
| 빌드 | 15페이지 + not-found ✅ |
| 테스트 | 61개 통과 ✅ |

---

## 다음 작업

### 운영 단계 (사용자 직접 처리)
1. GSC: sitemap 제출 + 10개 URL 색인 요청
2. 네이버 서치어드바이저: 사이트 등록 + sitemap + 수집 요청
3. 다음 웹마스터도구: 사이트 등록 + sitemap
4. AdSense: eitc.fazr.co.kr 사이트 추가 (도메인 승인 완료 상태)
5. 모바일 전수 테스트: 10개 페이지 실기기 확인

### PR-5 백로그 (5월 첫 주 검토)
- 키워드 보완 (근로장려금 기준/조회/조건 등)
- 내부 링크 보강 (홈 → Updates 추가 동선)
- 새 FAQ 3~5문항 또는 새 Update 1~2편
- 기존 본문 미세 키워드 자연 삽입 (GPT 검수 후)

---

## 기술 주의사항

- engine.ts 직접 import 금지 → wrapper.ts (lib/eitc barrel) 경유
- 디자인 불변 (shadcn/ui + 기존 토큰만)
- 콘텐츠 1:1 복사 원칙 (eitc-content-v1.1.md)
- VignetteCleanup: 광고 body 잔류 정리 — 건드리지 마라
- GA4: next/script + afterInteractive
- NEXT_PUBLIC_ env: 빌드 타임, 변경 후 Vercel 재배포 필수
- robots.txt: src/app/robots.txt/route.ts (GET handler 방식, 정적 파일 전환 불필요)
- redirects: next.config.ts (permanent: true → 308 반환, SEO 효과 301과 동일)
- AdSlot 컴포넌트: NEXT_PUBLIC_ADSENSE_PUB_ID 없으면 빈 placeholder div 렌더
