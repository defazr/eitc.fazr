import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, ArrowLeft, ArrowRight, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DisclaimerBanner } from "@/components/disclaimer-banner";
import { AdSlot } from "@/components/ad-slot";
import { ShareButtons } from "@/components/share-buttons";
import { GovLinkButton } from "@/components/gov-link-button";
import { SUBSIDY_CONFIG } from "@/data/subsidy";
import regionsData from "@/data/regions.json";
import type { Region } from "@/data/types";

const regions = regionsData.regions as Region[];

export async function generateStaticParams() {
  return regions.map((region) => ({ slug: region.slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const region = regions.find((r) => r.slug === slug);
  if (!region) return {};
  return {
    title: `${region.fullName} 고유가 피해지원금 - 대상 확인 및 예상 금액`,
    description: `${region.fullName} 고유가 피해지원금 안내. 인구감소 ${region.type}지역, 1인당 ${region.amount.toLocaleString("ko-KR")}원 예상 지급. 대상 확인 및 신청 방법.`,
    alternates: { canonical: `/regions/${slug}` },
  };
}

function formatAmount(num: number): string {
  return num.toLocaleString("ko-KR");
}

export default async function RegionDetailPage({ params }: Props) {
  const { slug } = await params;
  const region = regions.find((r) => r.slug === slug);
  if (!region) notFound();

  const sameProvince = regions.filter(
    (r) => r.province === region.province && r.slug !== region.slug
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link
        href="/regions"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        전체 지역 목록
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Badge
            className={
              region.type === "특별"
                ? "bg-orange-100 text-orange-800 hover:bg-orange-100"
                : "bg-blue-100 text-blue-800 hover:bg-blue-100"
            }
          >
            인구감소 {region.type}지역
          </Badge>
          <Badge variant="outline">{region.area}</Badge>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold">{region.fullName}</h1>
        <p className="text-muted-foreground mt-2">
          {region.fullName} 고유가 피해지원금 안내
        </p>
      </div>

      {/* 지급액 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>예상 1인당 지급액</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-4xl font-bold text-primary">
              {formatAmount(region.amount)}원
            </p>
            <p className="text-muted-foreground mt-2">
              인구감소 {region.type}지역 기준 · 1인당 지급액
            </p>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 mt-4">
            <p className="text-sm font-medium mb-2">가구원 수별 예상 총액</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((m) => (
                <div key={m} className="text-center bg-white rounded p-2">
                  <p className="text-xs text-muted-foreground">{m}인 가구</p>
                  <p className="font-bold text-primary">
                    {formatAmount(region.amount * m)}원
                  </p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 일반 지역 비교 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>일반 지역과 비교</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">수도권 일반</span>
              <span className="text-sm">
                {formatAmount(SUBSIDY_CONFIG.amounts.metropolitan)}원
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">비수도권 일반</span>
              <span className="text-sm">
                {formatAmount(SUBSIDY_CONFIG.amounts.nonMetropolitan)}원
              </span>
            </div>
            <div className="flex justify-between items-center font-bold text-primary border-t pt-3">
              <span className="text-sm">
                {region.fullName} ({region.type})
              </span>
              <span className="text-sm">
                {formatAmount(region.amount)}원
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            * {region.fullName}은 인구감소 {region.type}지역으로, 일반{" "}
            {region.area} 대비{" "}
            {formatAmount(
              region.amount -
                (region.area === "수도권"
                  ? SUBSIDY_CONFIG.amounts.metropolitan
                  : SUBSIDY_CONFIG.amounts.nonMetropolitan)
            )}
            원 더 받을 수 있습니다 (예상)
          </p>
        </CardContent>
      </Card>

      {/* CTAs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <GovLinkButton type="apply" />
        <Button variant="outline" render={<Link href="/calculator" />} className="gap-2">
            <Calculator className="h-4 w-4" />{region.name} 기준으로 내가 받을 수 있을까?
        </Button>
      </div>
      <div className="flex flex-wrap gap-3 text-sm mb-6">
        <Link href="/eligibility" className="text-primary hover:underline">
          대상 기준 확인
        </Link>
        <span className="text-muted-foreground">·</span>
        <Link href="/regions" className="text-primary hover:underline">
          다른 지역 보기
        </Link>
      </div>

      <ShareButtons title={`${region.fullName} 고유가 피해지원금 확인`} />

      {/* 디스플레이 광고 — 지역 상세 */}
      <div className="my-8">
        <AdSlot slot="9027843789" format="auto" minHeight="280px" />
      </div>

      {/* 같은 도 지역 */}
      {sameProvince.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">
              {region.province} 내 다른 인구감소지역
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {sameProvince.map((r) => (
                <Link key={r.slug} href={`/regions/${r.slug}`}>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-accent"
                  >
                    {r.name}{" "}
                    <span className="text-muted-foreground ml-1">
                      {r.type}
                    </span>
                  </Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <DisclaimerBanner />
    </div>
  );
}
