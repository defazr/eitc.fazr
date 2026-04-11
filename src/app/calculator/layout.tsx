import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "고유가 피해지원금 계산기 - 예상 지원금 확인",
  description:
    "2026 고유가 피해지원금 계산기. 가구원 수, 건강보험료, 거주 지역만 입력하면 예상 지원금을 바로 확인할 수 있습니다.",
  alternates: { canonical: "/calculator" },
};

export default function CalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
