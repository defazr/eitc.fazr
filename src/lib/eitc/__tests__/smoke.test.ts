import { describe, it, expect } from "vitest";
import { calculateEitcWithDeduction } from "@/lib/eitc";

describe("EITC wrapper smoke test", () => {
  it("단독 가구 기본 케이스 — 정상 결과 반환", () => {
    const result = calculateEitcWithDeduction({
      householdType: "single",
      totalIncome: 15_000_000,
      totalProperty: 100_000_000,
      dependentChildren: 0,
      applicationType: "regular",
    });
    expect(result).toBeDefined();
    expect(result.eitc).toBeTypeOf("number");
    expect(result.eitc).toBeGreaterThanOrEqual(0);
  });

  it("홑벌이 + 자녀 1명 — 자녀세액공제 차감 정상", () => {
    const result = calculateEitcWithDeduction({
      householdType: "single_earner",
      totalIncome: 25_000_000,
      totalProperty: 100_000_000,
      dependentChildren: 1,
      applicationType: "regular",
      priorChildTaxCredit: 250_000,
    });
    expect(result.ctcBeforeDeduction).toBeGreaterThanOrEqual(0);
    expect(result.childTaxCreditDeducted).toBeGreaterThanOrEqual(0);
    expect(result.ctcFinal).toBeGreaterThanOrEqual(0);
  });
});
