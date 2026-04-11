import Link from "next/link";
import {
  Calculator,
  Users,
  HelpCircle,
  ArrowRight,
  CalendarDays,
  TrendingUp,
  Banknote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DisclaimerBanner } from "@/components/disclaimer-banner";
import { AdSlot } from "@/components/ad-slot";
import { ShareButtons } from "@/components/share-buttons";

const QUICK_LINKS = [
  {
    href: "/calculator",
    icon: Calculator,
    title: "내 예상 금액 계산하기",
    desc: "가구 상황과 소득만 입력하면 30초 안에 결과 확인",
  },
  {
    href: "/eligibility",
    icon: Users,
    title: "받을 수 있는지 먼저 확인하기",
    desc: "5개 질문으로 수급 자격 빠르게 판정",
  },
  {
    href: "/faq",
    icon: HelpCircle,
    title: "자주 묻는 질문 보기",
    desc: "신청기간, 재산기준, 지급일 등 궁금증 정리",
  },
];

const INFO_CARDS = [
  {
    title: "얼마 받나요?",
    href: "/calculator",
    cta: "예상 금액 계산하기",
    lines: [
      "근로장려금은 최대 330만원까지 받을 수 있습니다.",
      "가구 유형에 따라 상한이 다릅니다.",
    ],
    bullets: ["단독 165만원", "홑벌이 285만원", "맞벌이 330만원"],
    extra: [
      "2026 자녀장려금은 홑벌이·맞벌이가 1인당 100만원을 더 받습니다.",
      "실제 수령액은 총급여액과 재산에 따라 달라집니다.",
      "지금 바로 계산하면 30초 안에 내가 받을 금액이 나옵니다.",
    ],
  },
  {
    title: "누가 받나요?",
    href: "/eligibility",
    cta: "자격 확인하기",
    lines: [
      "2025년에 근로·사업·종교인소득이 있는 저소득 가구가 대상입니다.",
      "근로장려금 총소득 기준은 가구별로 다릅니다.",
      "단독 2,200만원, 홑벌이 3,200만원, 맞벌이 4,400만원 미만이면 받습니다.",
    ],
    bullets: [],
    extra: [
      "자녀장려금은 부양자녀가 있는 홑벌이·맞벌이가 받습니다.",
      "총소득 7,000만원 미만까지 대상입니다.",
      "단, 재산은 2.4억원 미만이어야 합니다.",
      "5개 질문으로 내가 대상인지 30초 안에 확인할 수 있습니다.",
    ],
  },
  {
    title: "언제 신청하나요?",
    href: "/faq",
    cta: "자주 묻는 질문 보기",
    lines: [
      "2025년 귀속 정기 신청은 2026년 5월 1일부터 6월 1일까지입니다.",
      "5월 안에 신청하면 9월 말에 장려금이 입금됩니다.",
    ],
    bullets: [],
    extra: [
      "6월 2일 이후 신청하면 산정액의 95%만 받습니다.",
      "5월 정기 신청 기간을 꼭 지키세요.",
    ],
  },
];

const SCHEDULE = [
  {
    label: "하반기 반기분",
    period: "2026.03.01 ~ 03.16 (종료)",
    payout: "2026년 6월 25일 일괄",
  },
  {
    label: "정기 신청",
    period: "2026.05.01 ~ 06.01",
    payout: "2026년 9월 말 (8월 말 조기지급 가능)",
    highlight: true,
  },
  {
    label: "기한 후 신청",
    period: "2026.06.02 ~ 11.30",
    payout: "신청일 + 4개월 이내 (95% 지급)",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-4 text-sm px-4 py-1">
            2025년 귀속 · 2026년 신청
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight mb-4">
            2026 자녀장려금·근로장려금,
            <br />
            얼마 받을 수 있나요?
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-1">
            2025년에 일하셨다면 근로장려금 최대{" "}
            <span className="text-blue-600 font-bold">330만원</span>을 받습니다.
          </p>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-1">
            자녀장려금은 1인당 최대{" "}
            <span className="text-blue-600 font-bold">100만원</span>이
            더해집니다.
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            대상·기준·신청기간을 3분 안에 확인하세요.
          </p>

          <Button
            size="lg"
            render={<Link href="/calculator" />}
            className="text-lg px-8 py-6 shadow-lg bg-[#0369A1] hover:bg-[#0369A1]/90 cursor-pointer transition-all duration-200"
          >
            내 예상 금액 계산하기
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          <p className="text-xs text-muted-foreground mt-4">
            지금 바로 계산하면 30초 안에 내가 받을 금액이 나옵니다.
          </p>
        </div>
      </section>

      {/* Key Stats */}
      <section className="max-w-6xl mx-auto px-4 -mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "단독가구", value: "165만원", sub: "근로장려금 최대" },
            { label: "홑벌이", value: "285만원", sub: "근로장려금 최대" },
            { label: "맞벌이", value: "330만원", sub: "근로장려금 최대" },
            { label: "자녀 1인당", value: "100만원", sub: "자녀장려금 최대" },
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
          근로·자녀장려금, 이것만 알면 됩니다
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {INFO_CARDS.map((card) => (
            <Card key={card.title} className="h-full">
              <CardContent className="py-5">
                <h3 className="font-semibold text-foreground text-lg mb-3">
                  {card.title}
                </h3>
                {card.lines.map((line) => (
                  <p
                    key={line}
                    className="text-sm text-muted-foreground mb-2"
                  >
                    {line}
                  </p>
                ))}
                {card.bullets.length > 0 && (
                  <ul className="text-sm text-muted-foreground mb-2 list-disc pl-5 space-y-1">
                    {card.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                )}
                {card.extra.map((line) => (
                  <p
                    key={line}
                    className="text-sm text-muted-foreground mb-2"
                  >
                    {line}
                  </p>
                ))}
                <Link
                  href={card.href}
                  className="inline-flex items-center gap-1 text-sm text-primary font-medium hover:underline mt-2"
                >
                  {card.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Links */}
      <section className="max-w-6xl mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
      </section>

      {/* Schedule */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-8">
          2026 자녀장려금·근로장려금 주요 일정
        </h2>
        <div className="space-y-3">
          {SCHEDULE.map((row) => (
            <Card
              key={row.label}
              className={
                row.highlight
                  ? "border-primary/30 bg-primary/5"
                  : undefined
              }
            >
              <CardContent className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 py-4">
                <Badge
                  variant={row.highlight ? "default" : "secondary"}
                  className="w-fit"
                >
                  <CalendarDays className="h-3 w-3 mr-1" />
                  {row.label}
                </Badge>
                <div className="flex-1">
                  <p className="text-sm font-medium">{row.period}</p>
                </div>
                <p className="text-sm text-muted-foreground">{row.payout}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-6 text-sm text-muted-foreground space-y-1">
          <p>
            지금은 5월 정기 신청 준비 기간입니다. 반기 신청자는 6월 25일
            지급일을 기다리시면 됩니다.
          </p>
          <p>
            그 외 대상자는 5월 1일부터 6월 1일까지 정기 신청하세요. 6월 2일
            이후에는 산정액의 95%만 지급됩니다.
          </p>
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
          근로·자녀장려금 최신 소식 확인 →
        </Link>
      </section>

      {/* Share */}
      <section className="max-w-6xl mx-auto px-4 pb-8">
        <ShareButtons title="근로·자녀장려금 대상 확인해보세요" />
      </section>

      {/* Disclaimer */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <DisclaimerBanner />
      </section>
    </>
  );
}
