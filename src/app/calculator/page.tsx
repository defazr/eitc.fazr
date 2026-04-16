/**
 * @file Calculator page (PR-3)
 * NOTE: 단일 파일 유지 (PR-3 원칙). 컴포넌트 분리는 PR-5에서 진행 예정.
 */
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  calculateEitcWithDeduction,
  checkEligibility,
  FEATURE_FLAGS,
  type EitcCtcExtendedInput,
  type EitcCtcExtendedResult,
  type EligibilityCheckResult,
  type HouseholdType,
  type ApplicationType,
} from "@/lib/eitc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DisclaimerBanner } from "@/components/disclaimer-banner";
import { AdSlot } from "@/components/ad-slot";
import { ShareButtons } from "@/components/share-buttons";
import { KakaoChannelButton } from "@/components/kakao-channel-button";

/* ── Form state ── */

interface FormState {
  householdType: HouseholdType;
  totalIncome: number;
  totalProperty: number;
  dependentChildren: number;
  applicationType: ApplicationType;
  priorChildTaxCredit: number;
  hasProfessionalBusiness: boolean;
  hasHighIncomeEmployee: boolean;
}

const INITIAL_FORM: FormState = {
  householdType: "single",
  totalIncome: 0,
  totalProperty: 0,
  dependentChildren: 0,
  applicationType: "regular",
  priorChildTaxCredit: 0,
  hasProfessionalBusiness: false,
  hasHighIncomeEmployee: false,
};

/* ── Helpers ── */

function parseNumberInput(value: string): number {
  const digits = value.replace(/[^0-9]/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

function formatNumber(n: number): string {
  return n === 0 ? "" : n.toLocaleString("ko-KR");
}

/* ── Household button config ── */

const HOUSEHOLD_OPTIONS: {
  value: HouseholdType;
  label: string;
  desc: string;
}[] = [
  { value: "single", label: "단독", desc: "배우자·부양자녀 없음" },
  { value: "single_earner", label: "홑벌이", desc: "배우자 또는 부양자녀 있음, 배우자 소득 3백만원 미만" },
  { value: "dual_earner", label: "맞벌이", desc: "본인·배우자 각각 3백만원 이상 소득" },
];

/* ── Page component ── */

export default function CalculatorPage() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [isCalculated, setIsCalculated] = useState(false);
  const [calculationResult, setCalculationResult] =
    useState<EitcCtcExtendedResult | null>(null);
  const [eligibilityResult, setEligibilityResult] =
    useState<EligibilityCheckResult | null>(null);

  const updateForm = <K extends keyof FormState>(
    key: K,
    value: FormState[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setIsCalculated(false);
  };

  const isSingle = form.householdType === "single";
  const showCtcInput = form.dependentChildren > 0 && !isSingle;

  /* ── Calculate ── */

  const handleCalculate = () => {
    const estimatedProperty =
      form.totalProperty >= 240_000_000
        ? ("over_240m" as const)
        : form.totalProperty >= 170_000_000
          ? ("170m_to_240m" as const)
          : ("under_170m" as const);

    const eligResult = checkEligibility({
      isKorean: true,
      isDependentOfOther: false,
      hasProfessionalBusiness: form.hasProfessionalBusiness,
      hasHighIncomeEmployee: form.hasHighIncomeEmployee,
      estimatedProperty,
    });
    setEligibilityResult(eligResult);

    if (eligResult.status === "blocked") {
      setCalculationResult(null);
      setIsCalculated(true);
      return;
    }

    const result = calculateEitcWithDeduction({
      householdType: form.householdType,
      totalIncome: form.totalIncome,
      totalProperty: form.totalProperty,
      dependentChildren: form.dependentChildren,
      applicationType: form.applicationType,
      priorChildTaxCredit: form.priorChildTaxCredit,
    });
    setCalculationResult(result);
    setIsCalculated(true);

    // GA4 + Google Ads 이벤트 — guard 통과 + 계산 완료 시에만
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "calculator_click", {
        event_category: "engagement",
        event_label: "근로장려금_계산하기",
        value: 1,
      });

      const conversionId = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID;
      if (conversionId) {
        (window as any).gtag("event", "conversion", {
          send_to: conversionId,
        });
      }
    }
  };

  const canCalculate = form.totalIncome > 0;

  /* ── Render ── */

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">
          근로·자녀장려금 계산기
        </h1>
        <p className="text-muted-foreground mt-2">
          가구유형, 소득, 재산을 입력하면 예상 장려금을 바로 확인할 수 있습니다
        </p>
      </div>

      {/* Card 1: 가구 유형 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">가구 유형</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {HOUSEHOLD_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => updateForm("householdType", opt.value)}
                className={`rounded-lg border p-3 text-center transition-colors ${
                  form.householdType === opt.value
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-border hover:border-primary/40"
                }`}
              >
                <span className="block font-medium text-sm">{opt.label}</span>
                <span className="block text-xs text-muted-foreground mt-1">
                  {opt.desc}
                </span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Card 2: 소득과 재산 */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-lg">소득과 재산</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* 총급여 */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              부부합산 연간 총급여액 등
            </label>
            <div className="relative">
              <Input
                type="text"
                inputMode="numeric"
                placeholder="예: 25,000,000 (연간 기준)"
                value={formatNumber(form.totalIncome)}
                onChange={(e) =>
                  updateForm("totalIncome", parseNumberInput(e.target.value))
                }
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                원
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              2025년 1월 ~ 12월 연간 총급여액 합계 (월급이 아닌 연간 기준)
            </p>
          </div>

          {/* 재산 */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              가구원 합산 재산
            </label>
            <div className="relative">
              <Input
                type="text"
                inputMode="numeric"
                placeholder="예: 100,000,000"
                value={formatNumber(form.totalProperty)}
                onChange={(e) =>
                  updateForm("totalProperty", parseNumberInput(e.target.value))
                }
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                원
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              2025년 6월 1일 기준. 부채는 차감하지 않습니다.
            </p>
          </div>

          {/* 부양자녀 수 */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              부양자녀 수
            </label>
            <Input
              type="text"
              inputMode="numeric"
              placeholder="0"
              disabled={isSingle}
              value={isSingle ? "" : form.dependentChildren === 0 ? "" : String(form.dependentChildren)}
              onChange={(e) =>
                updateForm(
                  "dependentChildren",
                  Math.max(0, parseNumberInput(e.target.value))
                )
              }
            />
            {isSingle ? (
              <p className="text-xs text-amber-600 mt-1">
                단독가구는 자녀장려금 해당없음
              </p>
            ) : (
              <p className="text-xs text-muted-foreground mt-1">
                중증장애인 자녀는 연령 제한 없이 포함하여 입력하세요. 연간 소득
                100만원 이하 요건은 동일합니다.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Card 3: 신청 유형 + 공제 */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-lg">신청 유형</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* 신청 유형 선택 */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => updateForm("applicationType", "regular")}
              className={`rounded-lg border p-3 text-center transition-colors ${
                form.applicationType === "regular"
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "border-border hover:border-primary/40"
              }`}
            >
              <span className="block font-medium text-sm">
                정기 신청 (5월)
              </span>
            </button>
            <button
              type="button"
              onClick={() => updateForm("applicationType", "late")}
              className={`rounded-lg border p-3 text-center transition-colors ${
                form.applicationType === "late"
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "border-border hover:border-primary/40"
              }`}
            >
              <span className="block font-medium text-sm">
                기한 후 (6월~11월, 95% 지급)
              </span>
            </button>
          </div>

          {/* 기수혜 자녀세액공제액 */}
          {showCtcInput && (
            <div>
              <label className="text-sm font-medium mb-2 block">
                기수혜 자녀세액공제액
              </label>
              <div className="relative">
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="0"
                  value={formatNumber(form.priorChildTaxCredit)}
                  onChange={(e) =>
                    updateForm(
                      "priorChildTaxCredit",
                      parseNumberInput(e.target.value)
                    )
                  }
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  원
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                연말정산 또는 종합소득세에서 이미 받은 자녀세액공제 금액. 모르면
                0으로 두셔도 됩니다.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick eligibility checkboxes */}
      <div className="mt-4 space-y-3 px-1">
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.hasProfessionalBusiness}
            onChange={(e) =>
              updateForm("hasProfessionalBusiness", e.target.checked)
            }
            className="mt-0.5 h-4 w-4 rounded border-gray-300"
          />
          <span className="text-sm">
            본인 또는 배우자가 전문직 사업자입니다
          </span>
        </label>
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.hasHighIncomeEmployee}
            onChange={(e) =>
              updateForm("hasHighIncomeEmployee", e.target.checked)
            }
            className="mt-0.5 h-4 w-4 rounded border-gray-300"
          />
          <span className="text-sm">
            본인 또는 배우자가 월 500만원 이상 상용근로자입니다
          </span>
        </label>
      </div>

      {/* Calculate button */}
      <Button
        onClick={handleCalculate}
        className="w-full py-6 text-base mt-6"
        disabled={!canCalculate}
      >
        예상 장려금 계산하기
      </Button>

      {/* ── Result section ── */}
      {isCalculated && eligibilityResult?.status === "blocked" && (
        <Card className="mt-6 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <Badge className="mb-3 bg-red-100 text-red-800 hover:bg-red-100">
                수급 대상이 아닙니다
              </Badge>
              <p className="text-sm text-red-700 mt-2">
                {eligibilityResult.blockReasons[0]}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {isCalculated &&
        eligibilityResult?.status !== "blocked" &&
        calculationResult &&
        calculationResult.totalBenefit > 0 && (
          <Card className="mt-6">
            <CardContent className="pt-6 space-y-5">
              {/* Total */}
              <div className="text-center">
                <Badge className="mb-3 bg-green-100 text-green-800 hover:bg-green-100">
                  예상 수급 대상
                </Badge>
                <p className="text-4xl font-bold text-primary mt-3 mb-1">
                  {calculationResult.totalBenefit.toLocaleString("ko-KR")}원
                </p>
                <p className="text-sm text-muted-foreground">
                  {calculationResult.effectiveHouseholdType === "single"
                    ? "단독가구"
                    : calculationResult.effectiveHouseholdType ===
                        "single_earner"
                      ? "홑벌이가구"
                      : "맞벌이가구"}{" "}
                  기준
                </p>
                {calculationResult.householdCorrected && (
                  <p className="text-xs text-amber-600 mt-1">
                    단독가구 → 홑벌이가구 자동 보정됨
                  </p>
                )}
              </div>

              {/* 근로장려금 */}
              <div className="border-t pt-4">
                <p className="font-medium text-sm">
                  근로장려금:{" "}
                  <span className="text-primary">
                    {calculationResult.eitc.toLocaleString("ko-KR")}원
                  </span>
                </p>
                {calculationResult.propertyReductionApplied && (
                  <p className="text-xs text-amber-600 mt-1">
                    ※ 재산 1.7억원 이상으로 50% 감액이 적용되었습니다
                  </p>
                )}
                {calculationResult.lateReductionApplied && (
                  <p className="text-xs text-amber-600 mt-1">
                    ※ 기한 후 신청으로 95%만 지급됩니다
                  </p>
                )}
              </div>

              {/* 자녀장려금 */}
              {form.dependentChildren > 0 && !isSingle && (
                <div className="border-t pt-4">
                  <p className="font-medium text-sm">
                    자녀장려금:{" "}
                    <span className="text-primary">
                      {calculationResult.ctcFinal.toLocaleString("ko-KR")}원
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    산정 원금:{" "}
                    {calculationResult.ctcBeforeDeduction.toLocaleString(
                      "ko-KR"
                    )}
                    원
                  </p>
                  {calculationResult.childTaxCreditDeducted > 0 && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      자녀세액공제 차감: -
                      {calculationResult.childTaxCreditDeducted.toLocaleString(
                        "ko-KR"
                      )}
                      원
                    </p>
                  )}
                  {calculationResult.propertyReductionApplied && (
                    <p className="text-xs text-amber-600 mt-1">
                      ※ 재산 1.7억원 이상으로 50% 감액이 적용되었습니다
                    </p>
                  )}
                  {calculationResult.lateReductionApplied && (
                    <p className="text-xs text-amber-600 mt-1">
                      ※ 기한 후 신청으로 95%만 지급됩니다
                    </p>
                  )}
                </div>
              )}

              {/* Eligibility warnings */}
              {eligibilityResult?.status === "reduced" &&
                eligibilityResult.warnings.length > 0 && (
                  <div className="border-t pt-4">
                    {eligibilityResult.warnings.map((w, i) => (
                      <p
                        key={i}
                        className="text-xs text-amber-600"
                      >
                        ※ {w}
                      </p>
                    ))}
                  </div>
                )}

              {/* Engine message */}
              {calculationResult.message && (
                <p className="text-xs text-muted-foreground border-t pt-4">
                  {calculationResult.message}
                </p>
              )}
            </CardContent>
          </Card>
        )}

      {isCalculated &&
        eligibilityResult?.status !== "blocked" &&
        calculationResult &&
        calculationResult.totalBenefit === 0 && (
          <Card className="mt-6 border-gray-200 bg-gray-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <Badge
                  variant="secondary"
                  className="mb-3 bg-gray-100 text-gray-700"
                >
                  수급 대상 외
                </Badge>
                <p className="text-sm text-muted-foreground mt-2">
                  입력하신 조건으로는 수급 대상이 아닙니다
                </p>
                {!calculationResult.isEligibleEITC &&
                  !calculationResult.isEligibleCTC && (
                    <p className="text-xs text-muted-foreground mt-1">
                      총소득이 기준금액을 초과합니다
                    </p>
                  )}
                <Link
                  href="/eligibility"
                  className="inline-block mt-4 text-sm text-primary hover:underline"
                >
                  자격 요건 다시 확인 →
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

      {/* CTA bottom */}
      {isCalculated && (
        <>
          <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm">
            <Link
              href="/eligibility"
              className="text-primary hover:underline"
            >
              자격 요건 다시 확인
            </Link>
          </div>
          <ShareButtons title="근로·자녀장려금 계산 결과 확인해보세요" />
          <KakaoChannelButton />
          <div className="mt-6">
            <DisclaimerBanner />
          </div>
          <div className="mt-4">
            <AdSlot slot="6180199492" format="rectangle" />
          </div>
        </>
      )}

      {/* FAZR branding */}
      <p className="text-xs text-muted-foreground text-center mt-4">
        FAZR에서 제공하는 서비스입니다
      </p>

      {/* Nav links */}
      <div className="flex flex-wrap justify-center gap-4 mt-8 text-sm">
        <Link href="/updates" className="text-primary hover:underline">
          근로·자녀장려금 지급 일정이 궁금하다면 →
        </Link>
        <Link href="/" className="text-muted-foreground hover:text-foreground">
          처음으로 돌아가기 →
        </Link>
      </div>

      {!isCalculated && (
        <div className="mt-6">
          <DisclaimerBanner />
        </div>
      )}
    </div>
  );
}
