/* engine direct import: validation only (D-1 #3 예외: __tests__ 내부) */
import { calcEitcCtc } from "../engine";
import { taxRules2026 } from "@/data/taxRules/2026";

/**
 * 부록 1 별표 11 검증 — 20 row 대조
 *
 * SSOT v1.2 부록 1의 샘플을 calc.fazr 엔진 결과와 1원 단위 대조.
 * income은 각 구간의 하한값 사용 (엔진이 구간 lookup하므로).
 */

function calc(
  householdType: "single" | "single_earner" | "dual_earner",
  income: number
) {
  return calcEitcCtc(
    {
      householdType,
      totalIncome: income,
      totalProperty: 0,
      dependentChildren: householdType === "single" ? 0 : 1,
      applicationType: "regular",
    },
    taxRules2026
  );
}

describe("부록 1: 별표 11 검증 (20 row)", () => {
  // 점증 구간
  it("200K~300K: 단독=124,000 홑벌이=124,000", () => {
    expect(calc("single", 200_000).eitc).toBe(124_000);
    expect(calc("single_earner", 200_000).eitc).toBe(124_000);
  });

  it("1.9M~2M: 단독=825,000 홑벌이=825,000", () => {
    expect(calc("single", 1_900_000).eitc).toBe(825_000);
    expect(calc("single_earner", 1_900_000).eitc).toBe(825_000);
  });

  // 단독 plateau 시작
  it("3.9M~4M: 단독=1,650,000 홑벌이=1,650,000", () => {
    expect(calc("single", 3_900_000).eitc).toBe(1_650_000);
    expect(calc("single_earner", 3_900_000).eitc).toBe(1_650_000);
  });

  // 홑벌이 분기점
  it("4M~4.1M: 단독=1,650,000 홑벌이=1,670,000", () => {
    expect(calc("single", 4_000_000).eitc).toBe(1_650_000);
    expect(calc("single_earner", 4_000_000).eitc).toBe(1_670_000);
  });

  it("4.1M~4.2M: 홑벌이=1,710,000", () => {
    expect(calc("single_earner", 4_100_000).eitc).toBe(1_710_000);
  });

  // 맞벌이 시작
  it("6M~6.1M: 맞벌이=2,517,000", () => {
    expect(calc("dual_earner", 6_000_000).eitc).toBe(2_517_000);
  });

  // 홑벌이 plateau
  it("6.9M~7M: 홑벌이=2,850,000", () => {
    expect(calc("single_earner", 6_900_000).eitc).toBe(2_850_000);
  });

  // 맞벌이 plateau
  it("7.9M~8M: 맞벌이=3,300,000", () => {
    expect(calc("dual_earner", 7_900_000).eitc).toBe(3_300_000);
  });

  // 단독 plateau → 점감 전환
  it("9M~9.1M: 단독=1,650,000 (아직 plateau)", () => {
    expect(calc("single", 9_000_000).eitc).toBe(1_650_000);
  });

  it("9.1M~9.2M: 단독=1,638,000 (점감 시작)", () => {
    expect(calc("single", 9_100_000).eitc).toBe(1_638_000);
  });

  // 홑벌이 plateau → 점감 전환
  it("14M~14.1M: 홑벌이=2,850,000 (아직 plateau)", () => {
    expect(calc("single_earner", 14_000_000).eitc).toBe(2_850_000);
  });

  it("14.1M~14.2M: 홑벌이=2,835,000 (점감 시작)", () => {
    expect(calc("single_earner", 14_100_000).eitc).toBe(2_835_000);
  });

  // 맞벌이 plateau → 점감 전환
  it("17M~17.1M: 맞벌이=3,300,000 (아직 plateau)", () => {
    expect(calc("dual_earner", 17_000_000).eitc).toBe(3_300_000);
  });

  it("17.1M~17.2M: 맞벌이=3,288,000 (점감 시작)", () => {
    expect(calc("dual_earner", 17_100_000).eitc).toBe(3_288_000);
  });

  // 단독 종료
  it("21.8M~21.88M: 단독=26,000", () => {
    expect(calc("single", 21_800_000).eitc).toBe(26_000);
  });

  it("21.88M~21.9M: 단독=0 (종료)", () => {
    expect(calc("single", 21_881_900).eitc).toBe(0);
  });

  // 홑벌이 종료
  it("31.9M~32M: 홑벌이=0 (종료)", () => {
    expect(calc("single_earner", 31_905_300).eitc).toBe(0);
  });

  // 맞벌이 종료 부근
  it("43.75M~43.8M: 맞벌이=30,000", () => {
    expect(calc("dual_earner", 43_754_600).eitc).toBe(30_000);
  });

  it("43.87M~43.9M: 맞벌이=0 (종료)", () => {
    expect(calc("dual_earner", 43_877_300).eitc).toBe(0);
  });
});
