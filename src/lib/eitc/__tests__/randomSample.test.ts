import { calculateEitcWithDeduction } from "../wrapper";

/**
 * seed 고정 랜덤 샘플 테스트 (SSOT D-5)
 *
 * 경계값만 테스트하면 내부 lookup 미스를 잡을 수 없음.
 * mulberry32 PRNG으로 seed 고정, 재현성 확보.
 */

// mulberry32 PRNG (seed 고정)
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rng = mulberry32(42);

function randInt(min: number, max: number): number {
  return Math.floor(rng() * (max - min)) + min;
}

describe("랜덤 샘플 테스트 (seed=42)", () => {
  // 단독 plateau: 5M~9M
  it.each(Array.from({ length: 3 }, () => randInt(5_000_000, 8_999_999)))(
    "단독 plateau income=%d → eitc=1,650,000",
    (income) => {
      const r = calculateEitcWithDeduction({
        householdType: "single",
        totalIncome: income,
        totalProperty: 50_000_000,
        dependentChildren: 0,
        applicationType: "regular",
      });
      expect(r.eitc).toBe(1_650_000);
      expect(r.isEligibleEITC).toBe(true);
    }
  );

  // 홑벌이 plateau: 7M~14M
  it.each(Array.from({ length: 3 }, () => randInt(7_000_000, 13_999_999)))(
    "홑벌이 plateau income=%d → eitc=2,850,000",
    (income) => {
      const r = calculateEitcWithDeduction({
        householdType: "single_earner",
        totalIncome: income,
        totalProperty: 50_000_000,
        dependentChildren: 1,
        applicationType: "regular",
      });
      expect(r.eitc).toBe(2_850_000);
    }
  );

  // 맞벌이 plateau: 8M~17M
  it.each(Array.from({ length: 3 }, () => randInt(8_000_000, 16_999_999)))(
    "맞벌이 plateau income=%d → eitc=3,300,000",
    (income) => {
      const r = calculateEitcWithDeduction({
        householdType: "dual_earner",
        totalIncome: income,
        totalProperty: 50_000_000,
        dependentChildren: 1,
        applicationType: "regular",
      });
      expect(r.eitc).toBe(3_300_000);
    }
  );

  // 점감 구간 랜덤 (단독 9.1M~22M, 값 > 0 && < max)
  it.each(Array.from({ length: 3 }, () => randInt(9_100_000, 21_000_000)))(
    "단독 점감 income=%d → 0 < eitc < 1,650,000",
    (income) => {
      const r = calculateEitcWithDeduction({
        householdType: "single",
        totalIncome: income,
        totalProperty: 50_000_000,
        dependentChildren: 0,
        applicationType: "regular",
      });
      expect(r.eitc).toBeGreaterThan(0);
      expect(r.eitc).toBeLessThan(1_650_000);
    }
  );

  // 재산 감액 구간 (170M~239M)
  it.each(
    Array.from({ length: 3 }, () => randInt(170_000_000, 239_999_999))
  )("재산 감액 property=%d → propertyReductionApplied=true", (property) => {
    const r = calculateEitcWithDeduction({
      householdType: "single_earner",
      totalIncome: 10_000_000,
      totalProperty: property,
      dependentChildren: 1,
      applicationType: "regular",
    });
    expect(r.propertyReductionApplied).toBe(true);
    expect(r.eitc).toBeLessThan(2_850_000);
    expect(r.eitc).toBeGreaterThan(0);
  });
});
