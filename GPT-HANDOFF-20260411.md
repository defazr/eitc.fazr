# GPT Handoff — 2026-04-11

> Claude Code 세션 최종 상태.

---

## 프로젝트 상태: ✅ 운영 중 + 광고 ON + 트래픽 유입 시작

- **사이트**: https://support.fazr.co.kr
- **총 페이지**: 104개 (속보 글 1개 추가)

---

## 이번 세션 작업

### 추경 통과 전면 업데이트
- 스키니바/updates 글/요약 박스/FAQ 전부 "확정" 반영
- 속보 글 신규: "[속보] 26.2조원 국회 통과"
- "심사 중"/"지급 예상" 잔류 전체 제거 (grep + curl 검증)
- SEO: 고유가지원금/민생지원금 키워드 추가
- 정부24 링크: active=false 유지 (4/11 국무회의 이후 활성화)

### 광고 7슬롯 완성
| # | 위치 | 타입 | 슬롯 ID |
|---|---|---|---|
| 1 | 홈 Hero 아래 | 디스플레이 | 4106279506 |
| 2 | Calculator 결과 아래 | 디스플레이 | 1480116169 |
| 3 | Updates 글 중간 | 디스플레이 | 7853952826 |
| 4 | Eligibility 기준표 아래 | 디스플레이 | 1340925456 |
| 5 | Regions/[slug] CTA 아래 | 디스플레이 | 9027843789 |
| 6 | FAQ 하단 | 멀티플렉스 | 8171712676 |
| 7 | Updates 목록 중간 | 멀티플렉스 | 9379409604 |

### iOS Safari 스크롤 버그 수정
- html h-full 제거, body min-h-full 제거
- navigation scroll lock 안전화

### Vignette 광고 충돌 해결
- VignetteCleanup 컴포넌트 (MutationObserver)
- Vignette 광고 닫힌 후 body aria-hidden/overflow:hidden 잔류 자동 정리
- data-menu-open 식별자로 햄버거 메뉴와 구분
- **다른 사이트에서도 재사용 가능**

### 광고 매칭 확인
- "고유가 피해지원금 신청" 경쟁사 광고가 정확히 매칭됨
- AdSense 콘텐츠 관련성 정상

---

## 환경변수 (Vercel)

| 변수 | 값 | 상태 |
|---|---|---|
| `NEXT_PUBLIC_GA_ID` | `G-GQTTM24X4D` | ✅ 활성 |
| `NEXT_PUBLIC_ADSENSE_PUB_ID` | `pub-7976139023602789` | ✅ 활성 |

---

## 다음 작업

1. **4/11 국무회의 후**: gov-links.ts URL 활성화 (정부24 신청 링크)
2. **GA4 + AdSense 대시보드 모니터링**: 첫 수익 확인
3. **FAQ Phase 2**: 추경 통과 반영 FAQ 업데이트
4. **updates.ts summary 필드 구조화**: 요약 박스 글별 분기
5. **콘텐츠 freshness**: 정부 발표에 따라 즉시 업데이트

---

## 기술 주의사항

- VignetteCleanup: 자동 광고(Vignette) body 잔류 정리 — 건드리지 마라
- GA4: next/script + afterInteractive
- NEXT_PUBLIC_ env: 빌드 타임, 변경 후 vercel --prod 필수
- 멀티플렉스 광고: data-ad-format="autorelaxed"
- 정부24 링크: gov-links.ts active=false 유지 (공식 발표 전까지)
