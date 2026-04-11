/**
 * eitc.fazr wrapper — calc.fazr 엔진 래퍼
 *
 * 이 파일은 engine.ts를 import하는 유일한 파일이다.
 * 다른 어떤 파일도 engine.ts를 직접 호출하지 않는다 (D-1 #3).
 *
 * 순서: base → 재산감액 → 기한후감액 → 자녀세액공제 차감
 * 차감은 항상 마지막.
 */
import { calcEitcCtc } from "./engine";
import type { EitcCtcInput, EitcCtcResult } from "./engine";
import { taxRules2026 } from "@/data/taxRules/2026";

export type { EitcCtcInput, EitcCtcResult };

export interface EitcCtcExtendedInput extends EitcCtcInput {
  /** 연말정산/종합소득세에서 이미 수혜받은 자녀세액공제액 */
  priorChildTaxCredit?: number;
}

export interface EitcCtcExtendedResult extends EitcCtcResult {
  ctcBeforeDeduction: number;
  childTaxCreditDeducted: number;
  ctcFinal: number;
}

export function calculateEitcWithDeduction(
  input: EitcCtcExtendedInput
): EitcCtcExtendedResult {
  const guarded = guardInput(input);
  const base = calcEitcCtc(guarded, taxRules2026);

  const priorCredit = Math.max(0, Math.floor(input.priorChildTaxCredit ?? 0));
  const ctcBeforeDeduction = base.ctc;
  const ctcFinal = Math.max(0, ctcBeforeDeduction - priorCredit);
  const childTaxCreditDeducted = ctcBeforeDeduction - ctcFinal;

  return {
    ...base,
    ctc: ctcFinal,
    totalBenefit: base.eitc + ctcFinal, // base.totalBenefit 사용 금지, 재계산
    ctcBeforeDeduction,
    childTaxCreditDeducted,
    ctcFinal,
  };
}

function guardInput(input: EitcCtcInput): EitcCtcInput {
  return {
    ...input,
    totalIncome: Math.max(0, Math.floor(input.totalIncome)),
    totalProperty: Math.max(0, Math.floor(input.totalProperty)),
    dependentChildren: Math.max(0, Math.floor(input.dependentChildren)),
  };
}
