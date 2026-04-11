import Link from "next/link";
import {
  Calculator,
  Users,
  MapPin,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  Banknote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DisclaimerBanner } from "@/components/disclaimer-banner";
import { AdSlot } from "@/components/ad-slot";
import { ShareButtons } from "@/components/share-buttons";
import { SUBSIDY_CONFIG } from "@/data/subsidy";

const QUICK_LINKS = [
  {
    href: "/eligibility",
    icon: Users,
    title: "대상 확인",
    desc: "건강보험료 기준으로 내가 받을 수 있는지 확인",
  },
  {
    href: "/calculator",
    icon: Calculator,
    title: "예상 금액 계산",
    desc: "가구원 수와 지역에 따른 예상 지원금 확인",
  },
  {
    href: "/regions",
    icon: MapPin,
    title: "지역별 안내",
    desc: "89개 인구감소지역 특별·우대 혜택 확인",
  },
  {
    href: "/faq",
    icon: HelpCircle,
    title: "자주 묻는 질문",
    desc: "신청 방법, K패스, 금리인하 등 궁금한 것",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-4 text-sm px-4 py-1">
            추경 통과 — 4월 지급 시작
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight mb-4">
            고유가 피해지원금 대상인지
            <br />
            지금 바로 확인하세요
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-1">
            소득 하위 <span className="text-blue-600 font-bold">70%</span> 가구 대상
          </p>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-3">
            1인당 최대{" "}
            <span className="text-blue-600 font-bold">60만원</span> 차등 지급
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            총 예산 {SUBSIDY_CONFIG.totalBudget} · 대상{" "}
            {SUBSIDY_CONFIG.targetPopulation}
          </p>

          <Button size="lg" render={<Link href="/calculator" />} className="text-lg px-8 py-6 shadow-lg bg-[#0369A1] hover:bg-[#0369A1]/90 cursor-pointer transition-all duration-200">
              내가 받을 수 있을까?
              <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          <p className="text-xs text-muted-foreground mt-4">
            건강보험료 기준으로 3초 만에 확인하세요
          </p>
        </div>
      </section>

      {/* Key Stats */}
      <section className="max-w-6xl mx-auto px-4 -mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "수도권", value: "10만원", sub: "1인당" },
            { label: "비수도권", value: "15만원", sub: "1인당" },
            { label: "우대지역", value: "20만원", sub: "인구감소 49곳" },
            { label: "특별지역", value: "25만원", sub: "인구감소 40곳" },
          ].map((stat) => (
            <Card key={stat.label} className="text-center">
              <CardContent className="pt-5 pb-4">
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold text-primary mt-1">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.sub}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Ad Slot 1 */}
      <section className="max-w-6xl mx-auto px-4 py-4">
        <AdSlot slot="4106279506" format="horizontal" />
      </section>

      {/* Quick Links */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-8">
          필요한 정보를 빠르게 확인하세요
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {QUICK_LINKS.map((link) => (
            <Link key={link.href} href={link.href}>
              <Card className="hover:border-primary/30 hover:shadow-md transition-all cursor-pointer h-full">
                <CardContent className="flex items-start gap-4 py-5">
                  <div className="bg-primary/10 rounded-lg p-3 shrink-0">
                    <link.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {link.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {link.desc}
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground/50 ml-auto shrink-0 self-center" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        <div className="text-center mt-8">
          <Button size="lg" render={<Link href="/calculator" />} className="px-8 py-6 text-base shadow-lg">
            내가 받을 수 있을까?
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Internal Traffic CTAs */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="https://fuel.fazr.co.kr"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Card className="bg-gradient-to-br from-blue-50 to-sky-50 border-blue-100 hover:shadow-md transition-all cursor-pointer">
              <CardContent className="flex items-center gap-4 py-5">
                <TrendingUp className="h-8 w-8 text-blue-600 shrink-0" />
                <div>
                  <p className="font-semibold text-foreground">
                    내 유류비 얼마나 줄어드나
                  </p>
                  <p className="text-sm text-muted-foreground">
                    유류비 절약 계산기로 확인하기
                  </p>
                </div>
              </CardContent>
            </Card>
          </a>
          <a
            href="https://calc.fazr.co.kr"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100 hover:shadow-md transition-all cursor-pointer">
              <CardContent className="flex items-center gap-4 py-5">
                <Banknote className="h-8 w-8 text-indigo-600 shrink-0" />
                <div>
                  <p className="font-semibold text-foreground">
                    다른 계산기도 확인
                  </p>
                  <p className="text-sm text-muted-foreground">
                    실생활에 필요한 다양한 계산기
                  </p>
                </div>
              </CardContent>
            </Card>
          </a>
        </div>
      </section>

      {/* Updates link */}
      <section className="max-w-6xl mx-auto px-4 pb-8 text-center">
        <Link
          href="/updates"
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          고유가 피해지원금 지급 일정 확인 →
        </Link>
      </section>

      {/* Share */}
      <section className="max-w-6xl mx-auto px-4 pb-8">
        <ShareButtons title="고유가 피해지원금 대상 확인해보세요" />
      </section>

      {/* Disclaimer */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <DisclaimerBanner />
      </section>
    </>
  );
}
