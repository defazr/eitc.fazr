import type { Metadata } from "next";
import Link from "next/link";
import { Calculator, Users, Newspaper, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "페이지를 찾을 수 없습니다",
};

const CTA_LINKS = [
  {
    href: "/calculator",
    icon: Calculator,
    title: "근로·자녀장려금 계산하기",
    desc: "가구 상황과 소득만 입력하면 30초 안에 결과 확인",
  },
  {
    href: "/eligibility",
    icon: Users,
    title: "내가 받을 수 있는지 확인",
    desc: "5개 질문으로 수급 자격 빠르게 판정",
  },
  {
    href: "/updates",
    icon: Newspaper,
    title: "최신 가이드 보기",
    desc: "신청기간, 지급일, 자녀장려금 가이드",
  },
];

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <h1 className="text-2xl md:text-3xl font-bold mb-3">
        찾으시는 페이지가 없습니다
      </h1>
      <p className="text-muted-foreground mb-10">
        주소가 변경되었거나 존재하지 않는 페이지입니다.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
        {CTA_LINKS.map((link) => (
          <Link key={link.href} href={link.href}>
            <Card className="hover:border-primary/30 hover:shadow-md transition-all cursor-pointer h-full">
              <CardContent className="py-5">
                <div className="bg-primary/10 rounded-lg p-3 w-fit mb-3">
                  <link.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">
                  {link.title}
                </h3>
                <p className="text-sm text-muted-foreground">{link.desc}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-10">
        <Button
          nativeButton={false}
          render={<Link href="/" />}
          className="gap-2"
        >
          홈으로 돌아가기
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
