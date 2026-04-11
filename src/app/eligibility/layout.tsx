import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "대상 확인 - 근로·자녀장려금 자격 기준",
  description:
    "2026 근로·자녀장려금 대상 여부를 건강보험료 기준으로 확인하세요. 가구원 수별 소득 기준, 직장·지역 건강보험료 기준표 안내.",
  alternates: { canonical: "/eligibility" },
  openGraph: {
    images: [
      {
        url: "/og-guide.jpg",
        width: 1200,
        height: 630,
        alt: "근로·자녀장려금 자격 확인 — 5문항 체크",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-guide.jpg"],
  },
};

export default function EligibilityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
