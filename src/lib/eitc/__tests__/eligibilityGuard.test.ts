import { checkEligibility } from "../eligibilityGuard";

describe("eligibilityGuard: checkEligibility", () => {
  const baseInput = {
    isKorean: true,
    isDependentOfOther: false,
    hasProfessionalBusiness: false,
    hasHighIncomeEmployee: false,
    estimatedProperty: "under_170m" as const,
  };

  it("모든 조건 통과 → eligible", () => {
    const r = checkEligibility(baseInput);
    expect(r.status).toBe("eligible");
    expect(r.blockReasons).toHaveLength(0);
    expect(r.warnings).toHaveLength(0);
    expect(r.canProceedToCalculator).toBe(true);
  });

  it("재산 감액 구간 → reduced + warning", () => {
    const r = checkEligibility({
      ...baseInput,
      estimatedProperty: "170m_to_240m",
    });
    expect(r.status).toBe("reduced");
    expect(r.warnings).toHaveLength(1);
    expect(r.warnings[0]).toContain("50%");
    expect(r.canProceedToCalculator).toBe(true);
  });

  it("재산 초과 + 전문직 → blockReasons[0]이 재산 (우선순위 1)", () => {
    const r = checkEligibility({
      ...baseInput,
      estimatedProperty: "over_240m",
      hasProfessionalBusiness: true,
    });
    expect(r.status).toBe("blocked");
    expect(r.blockReasons[0]).toContain("2.4억");
    expect(r.blockReasons).toHaveLength(2);
    expect(r.canProceedToCalculator).toBe(false);
  });

  it("전문직 단독 → blockReasons[0]이 전문직 메시지", () => {
    const r = checkEligibility({
      ...baseInput,
      hasProfessionalBusiness: true,
    });
    expect(r.status).toBe("blocked");
    expect(r.blockReasons[0]).toContain("전문직");
    expect(r.canProceedToCalculator).toBe(false);
  });

  it("국적만 X → blocked", () => {
    const r = checkEligibility({
      ...baseInput,
      isKorean: false,
    });
    expect(r.status).toBe("blocked");
    expect(r.blockReasons[0]).toContain("국적");
  });

  it("복수 차단 사유 → blockReasons 전부 담기, 우선순위 순서", () => {
    const r = checkEligibility({
      isKorean: false,
      isDependentOfOther: true,
      hasProfessionalBusiness: true,
      hasHighIncomeEmployee: true,
      estimatedProperty: "over_240m",
    });
    expect(r.blockReasons).toHaveLength(5);
    // 우선순위: 재산 → 전문직 → 고소득 → 국적 → 부양자녀
    expect(r.blockReasons[0]).toContain("2.4억");
    expect(r.blockReasons[1]).toContain("전문직");
    expect(r.blockReasons[2]).toContain("500만원");
    expect(r.blockReasons[3]).toContain("국적");
    expect(r.blockReasons[4]).toContain("부양자녀");
  });
});
