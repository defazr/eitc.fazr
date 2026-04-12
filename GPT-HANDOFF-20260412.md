# GPT Handoff — 2026-04-12 (eitc.fazr 세션 4 최종)

> Claude Code 세션 4 최종 상태. 홈 카드 문구 정정 + 스크롤 UX + og 이미지 시스템 완비.

---

## 프로젝트 상태: ✅ 라이브 운영 중 + SEO/UX 보강 완료

- **사이트**: https://eitc.fazr.co.kr
- **총 페이지**: 10개 (홈 + calculator + eligibility + faq + updates + 글 5편) + not-found
- **GitHub**: defazr/eitc.fazr (main branch, 최신 commit `3a89aa2`)
- **Vercel**: eitc-fazr 프로젝트, GitHub 자동 배포
- **테스트**: 61개 통과
- **빌드**: 15페이지 정상

---

## 전체 커밋 히스토리

```
3a89aa2 fix(seo): layout.tsx 글로벌 openGraph.url 추가
4f585dd fix(seo): 페이지별 og url/type/locale/siteName 명시 (metadata 병합 함정)
7a0a544 feat(seo): og 이미지 3종 + 페이지별 OpenGraph/Twitter 메타 + article type
dd4fd1c fix(pr-4.1): 홈 카드 3개 문구 정정 + 로고 top scroll + route change 자동 top scroll
5e8cc85 docs: session 3 handoff — PR-4 + PR-4.1 완료, 라이브 배포 기록
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

## 이번 세션 (세션 4) 작업 전체

### 1. 홈 카드 3개 문구 정정 (commit `dd4fd1c`)

| 카드 | 변경 전 | 변경 후 |
|---|---|---|
| support.fazr 제목 | 5월 고유가 피해지원금 | 고유가 피해지원금 |
| fuel.fazr 제목 | 내 유류비 얼마나 줄어드나 | 최저가 주유소 찾기 |
| fuel.fazr 설명 | 유류비 절약 계산기로 확인하기 | 내 주변 가장 싼 주유소를 지도로 확인 |
| calc.fazr 제목 | 다른 계산기도 확인 | 월급 실수령액 계산기 |
| calc.fazr 설명 | 실생활에 필요한 다양한 계산기 | 근로소득세·4대보험·연말정산까지 한곳에 |

### 2. 스크롤 UX 보강 (commit `dd4fd1c`)

- **로고 클릭 top scroll**: 홈에서 "근로·자녀장려금" 로고 클릭 → smooth scroll top
  - 데스크탑 로고 + 모바일 햄버거 "홈" 링크 양쪽 적용
  - 다른 페이지에서는 정상 navigation 유지
  - `handleHomeClick` 핸들러 1개로 통일 (navigation.tsx)
- **route change 자동 top scroll**: 신규 컴포넌트 `ScrollToTopOnNavigation`
  - pathname 변경 감지 → 즉시 top (behavior: "instant")
  - hash 링크(/faq#q5 등) 동작 보존
  - return null — UI 변화 0

### 3. og 이미지 시스템 (commit `7a0a544` → `3a89aa2`)

**이미지 3종** (sharp로 압축, 1200×630):
| 이미지 | 원본 | 용량 |
|---|---|---|
| public/og-default.jpg | 2026 근로 자녀장려금.jpeg (1.5MB) | 62KB |
| public/og-calculator.jpg | 내 장려금 30초 계산.jpeg (1.6MB) | 40KB |
| public/og-guide.jpg | 2026 근로 자녀장려금 가이드.jpeg (2.0MB) | 48KB |

**페이지별 매핑**:
| 페이지 | og 이미지 | og:type |
|---|---|---|
| 홈 (글로벌) | /og-default.jpg | website |
| /calculator | /og-calculator.jpg | website |
| /eligibility | /og-guide.jpg | website |
| /faq | /og-guide.jpg | website |
| /updates | /og-guide.jpg | website |
| /updates/[slug] | /og-guide.jpg | article |

**메타 필드 전 페이지 완비**:
- og:url, og:type, og:locale, og:site_name, og:image (width/height/alt 포함)
- twitter:card (summary_large_image), twitter:image
- updates/[slug]: article:published_time, article:author

### 4. Next.js metadata 병합 함정 발견 + 해결

- Next.js App Router metadata는 **객체 단위 교체** (deep merge 아님)
- 페이지별 openGraph.images 오버라이드 → 글로벌 url/type/locale/siteName 사라짐
- twitter도 동일: images만 박으면 card: "summary_large_image" 사라짐
- **해결**: 전 페이지에 type/locale/siteName/url + card 명시적 포함

### 5. GSC 오류 점검

| 오류 | 진짜 문제? | 조치 |
|---|---|---|
| preload gtag 경고 | ❌ false positive | 무시 |
| _next/chunks "기타 오류" | ❌ GSC 옛 캐시 | "수정 검증 시작" 클릭 |
| googleads/pagead2 robots 차단 | ❌ 구글 자체 정책 | 무시 (모든 AdSense 사이트 동일) |

---

## 환경변수 (Vercel — eitc-fazr 프로젝트)

| 변수 | 값 | 상태 |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://eitc.fazr.co.kr` | ✅ 활성 |
| `NEXT_PUBLIC_ADSENSE_PUB_ID` | `pub-7976139023602789` | ✅ 활성 |
| `NEXT_PUBLIC_GA_ID` | `G-0G8PJDCNXP` | ✅ 활성 |

---

## 라이브 검증 최종 결과 (2026-04-11~12)

| 항목 | 결과 |
|---|---|
| 홈 카드 3개 새 문구 | ✅ |
| 옛 문구 잔재 | 0건 ✅ |
| og-default.jpg | HTTP 200, 홈 og:image ✅ |
| og-calculator.jpg | HTTP 200, /calculator og:image ✅ |
| og-guide.jpg | HTTP 200, /faq /updates og:image ✅ |
| 전 페이지 og:url | ✅ (홈~updates/[slug]) |
| 전 페이지 og:site_name + og:locale | ✅ |
| twitter:card summary_large_image | 6건 ✅ |
| updates/[slug] type=article | ✅ + publishedTime + author |
| 옛 /og/og-main.jpg 경로 잔재 | 0건 ✅ |
| 빌드 | 15페이지 ✅ |
| 테스트 | 61개 ✅ |

---

## 다음 작업

### 운영 단계 (사용자 직접 처리, 일부 진행 중)
1. GSC: 색인 요청 일괄 + _next/chunks "수정 검증 시작"
2. 네이버 서치어드바이저: 사이트 등록 + sitemap + 수집 요청
3. 다음 웹마스터도구: 사이트 등록 + sitemap
4. AdSense: eitc.fazr.co.kr 사이트 추가
5. 모바일 전수 테스트 (스크롤 UX 5개 항목 포함)
6. 페이스북/카카오톡 디버거로 og 카드 미리보기 확인

### PR-5 백로그 (5월 첫 주 검토)
- 키워드 보완 (근로장려금 기준/조회/조건 등)
- 내부 링크 보강 (홈 → Updates 추가 동선)
- 새 FAQ 3~5문항 또는 새 Update 1~2편
- 기존 본문 미세 키워드 자연 삽입 (GPT 검수 후)
- 기존 public/og/ 디렉토리 (og-main.jpg, og-updates.jpg) 정리

---

## 기술 주의사항

- engine.ts 직접 import 금지 → wrapper.ts (lib/eitc barrel) 경유
- 디자인 불변 (shadcn/ui + 기존 토큰만)
- 콘텐츠 1:1 복사 원칙 (eitc-content-v1.1.md)
- VignetteCleanup: 광고 body 잔류 정리 — 건드리지 마라
- GA4: next/script + afterInteractive
- NEXT_PUBLIC_ env: 빌드 타임, 변경 후 Vercel 재배포 필수
- robots.txt: src/app/robots.txt/route.ts (GET handler 방식)
- redirects: next.config.ts (permanent: true → 308)
- AdSlot 컴포넌트: NEXT_PUBLIC_ADSENSE_PUB_ID 없으면 빈 placeholder
- **Next.js metadata 병합 함정**: openGraph/twitter 페이지별 오버라이드 시 글로벌 필드(url/type/locale/siteName/card) 반드시 명시
- ScrollToTopOnNavigation: hash 링크 보존, behavior "instant"
- ScrollTopButton: 기존 "맨 위로" 플로팅 버튼 — 건드리지 마라
