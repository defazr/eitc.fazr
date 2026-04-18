# GPT Handoff — 2026-04-07 (v2, 세션 종료)

> Claude Code 세션 최종 종료 시점의 프로젝트 상태.

---

## 프로젝트 상태: ✅ 운영 중

- **사이트**: https://support.fazr.co.kr
- **총 페이지**: 103개
- **기술**: Next.js 16 + TypeScript + Tailwind v4 + shadcn/ui v4 + Pretendard

---

## 오늘 세션 후반 작업 (v1 핸드오프 이후)

### 내부링크 보강
- /updates 고립 해소 → 홈/calculator/faq/eligibility에서 유입
- 홈 인링크 → calculator/eligibility/faq에서 돌아오기
- /faq 인링크 강화, eligibility ↔ faq/regions/updates 양방향
- 앵커 텍스트에 "고유가 피해지원금" 키워드 포함

### 애드센스 슬롯
- 활성 3곳 (메인/calculator/updates)
- placeholder 3곳 추가 (/faq/regions[slug]/eligibility) — 나중에 확장용
- 테스트 완료 후 OFF 상태 (env 비어있음)

### SNS 공유 버튼
- 모바일: navigator.share() + 링크복사 (카카오톡 포함 전체 앱 커버)
- PC: 네이버, X(트위터), 페이스북, 링크복사
- SDK 없음, URL share 방식만
- 브랜드 컬러 배경 + 흰색 텍스트 (가짜 아이콘 제거)

### 디자인 시스템 적용 (ui-ux-pro-max-skill)
- SSOT에 있었는데 빠뜨려서 뒤늦게 적용 — 교훈 남김
- 컬러: Primary #0369A1(딥블루), Background #F8FAFC, Text #020617
- 폰트: Pretendard CDN (한국어 최적화)
- 스키니바 이모지 → SVG 아이콘, prefers-reduced-motion 대응
- 전 클릭 요소 cursor-pointer + transition 200ms
- 버튼 높이 44px (WCAG 터치 타겟)

### CTR 최적화
- Hero: "고유가 피해지원금 대상인지 지금 바로 확인하세요"
- 숫자 강조: text-blue-600 font-bold (70%, 25만원 등)
- /eligibility 요약 박스 추가

### 푸터 정리
- 관련 서비스 6개 교체 (최저가 주유소, 오늘의 기름값, 개인회생 진단, 돈 계산기, 부가세 워크벤치, LOTTO NFG)

### GA4 연결
- dangerouslySetInnerHTML → next/script + afterInteractive (Next.js 권장)
- G-GQTTM24X4D 정상 작동 확인

---

## 현재 환경변수 (Vercel)

| 변수 | 값 | 상태 |
|---|---|---|
| `NEXT_PUBLIC_GA_ID` | `G-GQTTM24X4D` | ✅ 활성 |
| `NEXT_PUBLIC_ADSENSE_PUB_ID` | (비어있음) | ⏸ OFF |

---

## 광고 슬롯 현황

| 위치 | 슬롯 ID | 상태 |
|---|---|---|
| 메인 Hero 아래 | 4106279506 | 코드 O, 송출 OFF |
| Calculator 결과 아래 | 1480116169 | 코드 O, 송출 OFF |
| Updates 글 중간 | 7853952826 | 코드 O, 송출 OFF |
| /faq 하단 | 4106279506 | placeholder만 |
| /regions/[slug] CTA 아래 | 1480116169 | placeholder만 |
| /eligibility 기준표 아래 | 7853952826 | placeholder만 |

광고 ON: `NEXT_PUBLIC_ADSENSE_PUB_ID=pub-7976139023602789` 넣고 재배포.

---

## 내부링크 구조 (최종)

```
/ (허브) ← 모든 서브페이지에서 돌아옴
 ├ /calculator (전환) ← 인링크 11+개
 ├ /eligibility (조건) ↔ /faq, /regions, /updates 양방향
 ├ /regions (롱테일) ↔ /eligibility, /faq 양방향
 │   └ /regions/[slug] × 89 ↔ /calculator, /eligibility, /regions
 ├ /faq (검색) ← eligibility, regions, calculator에서 유입
 └ /updates (신선도) ← 홈, calculator, faq, eligibility에서 유입
```

---

## 디자인 시스템

- 스킬: ui-ux-pro-max-skill 설치됨
- MASTER.md: `design-system/고유가-피해지원금/MASTER.md`
- 스타일: Accessible & Ethical (WCAG AAA)
- 안티패턴: 이모지 아이콘 금지, 저대비 금지, 과도한 모션 금지

---

## 다음 할 일

1. 색인 모니터링 (GSC 14개 핵심 페이지)
2. 카카오톡 OG 공유 테스트
3. 트래픽 유입 시 애드센스 ON
4. 정책 변경 시 updates 글 추가 + data 파일 업데이트
5. 2단계 광고 확장 (/faq → /regions/[slug])

---

## 기술 주의사항

- GA4: next/script + afterInteractive. dangerouslySetInnerHTML 쓰지 마라.
- NEXT_PUBLIC_ env: 빌드 타임. 추가 후 vercel --prod 재배포 필수.
- Vercel env: printf로 줄바꿈 없이 추가 (%0A 문제 방지).
- shadcn v4: asChild → render prop.
- Pretendard: CDN import (globals.css).
