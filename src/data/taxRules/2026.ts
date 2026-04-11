import type { TaxRules } from "./types";

/**
 * eitc.fazr 전용 taxRules2026
 *
 * calc.fazr의 data/taxRules/2026.ts에서 추출.
 * 엔진이 실제 사용하는 필드: year + eitc (EitcConfig) 만.
 * 나머지 필드는 TaxRules 타입 호환을 위한 placeholder.
 *
 * 원본 commit: 6702242 (2026-04-10)
 */
export const taxRules2026: TaxRules = {
  year: 2026,
  lastChecked: "2026-04-10",
  sources: ["조세특례제한법 시행령 별표 11 (2025.2.28 개정)"],

  // ─── 엔진 실사용 필드 (원본 그대로) ───
  eitc: {
    propertyLimitMax: 240_000_000,
    propertyLimitReduction: 170_000_000,
    propertyReductionRate: 0.5,
    lateApplicationRate: 0.95,
  },

  // ─── TaxRules 타입 호환용 placeholder (eitc.fazr 미사용) ───
  incomeTaxBrackets: [],
  localIncomeTaxRate: 0,
  socialInsurance: {
    pension: { rate: 0, monthlyFloor: 0, monthlyCap: 0 },
    health: { rate: 0 },
    longTermCare: { rateOfHealth: 0 },
    employment: { rate: 0 },
  },
  minimumWage: 0,
  healthInsuranceRegional: {
    rate: 0,
    longTermCareRate: 0,
    propertyScorePrice: 0,
    propertyDeduction: 0,
    carExemptionLimit: 0,
    propertyScoreTable: [],
  },
  dayLaborerTax: { deduction: 0, rate: 0, taxCredit: 0 },
  maternityLeaveBenefit: {
    monthlyCapSingle: 0,
    daysSingle: 0,
    daysTwins: 0,
    daysPremature: 0,
    paidDaysEmployerLarge: 0,
    paidDaysEmployerLargeTwins: 0,
  },
  notes: "eitc.fazr 전용: EITC/CTC 계산에 필요한 eitc 필드만 실제 값. 나머지는 placeholder.",
};
