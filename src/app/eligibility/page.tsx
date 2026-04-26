/**
 * @file Eligibility check page (PR-3)
 * NOTE: 단일 파일 유지 (PR-3 원칙). 컴포넌트 분리는 PR-5에서 진행 예정.
 */
"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ClipboardCheck, ArrowRight, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DisclaimerBanner } from "@/components/disclaimer-banner";
import { AdSlot } from "@/components/ad-slot";
import {
  checkEligibility,
  type EligibilityCheckInput,
  type EligibilityCheckResult,
} from "@/lib/eitc";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type YesNo = true | false | null;
type PropertyLevel = EligibilityCheckInput["estimatedProperty"] | null;

interface FormState {
  isKorean: YesNo;
  isDependentOfOther: YesNo;
  hasProfessionalBusiness: YesNo;
  hasHighIncomeEmployee: YesNo;
  estimatedProperty: PropertyLevel;
}

/* ------------------------------------------------------------------ */
/*  Questions config                                                   */
/* ------------------------------------------------------------------ */

const QUESTIONS: {
  key: keyof Omit<FormState, "estimatedProperty">;
  label: string;
}[] = [
  {
    key: "isKorean",
    label:
      "한국 국적자이거나, 한국 국적자와 혼인했거나, 한국 국적 부양자녀가 있습니까?",
  },
  {
    key: "isDependentOfOther",
    label: "다른 사람의 부양자녀로 등록되어 있습니까?",
  },
  {
    key: "hasProfessionalBusiness",
    label:
      "본인 또는 배우자가 전문직(변호사·의사·회계사 등) 사업자입니까?",
  },
  {
    key: "hasHighIncomeEmployee",
    label:
      "본인 또는 배우자가 월평균 근로소득 500만원 이상 상용근로자입니까?",
  },
];

const PROPERTY_OPTIONS: {
  value: EligibilityCheckInput["estimatedProperty"];
  label: string;
}[] = [
  { value: "under_170m", label: "1.7억원 미만" },
  { value: "170m_to_240m", label: "1.7억원 ~ 2.4억원" },
  { value: "over_240m", label: "2.4억원 이상" },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function EligibilityPage() {
  const [form, setForm] = useState<FormState>({
    isKorean: null,
    isDependentOfOther: null,
    hasProfessionalBusiness: null,
    hasHighIncomeEmployee: null,
    estimatedProperty: null,
  });

  const [result, setResult] = useState<EligibilityCheckResult | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const allAnswered =
    form.isKorean !== null &&
    form.isDependentOfOther !== null &&
    form.hasProfessionalBusiness !== null &&
    form.hasHighIncomeEmployee !== null &&
    form.estimatedProperty !== null;

  function handleSubmit() {
    if (!allAnswered) return;
    const input: EligibilityCheckInput = {
      isKorean: form.isKorean!,
      isDependentOfOther: form.isDependentOfOther!,
      hasProfessionalBusiness: form.hasProfessionalBusiness!,
      hasHighIncomeEmployee: form.hasHighIncomeEmployee!,
      estimatedProperty: form.estimatedProperty!,
    };
    setResult(checkEligibility(input));
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  }

  function handleReset() {
    setForm({
      isKorean: null,
      isDependentOfOther: null,
      hasProfessionalBusiness: null,
      hasHighIncomeEmployee: null,
      estimatedProperty: null,
    });
    setResult(null);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="bg-primary/10 rounded-full p-3 w-fit mx-auto mb-4">
          <ClipboardCheck className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold">
          근로장려금 대상자 확인 — 5문항 자격 체크
        </h1>
        <p className="text-muted-foreground mt-2">
          5가지 질문에 답하면 수급 자격 여부를 바로 확인할 수 있습니다
        </p>
      </div>

      {/* Checklist form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            자격 체크리스트
            <Badge variant="secondary">5문항</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Q1–Q4: Yes/No questions */}
          {QUESTIONS.map((q, idx) => (
            <div key={q.key}>
              <p className="text-sm font-medium mb-2">
                <span className="text-primary font-bold mr-1">Q{idx + 1}.</span>
                {q.label}
              </p>
              <div className="flex gap-2">
                <Button
                  variant={form[q.key] === true ? "default" : "outline"}
                  size="sm"
                  onClick={() =>
                    setForm((prev) => ({ ...prev, [q.key]: true }))
                  }
                >
                  예
                </Button>
                <Button
                  variant={form[q.key] === false ? "default" : "outline"}
                  size="sm"
                  onClick={() =>
                    setForm((prev) => ({ ...prev, [q.key]: false }))
                  }
                >
                  아니오
                </Button>
              </div>
            </div>
          ))}

          {/* Q5: Property level */}
          <div>
            <p className="text-sm font-medium mb-2">
              <span className="text-primary font-bold mr-1">Q5.</span>
              가구원 합산 재산이 어느 정도입니까?
            </p>
            <div className="flex flex-wrap gap-2">
              {PROPERTY_OPTIONS.map((opt) => (
                <Button
                  key={opt.value}
                  variant={
                    form.estimatedProperty === opt.value ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      estimatedProperty: opt.value,
                    }))
                  }
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Submit / Reset */}
          <div className="flex gap-3 pt-2">
            <Button
              size="lg"
              disabled={!allAnswered}
              onClick={handleSubmit}
              className="flex-1"
            >
              확인하기
            </Button>
            {result && (
              <Button variant="outline" size="lg" onClick={handleReset}>
                다시 하기
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Result */}
      <div ref={resultRef} />
      {result && (
        <div className="mb-8">
          {result.status === "eligible" && (
            <Card className="border-green-300 bg-green-50/60">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600 shrink-0 mt-0.5" />
                  <div className="space-y-3">
                    <p className="text-lg font-bold text-green-900">
                      수급 자격이 있습니다
                    </p>
                    <p className="text-sm text-green-800">
                      입력하신 조건 기준으로 근로·자녀장려금 수급 대상에 해당합니다.
                      아래 계산기에서 예상 금액을 확인해 보세요.
                    </p>
                    <Button
                      size="lg"
                      nativeButton={false}
                      render={<Link href="/calculator" />}
                      className="mt-2"
                    >
                      예상 금액 계산하기
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {result.status === "reduced" && (
            <Card className="border-yellow-300 bg-yellow-50/60">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-6 w-6 text-yellow-600 shrink-0 mt-0.5" />
                  <div className="space-y-3">
                    <p className="text-lg font-bold text-yellow-900">
                      조건부 대상입니다
                    </p>
                    {result.warnings.map((w, i) => (
                      <p key={i} className="text-sm text-yellow-800">
                        {w}
                      </p>
                    ))}
                    <Button
                      size="lg"
                      nativeButton={false}
                      render={<Link href="/calculator" />}
                      className="mt-2"
                    >
                      예상 금액 계산하기
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {result.status === "blocked" && (
            <Card className="border-red-300 bg-red-50/60">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <XCircle className="h-6 w-6 text-red-600 shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <p className="text-lg font-bold text-red-900">
                      수급 대상이 아닙니다
                    </p>
                    <p className="text-sm text-red-800">
                      {result.blockReasons[0]}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {(result.status === "eligible" || result.status === "reduced") && (
            <div className="mt-4 text-center">
              <Link
                href="/updates/hometax-application-guide"
                className="inline-block text-blue-600 hover:underline font-medium"
              >
                👉 지금 바로 신청 방법 확인하기 →
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Ad slot */}
      <div className="my-8">
        <AdSlot slot="8057830900" format="auto" minHeight="280px" />
      </div>

      <section className="mt-8 pt-6 border-t">
        <h3 className="text-lg font-semibold mb-3">함께 보면 좋은 정보</h3>
        <ul className="space-y-2 text-sm">
          <li>
            <Link href="/updates/hometax-application-guide" className="text-blue-600 hover:underline">
              → 홈택스 근로장려금 신청 — 5월 1일 시작 전 미리 준비할 것
            </Link>
          </li>
          <li>
            <Link href="/updates/late-application-guide" className="text-blue-600 hover:underline">
              → 근로장려금 미신청 시 어떻게 되나 — 12월 1일 기한 후 신청 방법
            </Link>
          </li>
        </ul>
      </section>

      <DisclaimerBanner />
    </div>
  );
}
