# GPT 핸드오프 — 2026-04-15 (D-16 to 5/1)

## 오늘 완료한 작업 (세션 5)

### 코드 작업 (Claude Code, 커밋 7b5e35e → 6f03502)

| 커밋 | 작업 |
|---|---|
| `7b5e35e` | Google Ads 전환 추적 — layout.tsx gtag config 1줄 + calculator handleCalculate conversion |
| `47dd770` | GA4 calculator_click 이벤트 추가 — Google Ads 전환 액션과 연동 |
| `b4b5b70` | 푸터 다파라코프 사업자 정보 추가 (자비스앤빌런즈 스타일) |
| `589b2f0` | 푸터 모바일 왼쪽 정렬 (데스크탑 가운데 유지) |
| `3dfae6c` | 카카오톡 채널 버튼 연동 (Kakao SDK 방식) |
| `fda7e5d` | SDK 제거 → URL 이동 방식 전환 (addChannel API 불안정) |
| `72f4f63` | 버튼 아이콘 lucide → 카카오 공식 TALK SVG |
| `6f03502` | TALK 로고 완성 (말풍선 + 내부 TALK 텍스트) |

### 광고 작업 (Google Ads 콘솔, 사용자 직접)
- 신규 구문 키워드 11개 추가
- 키워드 4개 삭제
- 제외 키워드 19개 추가 (15+4)
- 사이트링크 1개 추가 ("2026 지급일 확인")
- 전환 액션: GA4 calculator_click 연동 완료

### 카카오 작업 (사용자 직접)
- 카카오 비즈니스 채널 개설 ("2026 근로 자녀장려금 알리미")
- 사업자 인증 신청 (1~3일 검토 중)
- 첫 소식 발행 ("정기신청 안내")
- 카카오 디벨로퍼스 앱 등록 + JavaScript 키 발급 + 도메인 등록

### 검증 작업 (Claude Code)
- FAQ 15개 톤/수치/연도 정합성 10개 항목 grep 검증 — 전부 통과
- PR-5 백로그에서 "FAQ 톤 조정" 완전 제외
- PR-5 백로그 확정안 갱신 (Keyword Surfer 데이터 반영)

## 기술 결정 사항

### Kakao SDK → URL 방식 전환
- `Kakao.Channel.addChannel()` 호출 시 "페이지를 찾을 수 없습니다" 에러 발생
- 채널 자체는 정상 (`https://pf.kakao.com/_dnACX` 접속 OK)
- `window.location.href = https://pf.kakao.com/${channelId}/friend` 방식으로 전환
- 모바일에서 카카오톡 앱 자동 실행 + 안정적
- SDK Script + KakaoInit 컴포넌트 제거 → 페이지 로딩 개선

### Google Ads 전환 추적 구조
- gtag.js는 GA4용 1번만 로드 (중복 없음)
- `gtag('config', 'AW-17095499654')` 1줄 추가로 Ads 동시 처리
- calculator_click: GA4 이벤트 → Google Ads 전환 액션으로 연동
- kakao_channel_click: GA4 + Ads 동시 발화
- blocked 사용자는 전환 미발생 (guard 통과 후에만)

### 푸터 사업자 정보
- 모바일: `text-left` / 데스크탑: `md:text-center`
- 다파라코프 상호 font-medium, 나머지 text-xs muted

## 환경변수 현황

| 변수 | 값 | 상태 |
|---|---|---|
| NEXT_PUBLIC_SITE_URL | https://eitc.fazr.co.kr | 기존 |
| NEXT_PUBLIC_GA_ID | G-0G8PJDCNXP | 기존 |
| NEXT_PUBLIC_ADSENSE_PUB_ID | pub-7976139023602789 | 기존 |
| NEXT_PUBLIC_GOOGLE_ADS_ID | AW-17095499654 | 신규 (4/15) |
| NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID | AW-17095499654/7CuiCPDLt5scEIa_4tc_ | 신규 (4/15) |
| NEXT_PUBLIC_KAKAO_CHANNEL_ID | _dnACX | 신규 (4/15) |
| NEXT_PUBLIC_KAKAO_JS_KEY | 30bffe2bb34f87f77c423d21d98c958c | 신규 (4/15), 미사용 상태 |

## 신규 파일

- `src/components/kakao-channel-button.tsx` — 카카오 채널 추가 버튼 (URL 방식 + TALK SVG + GA4/Ads 전환)

## 삭제 파일

- `src/components/kakao-init.tsx` — SDK 방식 폐기로 삭제

## 4/16 점검 체크리스트

- [ ] 신규 구문 키워드 11개 노출 시작 여부
- [ ] 사이트링크 "2026 지급일 확인" 승인 여부
- [ ] Google Ads 전환수 1+ 표시 (calculator_click)
- [ ] 카카오 채널 친구 수 확인
- [ ] 카톡 버튼 PC/모바일 정상 작동
- [ ] 카카오 사업자 인증 결과
- [ ] GA4 kakao_channel_click 이벤트 누적
- [ ] 캠페인 보고서 csv (4/13~4/15 3일치)

## 앞으로 일정

| 날짜 | 할 일 |
|---|---|
| 4/16 | 종합 점검 + GA4 이벤트 정리 |
| 4/17~18 | 카카오 인증 결과 확인 |
| 4/18 | GSC 데이터 → PR-5 착수 결정 |
| 4/19 | 광고 예산 증액 검토 (10,009 → 15,000) |
| 4/25 | PR-5 완료 + 콘텐츠 동결 |
| 4/29 | 카톡 첫 알림 발송 (D-2) |
| 5/1 | 골든타임 시작 |

## PR-5 백로그 (확정안)

필수 3개 (4/18 GSC 확인 후 착수):
1. FAQ Q16 "미신청" (월 22,200)
2. FAQ Q17 "홈택스" (월 4,500+)
3. /eligibility 메타 "대상자 확인" (월 4,400+)

선택 1개 (GSC 보고 결정):
4. Update "지급일 총정리" (월 5,000+)
