/**
 * Eligibility UI 차단 로직 (F-2)
 *
 * 엔진과 완전 분리. engine.ts를 import하지 않는다.
 * 엔진 오염 방지를 위해 UI 레벨에서만 차단.
 *
 * blockReasons 우선순위 (UI는 blockReasons[0]만 노출):
 *   1. 재산 2.4억 초과
 *   2. 전문직 사업자
 *   3. 월 500만원 이상 상용근로자
 *   4. 국적 미보유
 *   5. 다른 거주자의 부양자녀
 */

export interface EligibilityCheckInput {
  isKorean: boolean;
  isDependentOfOther: boolean;
  hasProfessionalBusiness: boolean;
  hasHighIncomeEmployee: boolean;
  estimatedProperty: "under_170m" | "170m_to_240m" | "over_240m";
}

export interface EligibilityCheckResult {
  status: "eligible" | "reduced" | "blocked";
  blockReasons: string[];
  warnings: string[];
  canProceedToCalculator: boolean;
}

export function checkEligibility(
  input: EligibilityCheckInput
): EligibilityCheckResult {
  const blockReasons: string[] = [];
  const warnings: string[] = [];

  // 우선순위 순서대로 push (1→5)
  if (input.estimatedProperty === "over_240m") {
    blockReasons.push(
      "가구원 합산 재산이 2.4억원 이상이면 지급 대상에서 제외됩니다."
    );
  }
  if (input.hasProfessionalBusiness) {
    blockReasons.push(
      "전문직 사업자(변호사·의사 등)는 본인 또는 배우자 중 1명이라도 해당하면 수급 대상에서 제외됩니다."
    );
  }
  if (input.hasHighIncomeEmployee) {
    blockReasons.push(
      "본인 또는 배우자가 월평균 근로소득 500만원 이상 상용근로자인 경우 근로장려금을 받을 수 없습니다."
    );
  }
  if (!input.isKorean) {
    blockReasons.push(
      "국적 요건을 충족하지 않습니다. (예외: 국민과 혼인 또는 국민 부양자녀 보유)"
    );
  }
  if (input.isDependentOfOther) {
    blockReasons.push(
      "다른 거주자의 부양자녀로 등록된 경우 독립 신청이 불가합니다."
    );
  }

  if (input.estimatedProperty === "170m_to_240m") {
    warnings.push("재산 1.7억원 이상으로 산정액의 50%만 지급됩니다.");
  }

  const blocked = blockReasons.length > 0;
  return {
    status: blocked
      ? "blocked"
      : warnings.length > 0
        ? "reduced"
        : "eligible",
    blockReasons,
    warnings,
    canProceedToCalculator: !blocked,
  };
}
