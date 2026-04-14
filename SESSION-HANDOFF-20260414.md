# eitc.fazr 세션 핸드오프 — 2026-04-14 (D-17 to 5/1)

## 프로젝트 상태: ✅ 라이브 + 광고 캠페인 시작

- 사이트: https://eitc.fazr.co.kr
- GitHub: defazr/eitc.fazr (main)
- 최신 commit: 7b5e35e
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

## 환경변수 (Vercel eitc-fazr Production/Preview/Development)

- NEXT_PUBLIC_SITE_URL = https://eitc.fazr.co.kr
- NEXT_PUBLIC_GA_ID = G-0G8PJDCNXP
- NEXT_PUBLIC_ADSENSE_PUB_ID = pub-7976139023602789 (코드에서 ca- 접두사 자동 추가)
- NEXT_PUBLIC_GOOGLE_ADS_ID = AW-17095499654
- NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID = AW-17095499654/7CuiCPDLt5scEIa_4tc_

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

## PR-5 백로그 (2026-04-18 GSC 데이터 보고 결정)

유지:
1. 누락 키워드 12개 보강 (월 검색량 30,000+)
   - 근로장려금 기준/조회/조건/정기신청
   - 자녀장려금 기준/재산/육아휴직 등
2. 새 Update 1~2편 (선택, 키워드 흡수용)

제외 (검증 결과 이미 OK):
- 3월 반기 신청 톤 조정 (Update + FAQ 모두 "종료" 톤 정확)
- 합산 430만원 프레임 (조건 제약 큼, 안전 표현 유지)
- FAQ 톤/수치 정합성 (전부 통과)
- 콘텐츠 동결 원칙 유지

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
