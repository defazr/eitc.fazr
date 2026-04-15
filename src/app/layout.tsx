import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { SkinnyBar } from "@/components/skinny-bar";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ScrollTopButton } from "@/components/scroll-top-button";
import { ScrollToTopOnNavigation } from "@/components/scroll-to-top-on-navigation";
import { VignetteCleanup } from "@/components/vignette-cleanup";
import { KakaoInit } from "@/components/kakao-init";

const gaId = process.env.NEXT_PUBLIC_GA_ID;
const adsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;

export const metadata: Metadata = {
  title: {
    default: "근로·자녀장려금 - 예상 금액 계산 및 자격 확인",
    template: "%s | 근로·자녀장려금",
  },
  description:
    "2025년 귀속 근로·자녀장려금 대상 확인, 예상 금액 계산, 신청 방법 안내. 근로장려금 최대 330만원, 자녀장려금 1인당 최대 100만원.",
  metadataBase: new URL("https://eitc.fazr.co.kr"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "근로·자녀장려금",
    url: "https://eitc.fazr.co.kr",
    images: [
      {
        url: "/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "2026 근로·자녀장려금 신청 안내",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "근로·자녀장려금 - 예상 금액 계산 및 자격 확인",
    description:
      "2025년 귀속 근로·자녀장려금 대상 확인, 예상 금액 계산, 신청 방법 안내. 근로장려금 최대 330만원, 자녀장려금 1인당 최대 100만원.",
    images: ["/og-default.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  verification: {
    other: {
      "naver-site-verification": ["3f66179726070b4558cfb20859ce3518f8a49464"],
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
                ${adsId ? `gtag('config', '${adsId}');` : ""}
              `}
            </Script>
          </>
        )}
        <Script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
          strategy="afterInteractive"
        />
        <KakaoInit />
        <VignetteCleanup />
        <SkinnyBar />
        <Navigation />
        <main className="flex-1 min-h-dvh">{children}</main>
        <Footer />
        <ScrollTopButton />
        <ScrollToTopOnNavigation />
      </body>
    </html>
  );
}
