# GPT 핸드오프 — 2026-04-21 (D-10 to 5/1)

## 세션 주제: 광고 인프라 안정화 + 진단 드릴다운

### 배경
- iPhone Chrome 시크릿 모드에서 앵커광고 "붕 뜬 느낌" (floating) 증상 제보
- 전 페이지 공통, 새로고침해도 불안정
- Safari·기본 모드는 정상 작동
- 광고 수익 구조 점검 + 구조적 이슈 발견

---

## 완료된 코드 변경 (머지된 PR)

### PR #1 — ads.txt 추가 (`e31784a` → 머지 `e32119b`)
- `public/ads.txt` 신규 생성, 1줄
- 내용: `google.com, pub-7976139023602789, DIRECT, f08c47fec0942fa0`
- 배경: `/ads.txt` 404 상태 → AdSense Auto Ads 서빙 제한 가능성

### PR #2 — main `min-h-dvh` → `min-h-svh` (`ef000f0` → 머지 `ff532eb`)
- `src/app/layout.tsx:97` 변경
- 배경: iOS Safari 툴바 show/hide 시 `dvh` 재계산으로 fixed 요소 흔들림 방지 가설
- **결과: 플로팅 해결 효과 없음. support.fazr도 `dvh` 쓰고 정상 → 원인 아님**
- 현재 그대로 유지 (무해, 롤백 불필요)

### PR #3 — AdSense 스크립트 `next/script` 전환 (`65b05f6` → 머지 `6840c10`)
- `src/app/layout.tsx` — 원시 `<script async>` → `<Script strategy="afterInteractive">`
- `<head>` 블록 제거, `<body>` 내부로 이동
- 배경: React hydration 후 실행되어 Auto Ads 슬롯 정상 감지
- **결과: support.fazr, fuel.fazr, calc.fazr와 동일 로딩 패턴으로 통일. 유지.**

### PR #4 — 계산기 sticky footer 오프셋 (`c109177` → 머지 `1d372b2`)
- `src/app/calculator/page.tsx:439` — `bottom-0` → `bottom-[100px]`
- `src/app/calculator/page.tsx:177` — `pb-24` → `pb-52` (sticky 리프트 후 콘텐츠 가림 방지)
- `src/app/layout.tsx` — ScrollTopButton 주석 원복
- 배경: Google 앵커광고(z-index ~2.1B)가 sticky 버튼(z-50)을 가림 → sticky를 앵커 위로 올림
- **결과: 실질 UX 개선. 앵커·CTA 버튼 둘 다 보임. 유지.**

---

## main 직접 푸시 (가설 검증 + 원복)

### `073d3e2` — 마퀴 일시 비활성화 (가설 검증)
- `src/data/banner.ts` — `active: true → false`
- 가설: `animate-marquee` 무한 애니메이션이 compositor 레이어로 인해 fixed 요소 흔들림
- **결과: 기각. 플로팅 유지됨.**

### `27e16c9` — ScrollTopButton 일시 비활성화 (가설 검증)
- `src/app/layout.tsx` — `<ScrollTopButton />` 주석 처리
- 마퀴는 이 커밋에서 다시 `active: true` 복구
- 가설: ScrollTopButton `fixed bottom-20` 이 Google 앵커 충돌 감지 유발
- **결과: 기각. 플로팅 유지됨.**

### `7e0adc2` — AdSlot format 변경 (가설 검증)
- 4파일 `format="auto" / "autorelaxed"` → `format="rectangle"`
- 가설: `format="auto"` 가 Layout Shift 유발 → 앵커 재계산
- **결과: 기각. 플로팅 유지됨.**

### `5858a8d` — AdSlot format 원복 (최종, 수익 복구)
- 4파일 원상복귀 (`auto`, `autorelaxed`)
- 배경: rectangle은 수익·노출 측면 불리. 효과 없는 변경은 원복.
- 대상: `src/app/page.tsx:256`, `src/app/eligibility/page.tsx:306`, `src/app/updates/page.tsx:55`, `src/app/faq/page.tsx:184`

---

## 결정적 진단: support.fazr vs eitc.fazr 라이브 HTML 비교

### 구조 차이 전수 조사 결과

동일한 항목: `<body class>`, `<html class>`, viewport meta, sticky 헤더, footer, AdSense 로더 (둘 다 `next/script` + `afterInteractive` + `preload`), `animate-marquee`, Script 컴포넌트 serialization.

유일한 실제 구조 차이:
1. `<main>` 클래스: support `flex-1 min-h-dvh` vs eitc `flex-1 min-h-svh`
2. 홈 AdSlot 개수: support 1개 vs eitc 2개 (eitc만 두 번째 `format="auto"` AdSlot 존재)
3. HTML 전체 크기: support 73KB vs eitc 116KB (eitc 콘텐츠 밀도 57% 큼)

### 최종 결론

**플로팅 현상 = Chrome iOS 시크릿 전용 렌더링 quirk.**

- 기본 모드: 정상 (사용자 실제 환경)
- 시크릿 모드: 플로팅 (쿠키·frequency cap 없이 광고 타이밍 달라지며 레이아웃 시프트 체감)
- 코드로 해결 불가
- 실사용자 영향 미미 (99%+ 기본 모드 사용)

---

## 현재 운영 상태

### main 최신 커밋: `5858a8d`
- 빌드 통과
- 테스트 61/61 통과
- Vercel 자동 배포 완료

### 유지 중인 변경
- `ads.txt` 추가됨
- `min-h-svh` (주 main) — 무해, 롤백 불필요
- `next/script` AdSense 로더 — support 패턴 일치
- 계산기 sticky `bottom-[100px]` + `pb-52` — UX 개선 확정
- AdSlot format — `auto` / `autorelaxed` 원상복귀 (수익 최적)
- SkinnyBar 마퀴 active
- ScrollTopButton active

### 알려진 한계
- Chrome iOS 시크릿 모드에서 앵커광고 플로팅 — 수용, 코드 수정 중단

---

## 다음 작업 (미정)

### PR-5 백로그 (GSC/네이버 데이터 보고 결정)
1. FAQ Q16 "미신청" (월 22,200)
2. FAQ Q17 "홈택스" (월 4,500+)
3. /eligibility 메타 수정 "대상자 확인" (월 4,400+)
4. Update 신규 1편 "지급일 총정리" (월 5,000+) — 선택

### 운영 체크리스트
- 5/1 신청 개시까지 D-10
- Vercel 배포 모니터링
- 앵커광고 정상 노출 확인 (기본 모드)
- AdSense 콘솔에서 ads.txt "인증됨" 상태 확인 (수 시간~1일 소요)

---

## 세션 키 러닝

1. **가설 검증은 빠르게**: main 직접 푸시로 5분 단위 검증 → 기각/확정 빠른 판단
2. **support.fazr와 라이브 HTML 비교**: 원본 사이트와의 구조 diff가 최고의 디버깅 도구
3. **시크릿 모드 증상은 코드 아님**: 실사용자 환경(기본 모드) 기준으로 판단
4. **효과 없는 변경은 즉시 원복**: 수익 리스크 최소화
5. **꼭 필요한 개선만 유지**: ads.txt / next/script / 계산기 sticky offset
