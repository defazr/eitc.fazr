import { calculateEitcWithDeduction } from "../wrapper";

describe("wrapper: calculateEitcWithDeduction", () => {
  it("자녀 1명, priorCredit 250,000 → ctcFinal 750,000", () => {
    const r = calculateEitcWithDeduction({
      householdType: "single_earner",
      totalIncome: 20_000_000,
      totalProperty: 50_000_000,
      dependentChildren: 1,
      applicationType: "regular",
      priorChildTaxCredit: 250_000,
    });
    expect(r.ctcBeforeDeduction).toBe(1_000_000);
    expect(r.ctcFinal).toBe(750_000);
    expect(r.childTaxCreditDeducted).toBe(250_000);
  });

  it("자녀 2명, priorCredit 550,000 → ctcFinal 1,450,000", () => {
    const r = calculateEitcWithDeduction({
      householdType: "single_earner",
      totalIncome: 20_000_000,
      totalProperty: 50_000_000,
      dependentChildren: 2,
      applicationType: "regular",
      priorChildTaxCredit: 550_000,
    });
    expect(r.ctcBeforeDeduction).toBe(2_000_000);
    expect(r.ctcFinal).toBe(1_450_000);
    expect(r.childTaxCreditDeducted).toBe(550_000);
  });

  it("ctc < priorCredit 역전 → ctcFinal 0", () => {
    const r = calculateEitcWithDeduction({
      householdType: "single_earner",
      totalIncome: 20_000_000,
      totalProperty: 50_000_000,
      dependentChildren: 1,
      applicationType: "regular",
      priorChildTaxCredit: 2_000_000,
    });
    expect(r.ctcFinal).toBe(0);
    expect(r.childTaxCreditDeducted).toBe(r.ctcBeforeDeduction);
  });

  it("priorChildTaxCredit undefined → ctcFinal = base.ctc", () => {
    const r = calculateEitcWithDeduction({
      householdType: "single_earner",
      totalIncome: 20_000_000,
      totalProperty: 50_000_000,
      dependentChildren: 1,
      applicationType: "regular",
    });
    expect(r.ctcFinal).toBe(r.ctcBeforeDeduction);
    expect(r.childTaxCreditDeducted).toBe(0);
  });

  it("totalBenefit = eitc + ctcFinal (재계산 검증)", () => {
    const r = calculateEitcWithDeduction({
      householdType: "single_earner",
      totalIncome: 20_000_000,
      totalProperty: 50_000_000,
      dependentChildren: 1,
      applicationType: "regular",
      priorChildTaxCredit: 250_000,
    });
    expect(r.totalBenefit).toBe(r.eitc + r.ctcFinal);
  });

  it("guardInput: 음수 입력 → 0으로 정규화", () => {
    const r = calculateEitcWithDeduction({
      householdType: "single",
      totalIncome: -100,
      totalProperty: -100,
      dependentChildren: -1,
      applicationType: "regular",
    });
    // 에러 없이 실행, 소득 0이면 장려금 0
    expect(r.eitc).toBe(0);
    expect(r.ctc).toBe(0);
  });

  it("guardInput: 소수점 → floor 적용", () => {
    const r = calculateEitcWithDeduction({
      householdType: "single_earner",
      totalIncome: 20_000_000.7,
      totalProperty: 50_000_000.9,
      dependentChildren: 1.9,
      applicationType: "regular",
    });
    // floor(1.9) = 1 → 자녀 1명
    expect(r.ctcBeforeDeduction).toBe(1_000_000);
  });
});
