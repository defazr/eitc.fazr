import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "근로·자녀장려금 계산기 - 예상 금액 확인",
  description:
    "2025년 귀속 근로·자녀장려금 계산기. 가구유형, 총급여, 재산만 입력하면 예상 장려금을 바로 확인할 수 있습니다.",
  alternates: { canonical: "/calculator" },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "근로·자녀장려금",
    url: "https://eitc.fazr.co.kr/calculator",
    images: [
      {
        url: "/og-calculator.jpg",
        width: 1200,
        height: 630,
        alt: "근로·자녀장려금 계산기 — 30초 예상 금액 확인",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-calculator.jpg"],
  },
};

export default function CalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
