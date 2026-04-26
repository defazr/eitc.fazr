# GPT 핸드오프 — 2026-04-26 (D-5 to 5/1)

## 세션 주제: Cloudflare ASN 차단 발견/해결 + 내부링크 보강

---

## 긴급 이슈: Cloudflare가 Googlebot 차단하고 있었음

### 발견 경위
- GSC URL 검사에서 신규 5개 글 "액세스 금지(403)" + "크롤링됨 - 현재 색인이 생성되지 않음"
- GPT가 Cloudflare Bot Fight Mode / ASN 차단 가설 제시
- 사용자가 Cloudflare WAF 확인 -> ASN 15169(Google) 포함된 차단 규칙 발견

### 원인
- Cloudflare WAF에서 ASN 15169(Google 인프라) 차단
- Googlebot이 페이지 접근 시 403 응답 -> 색인 불가
- 기존 글: 보안 강화 전에 이미 색인됨 -> 살아있음
- 신규 5개 글: 보안 강화 후 발행 -> 처음부터 차단 -> 색인 실패

### 해결
- 사용자가 Cloudflare WAF 규칙 수정하여 ASN 차단 해제 (15:35경)
- Claude Code curl 검증: Googlebot UA + 네이버봇(Yeti) UA -> 6개 URL 전부 HTTP 200
- GSC에서 5개 URL 색인 요청 완료
- GSC sitemap 재제출 완료

### 타임라인
```
4/26 15:35 — Cloudflare 차단 해제
4/26 15:45 — GSC 색인 요청 5개 + sitemap 재제출
4/27~28 — Googlebot 재크롤링 대기
4/28~29 — 색인 생성
4/30 — 검색결과 노출 시작
5/1 — 시즌 진입 (아슬아슬)
```

### 미적용 안전망 (시즌 후 선택)
- Cloudflare Custom Rule: `(cf.client.bot)` -> Skip all managed challenges
- 검증된 검색봇 자동 허용

---

## 코드 변경: 내부링크 보강 (`f40d575`)

### 1. hometax-application-guide 안내문 섹션 추가
- **파일**: `src/data/updates.ts`
- **위치**: "안내문을 못 받으면 신청 못 하나요?" 섹션 바로 위
- **내용**: "안내문 받았다면 이렇게 진행하세요" — 진행 순서 4단계, 국세청 판정 의미 설명

### 2. /eligibility 결과 하단 CTA
- **파일**: `src/app/eligibility/page.tsx`
- **조건**: `result.status === "eligible" || result.status === "reduced"` 일 때만 표시
- **내용**: "신청 방법 확인하기 ->" -> `/updates/hometax-application-guide` 링크
- blocked일 때는 미표시

### 3. /eligibility 하단 내부링크 섹션
- **파일**: `src/app/eligibility/page.tsx`
- **위치**: DisclaimerBanner 바로 위
- **내용**: "함께 보면 좋은 정보" — hometax-application-guide + late-application-guide 링크

### 4. /calculator 결과 하단 신청 링크
- **파일**: `src/app/calculator/page.tsx`
- **조건**: `isCalculated === true` 일 때만 표시
- **위치**: ShareButtons 바로 위
- **내용**: "신청 준비하기" — hometax-application-guide 링크

---

## 커밋 이력

| 커밋 | 내용 |
|---|---|
| `f40d575` | 내부링크 보강 + hometax 안내�� 섹션 추가 |

---

## 현재 운영 상태

- **최신 commit**: `f40d575`
- **빌드**: 통과
- **테스트**: 61/61 통과
- **페이지 수**: 15개 + not-found
- **FAQ**: 16개

---

## 검증 시나리오 (배포 후)

1. `/updates/hometax-application-guide` -> "안내문 받았다면 이렇게 진행하세요" 섹션 표시
2. `/eligibility` 5문항 -> eligible -> "신청 방법 확인하기" CTA 표시
3. `/eligibility` 5문항 -> reduced -> "신청 방법 확인하기" CTA 표시
4. `/eligibility` 5문항 -> blocked -> CTA 미표시
5. `/eligibility` 하단 "함��� 보면 좋은 정보" 섹션 항상 표시
6. `/calculator` 계산 후 "���청 준비하기" 섹션 표시
7. `/calculator` 계산 전 "신청 준비하기" 미표시

---

## 다음 작업

### 4/27~28 — 절대 건드리지 말 것 (재크롤링 대기)

### 4/29 (수) 데이터 점검
1. GSC 색인 상태 (Cloudflare 풀린 후 변화)
2. GSC 노출/클릭 추이
3. 네이버 변화
4. 광고 전환수
5. 카톡 친구 수 (현재 7명)

### 4/30 (목) D-1 점검
### 5/1 (금) 시즌 진입

### 개발 백로그
1. FAQ Q17 "홈택스" (후순위)
2. Cloudflare verified bots 허용 규칙 (선택)
3. support.fazr -> eitc.fazr 백링크 1~2개

---

## 세션 키 러닝

1. **Cloudflare ASN 차단은 curl로 즉시 검증 가능** — Googlebot UA로 HEAD 요청
2. **GSC 403 = 페이지 문제 아닌 인프라 문제일 수 있음** — WAF/CDN 먼저 의심
3. **기존 글은 되고 신규만 안 되면 -> 시점 차이** — 보안 강화 전/후 색인 여부 확인
4. **내부링크는 결과 페이지에서 다음 액션으로 자연스럽게** — eligible -> 신청 방법, 계산 완료 -> 신청 준비
