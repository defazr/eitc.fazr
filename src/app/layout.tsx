import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { SkinnyBar } from "@/components/skinny-bar";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ScrollTopButton } from "@/components/scroll-top-button";
import { VignetteCleanup } from "@/components/vignette-cleanup";

const gaId = process.env.NEXT_PUBLIC_GA_ID;

export const metadata: Metadata = {
  title: {
    default: "고유가 피해지원금 - 대상 확인 및 예상 금액 계산",
    template: "%s | 고유가 피해지원금",
  },
  description:
    "2026 고유가 피해지원금(고유가지원금/민생지원금) 대상 확인, 신청 방법, 지급일 안내. 소득 하위 70% 1인당 10만~60만원 지급.",
  metadataBase: new URL("https://support.fazr.co.kr"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "고유가 피해지원금",
    images: [
      {
        url: "https://support.fazr.co.kr/og/og-main.jpg",
        width: 1200,
        height: 630,
        alt: "2026 고유가 피해지원금 - 대상 확인 & 예상 금액 계산",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "고유가 피해지원금 - 대상 확인 및 예상 금액 계산",
    description:
      "2026 고유가 피해지원금(고유가지원금/민생지원금) 대상 확인, 신청 방법, 지급일 안내. 소득 하위 70% 1인당 10만~60만원 지급.",
    images: ["https://support.fazr.co.kr/og/og-main.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  verification: {
    other: {
      "naver-site-verification": ["089d836d9cc01800e7c0542ffd7e3c3a8e7369b2"],
    },
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="antialiased">
      <head>
        {/* AdSense — only loads when pub ID is set */}
        {process.env.NEXT_PUBLIC_ADSENSE_PUB_ID && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-${process.env.NEXT_PUBLIC_ADSENSE_PUB_ID}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className="flex flex-col font-sans">
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}
        <VignetteCleanup />
        <SkinnyBar />
        <Navigation />
        <main className="flex-1 min-h-dvh">{children}</main>
        <Footer />
        <ScrollTopButton />
      </body>
    </html>
  );
}
