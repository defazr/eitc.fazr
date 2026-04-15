# eitc.fazr 세션 핸드오프 — 2026-04-15 갱신 (D-16 to 5/1)

## 프로젝트 상태: ✅ 라이브 + 광고/전환/카톡 3중 인프라 구축

- 사이트: https://eitc.fazr.co.kr
- GitHub: defazr/eitc.fazr (main)
- 최신 commit: 6f03502
- D-Day: 2026-05-01 (정기 신청 시작)

## 완료된 PR 전체

| PR     | commit            | 내용                                                              |
|--------|-------------------|-------------------------------------------------------------------|
| PR-1   | 652755e           | regions 삭제 + 텍스트 치환                                        |
| PR-2   | a204dd0           | calc.fazr 엔진 이식 (59 테스트)                                   |
| PR-3   | b0a4f5b           | calculator + eligibility 페이지                                   |
| PR-4   | 000dfe0 → a2e0ae3 | 콘텐츠 + 마크다운 + BUG + 검색엔진 + AdSense 7슬롯                |
| PR-4.1 | 544c14d → dd4fd1c | not-found + 301 + 홈 카드 + cross-link + 스크롤 UX + 카드 문구    |
| PR-4.2 | 7a0a544 → 3a89aa2 | og 이미지 3종 + 메타 병합 함정 보강                               |
| PR-4.3 | 7b5e35e           | Google Ads 전환 추적 (gtag config 1줄 + 계산기 버튼 conversion)   |
| PR-4.4 | 47dd770           | GA4 calculator_click 이벤트 추가                                  |
| PR-4.5 | b4b5b70 → 589b2f0 | 푸터 다파라코프 사업자 정보 + 모바일 왼쪽 정렬                     |
| PR-4.6 | 3dfae6c → 6f03502 | 카카오톡 채널 버튼 (SDK→URL 방식, TALK 로고, GA4+Ads 전환)        |

## 환경변수 (Vercel eitc-fazr Production/Preview/Development)

- NEXT_PUBLIC_SITE_URL = https://eitc.fazr.co.kr
- NEXT_PUBLIC_GA_ID = G-0G8PJDCNXP
- NEXT_PUBLIC_ADSENSE_PUB_ID = pub-7976139023602789 (코드에서 ca- 접두사 자동 추가)
- NEXT_PUBLIC_GOOGLE_ADS_ID = AW-17095499654
- NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID = AW-17095499654/7CuiCPDLt5scEIa_4tc_
- NEXT_PUBLIC_KAKAO_CHANNEL_ID = _dnACX
- NEXT_PUBLIC_KAKAO_JS_KEY = 30bffe2bb34f87f77c423d21d98c958c (미사용, URL 방식 전환)

## 검증 완료

- ✅ 빌드 15페이지 + not-found
- ✅ 테스트 61개 통과
- ✅ FAQ 15개 톤/수치/연도 정합성 (Q1~Q15, 2024 잔재 0)
- ✅ Update 5편 반기 종료 톤 정확
- ✅ og 이미지 3종 (default/calculator/guide) 1200x630
- ✅ 검색엔진 메타 (네이버/다음 verification + GSC DNS 자동)
- ✅ AdSense 슬롯 7개 (eitc.fazr 전용)
- ✅ Google Ads 전환 추적 (HTML gtag config + JS 청크 conversion ID 확인)
- ✅ gtag.js 1회만 로드 (GA4 + Ads 공유, 중복 없음)
- ✅ 301 리다이렉트 (oil-subsidy 3개 + regions/*)
- ✅ not-found CTA 3개
- ✅ 스크롤 UX (로고 top scroll + route change top scroll)
- ✅ 홈 카드 3개 정확 (고유가 피해지원금 / 최저가 주유소 찾기 / 월급 실수령액 계산기)
- ✅ GA4 calculator_click 이벤트 (DebugView 발화 확인)
- ✅ 푸터 사업자 정보 (다파라코프, 모바일 왼쪽/데스크탑 가운데)
- ✅ 카카오톡 채널 버튼 (URL 방식 + TALK 로고 + GA4/Ads 전환 추적)

## Google Ads 캠페인 (시작: 2026-04-13)

- 캠페인명: 근로 자녀장려금
- 일예산: 10,009원
- 입찰 전략: 클릭수 최대화 (학습 중)
- 전환 액션: 계산기 "계산하기" 버튼 클릭 시 발화 (guard 통과 후에만)
- 첫날 성과 (4/13):
  - 노출수 405 / 클릭수 36 / CTR 8.89% / 평균 CPC 288원
  - 비용 10,369원 / 전환수 0 (추적 학습 중)

## 검색엔진 등록 상태

- ✅ GSC: 사이트맵 등록 완료
- ✅ 네이버 서치어드바이저: 사이트맵 등록 완료
- ✅ 다음 웹마스터도구: 사이트맵 등록 완료
- ⏸ 색인 요청: 보류 (오류 확인 후 일괄)

## PR-5 백로그 (확정안 — 2026-04-14 갱신)

### 결정 근거
Keyword Surfer 데이터 분석 결과, 월 36,000+ 검색량 키워드를 흘리고 있음 확인.
"수정"이 아니라 "확장"으로 방향 확정. 기존 콘텐츠는 동결.

### 필수 3개 (4/18 GSC 데이터 확인 후 즉시 착수)

**1. FAQ Q16 추가 — "미신청"** (월 22,200)
- 키워드: 근로장려금 미신청 / 기한 후 신청
- 답변 코어:
  - 기한 후 신청 가능: 6/2 ~ 11/30
  - 산정액의 95% 지급
  - 11/30 이후엔 영구 소멸
- 내부 링크: → 자격 확인 / → 계산기

**2. FAQ Q17 추가 — "홈택스"** (월 4,500+)
- 키워드: 홈택스 근로장려금 / 국세청근로장려금 / 홈택스 근로장려금 대상자 확인
- 답변 코어: 홈택스 웹 / 손택스 앱 단계별 가이드
  - 안내문 개별인증번호 + 주민번호 뒷자리 입력
  - 또는 공동인증서/간편인증 로그인
- Q12와 차별화: Q12는 4가지 방법 비교, Q17은 홈택스 단일 집중 가이드

**3. /eligibility 메타 수정** (월 4,400+)
- title: "근로장려금 대상자 확인 (자격 조건 5문항 체크) | eitc.fazr"
- description에 "대상자 확인" 자연 포함
- H1은 그대로, 부제(subtitle)에 "대상자 확인" 1회 노출
- 코드 수정 위치: src/app/eligibility/page.tsx 메타데이터

### 선택 1개 (GSC 데이터 보고 결정)

**4. Update 신규 1편 — "2026 근로/자녀장려금 지급일 총정리"** (월 5,000+)
- 키워드: 2026 근로장려금 지급일(3,920) / 6월 근로장려금 지급일(720) / 2026 자녀장려금 지급일(1,440)
- 5~6월 시즌 폭발 예정
- **결정 기준**: GSC에서 지급일 키워드 노출 약하면 작성, 이미 강하면 스킵

### 절대 안 건드림 (재확인)
- 기존 FAQ Q1~Q15 톤/수치
- Update 5편 본문
- 430만원 합산 프레임
- 사이트 구조/디자인
- 계산 엔진 (engine.ts)
- VignetteCleanup

### 작업 일정
- 4/16: 광고 전환 추적 점검 (혼자)
- 4/18: GSC 데이터 + Keyword Surfer 교차검증
- 4/18~25: PR-5 작업
- 4/25: 완료 + 콘텐츠 동결
- 4/28~29: 모니터링만
- 5/1: 골든타임

### 키워드 풍경 메모 (참고)
- 근로자 장려금 60,500 (오타 변형, GSC 교차검증 필요)
- 근로장려금 신청 33,100 — 대응 중
- 근로장려금 미신청 22,200 — Q16으로 흡수 예정
- 근로장려금 조건 14,800 — 대응 중
- 근로 장려금 지급액 조회 6,600 — /calculator로 흡수
- 근로장려금 조건 확인 6,600 — /eligibility로 흡수
- 홈택스 근로장려금 2,900 — Q17로 흡수 예정
- 근로장려금 대상자 확인 3,600 — /eligibility 메타로 흡수 예정

## 다음 만남 예정

- 4월 16일경: 광고 전환수 추적 이상 여부 점검
- 4월 18일경: GSC 첫 트래픽 데이터 → PR-5 키워드 보강 작전
- 4월 25일까지: PR-5 작업 완료 목표
- 5월 1일: 골든타임 시작

## 기술 핵심 규칙

- engine.ts 직접 import 금지 → @/lib/eitc barrel 경유
- 디자인 불변 (shadcn/ui 기존 토큰만)
- 콘텐츠 1:1 복사 원칙 (eitc-content-v1.1.md)
- VignetteCleanup 변경 금지
- NEXT_PUBLIC_ env: 빌드 타임 인라인, 변경 후 캐시 없이 재배포 필수
- robots.txt: route.ts GET handler 방식
- gtag.js 1회만 로드 (GA4 + Google Ads 같은 gtag 공유)
- Next.js metadata 병합: 페이지별 openGraph 오버라이드 시 글로벌 필드 반드시 명시
- 카카오 연동은 SDK 없이 URL 방식 (Kakao.Channel API 불안정 이슈)
