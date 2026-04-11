export const SUBSIDY_CONFIG = {
  name: "고유가 피해지원금",
  year: 2026,
  status: "확정" as const, // "심사중" | "확정" | "신청중" | "지급중" | "종료"
  totalBudget: "4조 8,000억 원",
  targetPopulation: "약 3,577만 명 (소득 하위 70%)",

  amounts: {
    metropolitan: 100000,
    nonMetropolitan: 150000,
    depopulationPreferred: 200000,
    depopulationSpecial: 250000,
  },

  vulnerableAmounts: {
    nextTier: {
      metropolitan: 450000,
      nonMetropolitan: 500000,
    },
    basicLivelihood: {
      metropolitan: 550000,
      nonMetropolitan: 600000,
    },
  },

  incomeThresholds: [
    {
      members: 1,
      monthlyIncome: 3850000,
      insuranceEmployee: 185400,
      insuranceRegional: 12500,
    },
    {
      members: 2,
      monthlyIncome: 6300000,
      insuranceEmployee: 312800,
      insuranceRegional: 145200,
    },
    {
      members: 3,
      monthlyIncome: 8040000,
      insuranceEmployee: 405200,
      insuranceRegional: 224100,
    },
    {
      members: 4,
      monthlyIncome: 9740000,
      insuranceEmployee: 508600,
      insuranceRegional: 318700,
    },
    {
      members: 5,
      monthlyIncome: 11200000,
      insuranceEmployee: 0,
      insuranceRegional: 0,
    },
  ],
} as const;

export type SubsidyStatus = "심사중" | "확정" | "신청중" | "지급중" | "종료";

export type RegionType = "수도권" | "비수도권" | "인구감소우대" | "인구감소특별";

export function getSubsidyAmount(regionType: RegionType): number {
  switch (regionType) {
    case "수도권":
      return SUBSIDY_CONFIG.amounts.metropolitan;
    case "비수도권":
      return SUBSIDY_CONFIG.amounts.nonMetropolitan;
    case "인구감소우대":
      return SUBSIDY_CONFIG.amounts.depopulationPreferred;
    case "인구감소특별":
      return SUBSIDY_CONFIG.amounts.depopulationSpecial;
  }
}

export function checkEligibility(
  members: number,
  monthlyInsurance: number
): { eligible: boolean; message: string } {
  if (members >= 5) {
    return {
      eligible: false,
      message: "5인 이상 가구는 별도 기준 적용 (예상 계산 제외)",
    };
  }

  const threshold = SUBSIDY_CONFIG.incomeThresholds.find(
    (t) => t.members === members
  );
  if (!threshold) {
    return { eligible: false, message: "가구원 수를 확인해주세요." };
  }

  const maxInsurance = Math.max(
    threshold.insuranceEmployee,
    threshold.insuranceRegional
  );

  if (monthlyInsurance <= maxInsurance) {
    return { eligible: true, message: "예상 지원 대상입니다." };
  }

  return {
    eligible: false,
    message: "건강보험료 기준 초과로 지원 대상이 아닐 수 있습니다.",
  };
}
