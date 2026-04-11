import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DisclaimerBanner } from "@/components/disclaimer-banner";
import regionsData from "@/data/regions.json";
import type { Region } from "@/data/types";

export const metadata: Metadata = {
  title: "인구감소지역 목록 - 89개 지자체 고유가 지원금 특별·우대 혜택",
  description:
    "2026 고유가 피해지원금 인구감소지역 89개 전체 목록. 특별지역 40곳(25만원), 우대지역 49곳(20만원) 지역별 예상 지급액 확인.",
  alternates: { canonical: "/regions" },
};

const regions = regionsData.regions as Region[];

function groupByProvince(regions: Region[]) {
  const grouped: Record<string, Region[]> = {};
  for (const r of regions) {
    if (!grouped[r.province]) grouped[r.province] = [];
    grouped[r.province].push(r);
  }
  return grouped;
}

function formatAmount(num: number): string {
  return num.toLocaleString("ko-KR");
}

export default function RegionsPage() {
  const grouped = groupByProvince(regions);
  const specialCount = regions.filter((r) => r.type === "특별").length;
  const preferredCount = regions.filter((r) => r.type === "우대").length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <div className="bg-primary/10 rounded-full p-3 w-fit mx-auto mb-4">
          <MapPin className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold">
          인구감소지역 목록 (89개)
        </h1>
        <p className="text-muted-foreground mt-2">
          인구감소지역 거주자는 일반 지역보다 더 많은 지원금을 받을 수 있습니다
        </p>
      </div>

      {/* Page CTAs */}
      <div className="flex flex-wrap justify-center gap-4 mb-8 text-sm">
        <Link
          href="/calculator"
          className="inline-flex items-center gap-1 text-primary font-medium hover:underline"
        >
          고유가 지원금 계산하기 →
        </Link>
        <Link href="/eligibility" className="text-primary hover:underline">
          고유가 지원금 대상 기준 먼저 확인 →
        </Link>
        <Link href="/faq" className="text-primary hover:underline">
          고유가 지원금 조건이 궁금하다면 →
        </Link>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Card className="text-center border-orange-200 bg-orange-50/50">
          <CardContent className="pt-5 pb-4">
            <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100 mb-2">
              특별지역
            </Badge>
            <p className="text-3xl font-bold text-orange-700">{specialCount}곳</p>
            <p className="text-sm text-orange-600 mt-1">
              1인당 {formatAmount(250000)}원
            </p>
          </CardContent>
        </Card>
        <Card className="text-center border-blue-200 bg-blue-50/50">
          <CardContent className="pt-5 pb-4">
            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 mb-2">
              우대지역
            </Badge>
            <p className="text-3xl font-bold text-blue-700">{preferredCount}곳</p>
            <p className="text-sm text-blue-600 mt-1">
              1인당 {formatAmount(200000)}원
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Grouped by Province */}
      {Object.entries(grouped).map(([province, regionList]) => (
        <div key={province} className="mb-8">
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
            {province}
            <span className="text-sm font-normal text-muted-foreground">
              ({regionList.length}곳)
            </span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {regionList.map((region) => (
              <Link key={region.slug} href={`/regions/${region.slug}`}>
                <Card className="hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer h-full">
                  <CardContent className="flex items-center justify-between py-4">
                    <div>
                      <p className="font-medium">{region.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant="secondary"
                          className={
                            region.type === "특별"
                              ? "bg-orange-100 text-orange-800 hover:bg-orange-100"
                              : "bg-blue-100 text-blue-800 hover:bg-blue-100"
                          }
                        >
                          {region.type}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {formatAmount(region.amount)}원
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground/50 shrink-0" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      ))}

      {/* Internal Link */}
      <Card className="bg-gradient-to-br from-blue-50 to-sky-50 border-blue-100 mb-8">
        <CardContent className="flex items-center gap-4 py-5">
          <MapPin className="h-8 w-8 text-blue-600 shrink-0" />
          <div className="flex-1">
            <p className="font-semibold">우리 지역 뉴스 보기</p>
            <p className="text-sm text-muted-foreground">
              지역별 최신 소식을 확인하세요
            </p>
          </div>
          <a
            href="https://headlines.fazr.co.kr"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Badge variant="outline" className="cursor-pointer">
              바로가기
            </Badge>
          </a>
        </CardContent>
      </Card>

      <DisclaimerBanner />
    </div>
  );
}
