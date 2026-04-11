/**
 * Feature flags for eitc.fazr
 *
 * 원칙: "코드는 준비, 기능은 비활성"
 * v2.0 기능은 타입과 구조만 열어두고 UI에서 숨긴다.
 * 활성화 시 플래그만 true로 변경.
 */
export const FEATURE_FLAGS = {
  /** 반기 신청 UI 노출. v2.0 (2026년 9월 전 활성화 예정) */
  ENABLE_HALF_YEAR_APPLICATION: false,

  /** 장애인 자녀 분리 입력. v2.0 검토 */
  ENABLE_DISABLED_DEPENDENT_INPUT: false,

  /** eligibility 차단 bypass (개발자 모드) */
  BYPASS_ELIGIBILITY_BLOCK: false,
} as const;
