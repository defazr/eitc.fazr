import type { Metadata } from "next";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { HelpCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DisclaimerBanner } from "@/components/disclaimer-banner";
import { AdSlot } from "@/components/ad-slot";
import { FAQ_ITEMS } from "@/data/faq";

export const metadata: Metadata = {
  title: "자주 묻는 질문 - 근로·자녀장려금 FAQ",
  description:
    "2026 자녀장려금과 근로장려금에 대해 많이 묻는 질문 15가지를 정리했습니다. 신청기간, 지급일, 재산기준, 자녀세액공제 차감까지.",
  alternates: { canonical: "/faq" },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "근로·자녀장려금",
    url: "https://eitc.fazr.co.kr/faq",
    images: [
      {
        url: "/og-guide.jpg",
        width: 1200,
        height: 630,
        alt: "근로·자녀장려금 FAQ — 자주 묻는 질문 15가지",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-guide.jpg"],
  },
};

const CATEGORY_LABELS: Record<string, string> = {
  amount: "금액",
  eligibility: "자격",
  application: "신청",
  special: "특수 케이스",
};

const CATEGORY_ORDER = ["amount", "eligibility", "application", "special"] as const;

function stripMarkdown(md: string): string {
  return md
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/[#\-*>]/g, "")
    .replace(/\n+/g, " ")
    .trim();
}

function generateFaqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: stripMarkdown(item.answer),
      },
    })),
  };
}

export default function FAQPage() {
  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    label: CATEGORY_LABELS[cat],
    items: FAQ_ITEMS.filter((item) => item.category === cat),
  }));

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateFaqJsonLd()),
        }}
      />
      <div className="text-center mb-10">
        <div className="bg-primary/10 rounded-full p-3 w-fit mx-auto mb-4">
          <HelpCircle className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold">
          근로·자녀장려금 자주 묻는 질문
        </h1>
        <p className="text-muted-foreground mt-2">
          2026 자녀장려금과 근로장려금에 대해 많이 묻는 질문 15가지를
          정리했습니다. 궁금한 내용을 빠르게 찾으세요.
        </p>
      </div>

      {grouped.map((section) => (
        <div key={section.category} className="mb-8">
          <h2 className="text-lg font-bold mb-3">{section.label}</h2>
          <Accordion className="space-y-2">
            {section.items.map((item) => (
              <AccordionItem
                key={item.id}
                className="border rounded-lg px-4"
              >
                <AccordionTrigger className="text-left text-sm font-medium hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="text-sm text-muted-foreground leading-relaxed prose prose-sm max-w-none prose-p:text-muted-foreground prose-li:text-muted-foreground prose-a:text-primary prose-strong:text-foreground">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        a: ({ href, children, ...props }) => {
                          const isExternal = href?.startsWith("http");
                          return (
                            <a
                              href={href}
                              {...(isExternal && {
                                target: "_blank",
                                rel: "noopener noreferrer",
                              })}
                              {...props}
                            >
                              {children}
                            </a>
                          );
                        },
                      }}
                    >
                      {item.answer}
                    </ReactMarkdown>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      ))}

      {/* CTA */}
      <div className="text-center mb-8">
        <Button
          size="lg"
          render={<Link href="/calculator" />}
          className="px-8"
        >
          내 예상 금액 계산하기
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>

      {/* Internal traffic */}
      <Card className="mb-8 bg-gradient-to-br from-blue-50 to-sky-50 border-blue-100">
        <CardContent className="flex items-center gap-4 py-5">
          <div className="flex-1">
            <p className="font-semibold">빚 때문에 막막하다면</p>
            <p className="text-sm text-muted-foreground">
              개인회생·파산 절차와 자격 조건을 확인해보세요
            </p>
          </div>
          <a
            href="https://debt.newsforgreens.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="sm">
              확인하기
            </Button>
          </a>
        </CardContent>
      </Card>

      {/* 멀티플렉스 광고 — FAQ 하단 */}
      <div className="my-8">
        <AdSlot slot="3554036151" format="autorelaxed" minHeight="600px" />
      </div>

      <div className="flex flex-wrap justify-center gap-4 mt-4 mb-8 text-sm">
        <Link href="/updates" className="text-primary hover:underline">
          근로·자녀장려금 최신 정책 변경 확인 →
        </Link>
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground"
        >
          전체 안내 다시 보기 →
        </Link>
      </div>

      <DisclaimerBanner />
    </div>
  );
}
