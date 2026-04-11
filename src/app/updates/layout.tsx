import type { Metadata } from "next";

export const metadata: Metadata = {
  openGraph: {
    images: [
      {
        url: "https://support.fazr.co.kr/og/og-updates.jpg",
        width: 1200,
        height: 630,
        alt: "고유가 피해지원금 최신 소식",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://support.fazr.co.kr/og/og-updates.jpg"],
  },
};

export default function UpdatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
