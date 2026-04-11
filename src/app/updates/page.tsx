import type { Metadata } from "next";
import Link from "next/link";
import { Newspaper, ArrowRight, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DisclaimerBanner } from "@/components/disclaimer-banner";
import { AdSlot } from "@/components/ad-slot";
import { UPDATES } from "@/data/updates";

export const metadata: Metadata = {
  title: "업데이트 - 고유가 피해지원금 최신 소식",
  description:
    "2026 고유가 피해지원금 정책 변경, 추경 심사 현황, 신청 일정 등 최신 업데이트 소식을 확인하세요.",
  alternates: { canonical: "/updates" },
};

export default function UpdatesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <div className="bg-primary/10 rounded-full p-3 w-fit mx-auto mb-4">
          <Newspaper className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold">최신 업데이트</h1>
        <p className="text-muted-foreground mt-2">
          고유가 피해지원금 관련 최신 소식과 정책 변경 사항
        </p>
      </div>

      <div className="space-y-4">
        {UPDATES.map((post, index) => (
          <div key={post.slug}>
            <Link href={`/updates/${post.slug}`}>
              <Card className="hover:border-primary/30 hover:shadow-md transition-all cursor-pointer mb-4">
                <CardContent className="py-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">
                      <Clock className="h-3 w-3 mr-1" />
                      {post.date}
                    </Badge>
                  </div>
                  <h2 className="font-semibold text-lg mb-2">{post.title}</h2>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {post.description}
                  </p>
                  <div className="flex items-center gap-1 text-primary text-sm mt-3">
                    자세히 보기
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
            {index === 1 && (
              <div className="my-6">
                <AdSlot slot="9379409604" format="autorelaxed" minHeight="280px" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8">
        <DisclaimerBanner />
      </div>
    </div>
  );
}
