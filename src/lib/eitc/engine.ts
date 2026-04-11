/**
 * 근로·자녀장려금 계산기
 * 조세특례제한법 시행령 별표 11 (근로장려금), 별표 11의2 (자녀장려금)
 * 개정 2025. 2. 28.
 */

import type { TaxRules } from "@/data/taxRules/types";
import { eitcTable2026, type EitcTableRow } from "@/data/taxRules/eitcTable2026";
import { ctcTable2026, type CtcTableRow } from "@/data/taxRules/ctcTable2026";

export type HouseholdType = "single" | "single_earner" | "dual_earner";
export type ApplicationType = "regular" | "late";

export interface EitcCtcInput {
  householdType: HouseholdType;
  totalIncome: number;
  totalProperty: number;
  dependentChildren: number;
  applicationType: ApplicationType;
}

export interface EitcCtcResult {
  year: number;
  eitc: number;
  ctc: number;
  totalBenefit: number;
  propertyReductionApplied: boolean;
  lateReductionApplied: boolean;
  isEligibleEITC: boolean;
  isEligibleCTC: boolean;
  effectiveHouseholdType: HouseholdType;
  householdCorrected: boolean;
  message: string;
}

/**
 * 이분 탐색으로 EITC 산정표 구간 조회
 * row.min <= income < row.max
 */
function findEitcRow(income: number): EitcTableRow | null {
  const table = eitcTable2026;
  if (income < table[0].min || income >= table[table.length - 1].max) return null;

  let lo = 0;
  let hi = table.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const row = table[mid];
    if (income < row.min) {
      hi = mid - 1;
    } else if (income >= row.max) {
      lo = mid + 1;
    } else {
      return row;
    }
  }
  return null;
}

/**
 * 이분 탐색으로 CTC 산정표 구간 조회
 */
function findCtcRow(income: number): CtcTableRow | null {
  const table = ctcTable2026;
  if (income < table[0].min || income >= table[table.length - 1].max) return null;

  let lo = 0;
  let hi = table.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const row = table[mid];
    if (income < row.min) {
      hi = mid - 1;
    } else if (income >= row.max) {
      lo = mid + 1;
    } else {
      return row;
    }
  }
  return null;
}

export function calcEitcCtc(input: EitcCtcInput, rules: TaxRules): EitcCtcResult {
  const { totalIncome, totalProperty, dependentChildren, applicationType } = input;
  const { eitc: config } = rules;

  if (totalIncome < 0) throw new Error("총급여액은 음수일 수 없습니다.");
  if (totalProperty < 0) throw new Error("재산은 음수일 수 없습니다.");
  if (dependentChildren < 0) throw new Error("부양자녀 수는 음수일 수 없습니다.");

  // 1. 단독가구 + 자녀 → 홑벌이 자동 보정
  let effectiveHouseholdType = input.householdType;
  let householdCorrected = false;
  if (input.householdType === "single" && dependentChildren > 0) {
    effectiveHouseholdType = "single_earner";
    householdCorrected = true;
  }

  // 2. 재산 상한 확인
  if (totalProperty >= config.propertyLimitMax) {
    return {
      year: rules.year,
      eitc: 0,
      ctc: 0,
      totalBenefit: 0,
      propertyReductionApplied: false,
      lateReductionApplied: false,
      isEligibleEITC: false,
      isEligibleCTC: false,
      effectiveHouseholdType,
      householdCorrected,
      message: "가구원 재산 합계가 2.4억원 이상이므로 수급 대상이 아닙니다.",
    };
  }

  // 3. EITC 산정표 조회
  let eitcAmount = 0;
  const eitcRow = findEitcRow(totalIncome);
  if (eitcRow) {
    const val = eitcRow[effectiveHouseholdType as keyof EitcTableRow];
    eitcAmount = typeof val === "number" ? val : 0;
  }

  // 4. CTC 산정표 조회 (단독가구 제외, 자녀 필요)
  let ctcAmount = 0;
  if (effectiveHouseholdType !== "single" && dependentChildren > 0) {
    const ctcRow = findCtcRow(totalIncome);
    if (ctcRow) {
      const key = effectiveHouseholdType as keyof CtcTableRow;
      const perChild = typeof ctcRow[key] === "number" ? (ctcRow[key] as number) : 0;
      ctcAmount = perChild * dependentChildren;
    }
  }

  // 5. 재산 감액 (1.7억 이상)
  let propertyReductionApplied = false;
  if (totalProperty >= config.propertyLimitReduction) {
    eitcAmount = Math.floor(eitcAmount * config.propertyReductionRate);
    ctcAmount = Math.floor(ctcAmount * config.propertyReductionRate);
    propertyReductionApplied = true;
  }

  // 6. 기한후 감액
  let lateReductionApplied = false;
  if (applicationType === "late") {
    eitcAmount = Math.floor(eitcAmount * config.lateApplicationRate);
    ctcAmount = Math.floor(ctcAmount * config.lateApplicationRate);
    lateReductionApplied = true;
  }

  const messages: string[] = [];
  if (householdCorrected) {
    messages.push("부양자녀가 있어 홑벌이가구로 분류됩니다.");
  }

  return {
    year: rules.year,
    eitc: eitcAmount,
    ctc: ctcAmount,
    totalBenefit: eitcAmount + ctcAmount,
    propertyReductionApplied,
    lateReductionApplied,
    isEligibleEITC: eitcAmount > 0,
    isEligibleCTC: ctcAmount > 0,
    effectiveHouseholdType,
    householdCorrected,
    message: messages.join(" "),
  };
}
