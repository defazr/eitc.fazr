/**
 * eitc.fazr 공개 API (barrel)
 *
 * 외부에서는 이 파일만 import.
 * engine.ts의 calcEitcCtc는 노출하지 않는다 (D-1 #3).
 */

export { calculateEitcWithDeduction } from "./wrapper";
export type {
  EitcCtcExtendedInput,
  EitcCtcExtendedResult,
} from "./wrapper";

export type { HouseholdType, ApplicationType } from "./engine";

export { checkEligibility } from "./eligibilityGuard";
export type {
  EligibilityCheckInput,
  EligibilityCheckResult,
} from "./eligibilityGuard";

export { FEATURE_FLAGS } from "./flags";
