import { calcEitcCtc } from "../engine";
import { taxRules2026 } from "@/data/taxRules/2026";

describe("calcEitcCtc", () => {
  // Test 1: 단독, 500만, 재산 0
  // 별표11: 5,000,000~5,100,000 → single=1,650,000
  it("단독가구, 총급여 500만원, 재산 0 → eitc 1,650,000", () => {
    const r = calcEitcCtc(
      { householdType: "single", totalIncome: 5_000_000, totalProperty: 0, dependentChildren: 0, applicationType: "regular" },
      taxRules2026,
    );
    expect(r.eitc).toBe(1_650_000);
    expect(r.ctc).toBe(0);
    expect(r.totalBenefit).toBe(1_650_000);
    expect(r.isEligibleEITC).toBe(true);
    expect(r.isEligibleCTC).toBe(false);
  });

  // Test 2: 홑벌이, 1000만, 재산 0, 자녀 1명
  // 별표11: 10,000,000~10,100,000 → single_earner=2,850,000
  // 별표11의2: 6,000,000~21,000,000 → single_earner=1,000,000 × 1
  it("홑벌이, 총급여 1000만, 재산 0, 자녀 1명 → eitc 2,850,000 + ctc 1,000,000", () => {
    const r = calcEitcCtc(
      { householdType: "single_earner", totalIncome: 10_000_000, totalProperty: 0, dependentChildren: 1, applicationType: "regular" },
      taxRules2026,
    );
    expect(r.eitc).toBe(2_850_000);
    expect(r.ctc).toBe(1_000_000);
    expect(r.totalBenefit).toBe(3_850_000);
  });

  // Test 3: 맞벌이, 1500만, 재산 0, 자녀 2명
  // 별표11: 15,000,000~15,100,000 → dual_earner=3,300,000
  // 별표11의2: 6,000,000~21,000,000 → dual_earner=1,000,000 × 2
  it("맞벌이, 총급여 1500만, 재산 0, 자녀 2명 → eitc 3,300,000 + ctc 2,000,000", () => {
    const r = calcEitcCtc(
      { householdType: "dual_earner", totalIncome: 15_000_000, totalProperty: 0, dependentChildren: 2, applicationType: "regular" },
      taxRules2026,
    );
    expect(r.eitc).toBe(3_300_000);
    expect(r.ctc).toBe(2_000_000);
    expect(r.totalBenefit).toBe(5_300_000);
  });

  // Test 4: 홑벌이, 1000만, 재산 2억 → 50% 감액
  // eitc 2,850,000 × 0.5 = 1,425,000
  it("홑벌이, 1000만, 재산 2억 → 50% 감액", () => {
    const r = calcEitcCtc(
      { householdType: "single_earner", totalIncome: 10_000_000, totalProperty: 200_000_000, dependentChildren: 0, applicationType: "regular" },
      taxRules2026,
    );
    expect(r.eitc).toBe(1_425_000);
    expect(r.propertyReductionApplied).toBe(true);
  });

  // Test 5: 맞벌이, 5000만 → eitc 0 (43,877,300 초과), ctc 가능
  // 별표11의2: 50,000,000~50,500,000 → dual_earner=723,000 × 1
  it("맞벌이, 총급여 5000만, 자녀 1명 → eitc 0, ctc 723,000", () => {
    const r = calcEitcCtc(
      { householdType: "dual_earner", totalIncome: 50_000_000, totalProperty: 0, dependentChildren: 1, applicationType: "regular" },
      taxRules2026,
    );
    expect(r.eitc).toBe(0);
    expect(r.isEligibleEITC).toBe(false);
    expect(r.ctc).toBe(723_000);
    expect(r.isEligibleCTC).toBe(true);
  });

  // Test 6: 단독, 2300만 → eitc 0 (21,881,900 초과)
  it("단독가구, 총급여 2300만 → eitc 0 (상한 초과)", () => {
    const r = calcEitcCtc(
      { householdType: "single", totalIncome: 23_000_000, totalProperty: 0, dependentChildren: 0, applicationType: "regular" },
      taxRules2026,
    );
    expect(r.eitc).toBe(0);
    expect(r.isEligibleEITC).toBe(false);
  });

  // Test 7: 기한후, 홑벌이, 1000만
  // eitc 2,850,000 × 0.95 = floor(2,707,500) = 2,707,500
  it("기한후 신청, 홑벌이, 1000만 → 95% 지급", () => {
    const r = calcEitcCtc(
      { householdType: "single_earner", totalIncome: 10_000_000, totalProperty: 0, dependentChildren: 0, applicationType: "late" },
      taxRules2026,
    );
    expect(r.eitc).toBe(Math.floor(2_850_000 * 0.95));
    expect(r.lateReductionApplied).toBe(true);
  });

  // Test 8: 단독 선택 + 자녀 1명 → 홑벌이 자동 보정
  it("단독 선택 + 자녀 1명 → 홑벌이 자동 보정", () => {
    const r = calcEitcCtc(
      { householdType: "single", totalIncome: 10_000_000, totalProperty: 0, dependentChildren: 1, applicationType: "regular" },
      taxRules2026,
    );
    expect(r.effectiveHouseholdType).toBe("single_earner");
    expect(r.householdCorrected).toBe(true);
    expect(r.message).toContain("홑벌이가구로 분류");
    // 보정 후 single_earner 기준으로 계산
    expect(r.eitc).toBe(2_850_000);
    expect(r.ctc).toBe(1_000_000);
  });

  // Test 9: 재산 2.4억 초과
  it("재산 2.4억 이상 → 수급 불가", () => {
    const r = calcEitcCtc(
      { householdType: "single_earner", totalIncome: 10_000_000, totalProperty: 240_000_000, dependentChildren: 1, applicationType: "regular" },
      taxRules2026,
    );
    expect(r.eitc).toBe(0);
    expect(r.ctc).toBe(0);
    expect(r.isEligibleEITC).toBe(false);
    expect(r.isEligibleCTC).toBe(false);
    expect(r.message).toContain("2.4억");
  });

  // Test 10: 맞벌이, 500만 (600만 미만) → 별표11 dual_earner=null, 별표11의2 dual_earner=null
  // 별표11: 400,000~500,000 → dual_earner=null → 0
  // 별표11의2: 40,000~6,000,000 → dual_earner=null → 0
  it("맞벌이, 총급여 500만 (600만 미만) → eitc 0, ctc 0", () => {
    const r = calcEitcCtc(
      { householdType: "dual_earner", totalIncome: 500_000, totalProperty: 0, dependentChildren: 1, applicationType: "regular" },
      taxRules2026,
    );
    expect(r.eitc).toBe(0);
    expect(r.ctc).toBe(0);
  });

  // Edge: 소득 0 (하한 미달)
  it("소득 0 → 하한 미달로 eitc 0", () => {
    const r = calcEitcCtc(
      { householdType: "single", totalIncome: 0, totalProperty: 0, dependentChildren: 0, applicationType: "regular" },
      taxRules2026,
    );
    expect(r.eitc).toBe(0);
  });

  // Edge: 재산 감액 + 기한후 감액 동시 적용
  it("재산 감액 + 기한후 감액 동시 적용", () => {
    const r = calcEitcCtc(
      { householdType: "single_earner", totalIncome: 10_000_000, totalProperty: 180_000_000, dependentChildren: 1, applicationType: "late" },
      taxRules2026,
    );
    // eitc: 2,850,000 × 0.5 = 1,425,000 × 0.95 = floor(1,353,750) = 1,353,750
    expect(r.eitc).toBe(Math.floor(Math.floor(2_850_000 * 0.5) * 0.95));
    // ctc: 1,000,000 × 0.5 = 500,000 × 0.95 = floor(475,000) = 475,000
    expect(r.ctc).toBe(Math.floor(Math.floor(1_000_000 * 0.5) * 0.95));
    expect(r.propertyReductionApplied).toBe(true);
    expect(r.lateReductionApplied).toBe(true);
  });
});
