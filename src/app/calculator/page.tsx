"use client";

import { useState } from "react";
import Link from "next/link";
import { Calculator, ArrowRight, Fuel } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DisclaimerBanner } from "@/components/disclaimer-banner";
import { AdSlot } from "@/components/ad-slot";
import { ShareButtons } from "@/components/share-buttons";
import { GovLinkButton } from "@/components/gov-link-button";
import {
  SUBSIDY_CONFIG,
  getSubsidyAmount,
  checkEligibility,
  type RegionType,
} from "@/data/subsidy";

type CalcResult = {
  eligible: boolean;
  message: string;
  amount: number;
  regionLabel: string;
  members: number;
} | null;

export default function CalculatorPage() {
  const [members, setMembers] = useState<string>("");
  const [insurance, setInsurance] = useState<string>("");
  const [regionType, setRegionType] = useState<string>("");
  const [result, setResult] = useState<CalcResult>(null);

  const regionLabels: Record<string, string> = {
    수도권: "수도권",
    비수도권: "비수도권 일반",
    인구감소우대: "인구감소 우대지역",
    인구감소특별: "인구감소 특별지역",
  };

  function handleCalculate() {
    const memberNum = parseInt(members);
    const insuranceNum = parseInt(insurance.replace(/,/g, ""));

    if (!memberNum || !insuranceNum || !regionType) return;

    const eligibility = checkEligibility(memberNum, insuranceNum);
    const amount = eligibility.eligible
      ? getSubsidyAmount(regionType as RegionType) * memberNum
      : 0;

    setResult({
      eligible: eligibility.eligible,
      message: eligibility.message,
      amount,
      regionLabel: regionLabels[regionType] || regionType,
      members: memberNum,
    });
  }

  function formatAmount(num: number): string {
    return num.toLocaleString("ko-KR");
  }

  function handleInsuranceChange(value: string) {
    const numOnly = value.replace(/[^0-9]/g, "");
    if (numOnly) {
      setInsurance(parseInt(numOnly).toLocaleString("ko-KR"));
    } else {
      setInsurance("");
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <div className="bg-primary/10 rounded-full p-3 w-fit mx-auto mb-4">
          <Calculator className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold">
          고유가 피해지원금 계산기
        </h1>
        <p className="text-muted-foreground mt-2">
          3가지 정보만 입력하면 예상 지원금을 바로 확인할 수 있습니다
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">정보 입력</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* 가구원 수 */}
          <div>
            <label className="text-sm font-medium mb-2 block">가구원 수</label>
            <Select value={members} onValueChange={(v) => setMembers(v ?? "")}>
              <SelectTrigger>
                <SelectValue placeholder="가구원 수를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1인 가구</SelectItem>
                <SelectItem value="2">2인 가구</SelectItem>
                <SelectItem value="3">3인 가구</SelectItem>
                <SelectItem value="4">4인 가구</SelectItem>
                <SelectItem value="5">5인 이상 가구</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 건강보험료 */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              월 건강보험료 (본인부담금)
            </label>
            <div className="relative">
              <Input
                type="text"
                inputMode="numeric"
                placeholder="건강보험료를 입력하세요"
                value={insurance}
                onChange={(e) => handleInsuranceChange(e.target.value)}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                원
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              건강보험료 고지서 또는 국민건강보험 앱에서 확인 가능
            </p>
          </div>

          {/* 거주 지역 */}
          <div>
            <label className="text-sm font-medium mb-2 block">거주 지역</label>
            <Select value={regionType} onValueChange={(v) => setRegionType(v ?? "")}>
              <SelectTrigger>
                <SelectValue placeholder="거주 지역을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="수도권">
                  수도권 (서울·경기·인천)
                </SelectItem>
                <SelectItem value="비수도권">비수도권 일반</SelectItem>
                <SelectItem value="인구감소우대">
                  인구감소 우대지역 (49곳)
                </SelectItem>
                <SelectItem value="인구감소특별">
                  인구감소 특별지역 (40곳)
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              인구감소지역 여부는{" "}
              <a href="/regions" className="text-primary underline">
                지역별 안내
              </a>
              에서 확인하세요
            </p>
          </div>

          <Button
            onClick={handleCalculate}
            className="w-full py-6 text-base"
            disabled={!members || !insurance || !regionType}
          >
            예상 지원금 계산하기
          </Button>
        </CardContent>
      </Card>

      {/* Result */}
      {result && (
        <Card className="mt-6">
          <CardContent className="pt-6">
            {result.eligible ? (
              <div className="text-center">
                <Badge className="mb-3 bg-green-100 text-green-800 hover:bg-green-100">
                  예상 지원 대상
                </Badge>
                <p className="text-sm text-muted-foreground">
                  {result.members}인 가구 · {result.regionLabel}
                </p>
                <p className="text-4xl font-bold text-primary mt-3 mb-1">
                  {formatAmount(result.amount)}원
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  예상 총 지원금 (1인당{" "}
                  {formatAmount(
                    getSubsidyAmount(regionType as RegionType)
                  )}
                  원 x {result.members}인)
                </p>
                <p className="text-sm text-green-700 bg-green-50 rounded-md px-3 py-2 mb-6">
                  신청 시 지급 대상에 포함될 수 있습니다
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <GovLinkButton type="apply" />
                  <a
                    href="https://fuel.fazr.co.kr"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="outline"
                      className="w-full gap-2"
                    >
                      <Fuel className="h-4 w-4" />
                      유류비 더 절약하기
                    </Button>
                  </a>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <Badge
                  variant="secondary"
                  className="mb-3 bg-gray-100 text-gray-700"
                >
                  {members === "5" ? "별도 산정" : "대상 외 추정"}
                </Badge>
                <p className="text-muted-foreground mt-2">{result.message}</p>
                {members !== "5" && (
                  <p className="text-sm text-muted-foreground mt-4">
                    정확한 대상 여부는 정책 확정 후 정부24에서 확인하세요
                  </p>
                )}
              </div>
            )}

            <div className="mt-6 pt-4 border-t space-y-2">
              <div className="flex flex-wrap justify-center gap-3 text-sm">
                <Link href="/regions" className="text-primary hover:underline">
                  지역별 상세 정보 보기
                </Link>
                <span className="text-muted-foreground">·</span>
                <Link href="/faq" className="text-primary hover:underline">
                  자주 묻는 질문
                </Link>
                <span className="text-muted-foreground">·</span>
                <Link href="/eligibility" className="text-primary hover:underline">
                  대상 기준 확인
                </Link>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                * 위 결과는 예상 기준이며, 실제 지원금은 정책 확정 후 변경될 수
                있습니다. 정확한 정보는 정부24 또는 관할 주민센터를 통해
                확인하시기 바랍니다.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Share + Ad */}
      {result && (
        <>
          <ShareButtons title="고유가 피해지원금 계산 결과 확인해보세요" />
          <div className="mt-6">
            <AdSlot slot="1480116169" format="rectangle" />
          </div>
        </>
      )}

      {/* Income Threshold Reference */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">
            가구원 수별 건강보험료 기준 (예상)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium">가구원</th>
                  <th className="text-right py-2 font-medium">직장가입자</th>
                  <th className="text-right py-2 font-medium">지역가입자</th>
                </tr>
              </thead>
              <tbody>
                {SUBSIDY_CONFIG.incomeThresholds.map((t) => (
                  <tr key={t.members} className="border-b last:border-0">
                    <td className="py-2.5">{t.members}인</td>
                    <td className="text-right py-2.5">
                      {t.insuranceEmployee > 0
                        ? `${formatAmount(t.insuranceEmployee)}원 이하`
                        : "별도 산정"}
                    </td>
                    <td className="text-right py-2.5">
                      {t.insuranceRegional > 0
                        ? `${formatAmount(t.insuranceRegional)}원 이하`
                        : "별도 산정"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            * 소득 하위 70% 기준 예상치이며, 정책 확정 시 변경될 수 있습니다
          </p>
        </CardContent>
      </Card>

      <div className="flex flex-wrap justify-center gap-4 mt-8 text-sm">
        <Link href="/updates" className="text-primary hover:underline">
          고유가 피해지원금 지급 일정이 궁금하다면 →
        </Link>
        <Link href="/" className="text-muted-foreground hover:text-foreground">
          처음으로 돌아가기 →
        </Link>
      </div>

      <div className="mt-6">
        <DisclaimerBanner />
      </div>
    </div>
  );
}
