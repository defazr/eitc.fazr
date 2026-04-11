import type { Metadata } from "next";

export const metadata: Metadata = {
  openGraph: {
    images: [
      {
        url: "/og-guide.jpg",
        width: 1200,
        height: 630,
        alt: "2026 근로·자녀장려금 가이드 — 최신 소식",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-guide.jpg"],
  },
};

export default function UpdatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
