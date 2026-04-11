import type { Metadata } from "next";
import Link from "next/link";
import { Users, ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DisclaimerBanner } from "@/components/disclaimer-banner";
import { AdSlot } from "@/components/ad-slot";
import { SUBSIDY_CONFIG } from "@/data/subsidy";

export const metadata: Metadata = {
  title: "대상 확인 - 고유가 피해지원금 자격 기준",
  description:
    "2026 고유가 피해지원금 대상 여부를 건강보험료 기준으로 확인하세요. 가구원 수별 소득 기준, 직장·지역 건강보험료 기준표 안내.",
  alternates: { canonical: "/eligibility" },
};

function formatAmount(num: number): string {
  return num.toLocaleString("ko-KR");
}

export default function EligibilityPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <div className="bg-primary/10 rounded-full p-3 w-fit mx-auto mb-4">
          <Users className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold">
          고유가 피해지원금 대상 확인
        </h1>
        <p className="text-muted-foreground mt-2">
          소득 하위 70% 가구가 대상이며, 건강보험료로 판단합니다
        </p>
      </div>

      {/* 핵심 기준 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="pt-5">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-green-900">대상이 되는 경우</p>
                <ul className="text-sm text-green-800 mt-2 space-y-1">
                  <li>건강보험료가 가구원 수별 기준 이하</li>
                  <li>대한민국 거주 국민</li>
                  <li>가구 소득 하위 70% 이내</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="pt-5">
            <div className="flex items-start gap-3">
              <XCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-red-900">
                  대상이 아닌 경우
                </p>
                <ul className="text-sm text-red-800 mt-2 space-y-1">
                  <li>건강보험료 기준 초과</li>
                  <li>고소득 가구 (상위 30%)</li>
                  <li>세부 제외 대상 (정책 확정 시 안내)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 건강보험료 기준표 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            가구원 수별 건강보험료 기준 (예상)
            <Badge variant="secondary">소득 하위 70%</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left py-3 px-3 font-medium">가구원 수</th>
                  <th className="text-right py-3 px-3 font-medium">
                    기준 중위소득 (예상)
                  </th>
                  <th className="text-right py-3 px-3 font-medium">
                    직장가입자
                  </th>
                  <th className="text-right py-3 px-3 font-medium">
                    지역가입자
                  </th>
                </tr>
              </thead>
              <tbody>
                {SUBSIDY_CONFIG.incomeThresholds.map((t) => (
                  <tr
                    key={t.members}
                    className="border-b last:border-0 hover:bg-muted/30"
                  >
                    <td className="py-3 px-3 font-medium">{t.members}인 가구</td>
                    <td className="text-right py-3 px-3">
                      {formatAmount(t.monthlyIncome)}원
                    </td>
                    <td className="text-right py-3 px-3">
                      {t.insuranceEmployee > 0 ? (
                        <span className="font-bold text-blue-600">
                          {formatAmount(t.insuranceEmployee)}원 이하
                        </span>
                      ) : (
                        <span className="text-muted-foreground">별도 산정</span>
                      )}
                    </td>
                    <td className="text-right py-3 px-3">
                      {t.insuranceRegional > 0 ? (
                        <span className="font-bold text-blue-600">
                          {formatAmount(t.insuranceRegional)}원 이하
                        </span>
                      ) : (
                        <span className="text-muted-foreground">별도 산정</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            * 위 기준은 소득 하위 70% 예상 기준이며, 정책 확정 시 변경될 수
            있습니다.
          </p>
        </CardContent>
      </Card>

      {/* 지역별 지급액 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>지역별 1인당 지급액</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "수도권", amount: SUBSIDY_CONFIG.amounts.metropolitan },
              {
                label: "비수도권 일반",
                amount: SUBSIDY_CONFIG.amounts.nonMetropolitan,
              },
              {
                label: "인구감소 우대",
                amount: SUBSIDY_CONFIG.amounts.depopulationPreferred,
              },
              {
                label: "인구감소 특별",
                amount: SUBSIDY_CONFIG.amounts.depopulationSpecial,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="text-center bg-muted/50 rounded-lg p-4"
              >
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-xl font-bold text-primary mt-1">
                  {formatAmount(item.amount)}원
                </p>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            * 인구감소지역 거주자는 추가 혜택을 받을 수 있습니다.{" "}
            <Link href="/regions" className="text-primary underline">
              89개 지역 확인하기
            </Link>
          </p>
        </CardContent>
      </Card>

      {/* 요약 박스 */}
      <div className="bg-[#0369A1]/5 border border-[#0369A1]/20 rounded-lg p-5 mb-8 space-y-2">
        <p className="text-sm font-medium text-foreground">핵심 요약</p>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>대상: 소득 하위 <span className="text-blue-600 font-bold">70%</span> 가구 (건강보험료 기준)</li>
          <li>금액: 지역별 1인당 <span className="text-blue-600 font-bold">10만~25만원</span> 차등 지급</li>
          <li>상태: 추경 국회 통과 (4월 10일 확정)</li>
        </ul>
      </div>

      {/* 디스플레이 광고 — 대상 확인 */}
      <div className="my-8">
        <AdSlot slot="1340925456" format="auto" minHeight="280px" />
      </div>

      {/* CTA */}
      <div className="text-center mb-8">
        <Button size="lg" render={<Link href="/calculator" />} className="px-8 py-6 text-base">
            내 예상 지원금 계산하기
            <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mt-4 mb-8 text-sm">
        <Link href="/faq" className="text-primary hover:underline">
          고유가 지원금 대상 조건이 헷갈린다면 FAQ 보기 →
        </Link>
        <Link href="/regions" className="text-primary hover:underline">
          지역별 지급 금액 확인 →
        </Link>
        <Link href="/updates" className="text-primary hover:underline">
          고유가 피해지원금 최신 정책 변경 확인 →
        </Link>
        <Link href="/" className="text-muted-foreground hover:text-foreground">
          고유가 피해지원금 전체 정보 보기 →
        </Link>
      </div>

      <DisclaimerBanner />
    </div>
  );
}
