export interface TaxBracket {
  /** 과세표준 상한 (원). 최고 구간은 Infinity */
  upper: number;
  /** 세율 (소수점). 예: 6% → 0.06 */
  rate: number;
  /** 누진공제액 (원) */
  deduction: number;
}

/** 국민연금 룰: 단일 값 (모든 월 동일) */
export interface PensionRuleFlat {
  rate: number;
  /** 보수월액 하한 (원) */
  monthlyFloor: number;
  /** 보수월액 상한 (원) */
  monthlyCap: number;
}

/** 국민연금 반기 구간 */
export interface PensionRulePeriod {
  fromMonth: number;
  toMonth: number;
  rate: number;
  monthlyFloor: number;
  monthlyCap: number;
}

/** 국민연금 룰: 단일 값 또는 반기별 구간 */
export type PensionRule = PensionRuleFlat | { periods: PensionRulePeriod[] };

export interface SocialInsuranceRates {
  /** 국민연금 (근로자 부담분) */
  pension: PensionRule;
  /** 건강보험 (근로자 부담분) */
  health: {
    rate: number;
  };
  /** 장기요양보험 (건보료 대비 비율) */
  longTermCare: {
    rateOfHealth: number;
  };
  /** 고용보험 (근로자 부담분) */
  employment: {
    rate: number;
  };
}

/** 재산등급 점수표 1행 (만원 단위) */
export interface PropertyScoreEntry {
  /** 재산금액 상한 (만원). 최고 등급은 Infinity */
  upper: number;
  /** 해당 등급 점수 */
  score: number;
}

/** 지역가입자 건강보험 룰 */
export interface HealthInsuranceRegional {
  /** 소득 보험료율 (소수점). 예: 7.19% → 0.0719 */
  rate: number;
  /** 장기요양보험료율 (건보료 대비). 예: 13.14% → 0.1314 */
  longTermCareRate: number;
  /** 재산 점수당 금액 (원) */
  propertyScorePrice: number;
  /** 재산과표 공제액 (만원). 예: 1억원 → 10_000 */
  propertyDeduction: number;
  /** 자동차 면제 기준 (만원). 예: 4천만원 → 4_000 */
  carExemptionLimit: number;
  /** 재산등급별 점수표 (60등급, 만원 단위) */
  propertyScoreTable: PropertyScoreEntry[];
}

/** 일용직소득세 룰 */
export interface DayLaborerTax {
  /** 일용근로소득공제 (원) */
  deduction: number;
  /** 세율 (소수점). 예: 6% → 0.06 */
  rate: number;
  /** 세액공제율 (소수점). 예: 55% → 0.55 */
  taxCredit: number;
}

/** 출산전후휴가 급여 룰 */
export interface MaternityLeaveBenefit {
  /** 월 상한액 — 단태아 기준 (원) */
  monthlyCapSingle: number;
  /** 총 휴가일수 — 단태아 */
  daysSingle: number;
  /** 총 휴가일수 — 다태아 */
  daysTwins: number;
  /** 총 휴가일수 — 미숙아 */
  daysPremature: number;
  /** 대규모기업 사업주 부담 일수 — 단태아/미숙아 */
  paidDaysEmployerLarge: number;
  /** 대규모기업 사업주 부담 일수 — 다태아 */
  paidDaysEmployerLargeTwins: number;
}

/** 근로·자녀장려금 설정 (재산 기준, 감액률) */
export interface EitcConfig {
  /** 재산 수급 상한 (원). 이상이면 수급 불가 */
  propertyLimitMax: number;
  /** 재산 감액 시작 (원). 이상이면 50% 감액 */
  propertyLimitReduction: number;
  /** 재산 감액률 (소수점). 0.5 = 50% */
  propertyReductionRate: number;
  /** 기한후 신청 지급률 (소수점). 0.95 = 5% 감액 */
  lateApplicationRate: number;
}

export interface TaxRules {
  /** 적용 연도 */
  year: number;
  /** 마지막 확인 일자 */
  lastChecked: string;
  /** 데이터 출처 */
  sources: string[];
  /** 소득세 과세표준 구간 */
  incomeTaxBrackets: TaxBracket[];
  /** 지방소득세율 (소득세의 비율). 예: 10% → 0.1 */
  localIncomeTaxRate: number;
  /** 4대 보험 요율 및 상하한 */
  socialInsurance: SocialInsuranceRates;
  /** 최저임금 시급 (원) */
  minimumWage: number;
  /** 지역가입자 건강보험 */
  healthInsuranceRegional: HealthInsuranceRegional;
  /** 일용직소득세 */
  dayLaborerTax: DayLaborerTax;
  /** 출산전후휴가 급여 */
  maternityLeaveBenefit: MaternityLeaveBenefit;
  /** 근로·자녀장려금 설정 */
  eitc: EitcConfig;
  /** 비고 */
  notes: string;
}
