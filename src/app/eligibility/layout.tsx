import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "근로장려금 대상자 확인 — 5문항으로 30초 만에 자격 체크",
  description:
    "2026 근로·자녀장려금 대상자 확인을 5개 문항으로 30초 안에 끝내세요. 소득·재산·가구 요건 자동 판정, 단독·홑벌이·맞벌이별 자격 기준 안내. 모바일에서 바로 확인 가능합니다.",
  alternates: { canonical: "/eligibility" },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "근로·자녀장려금",
    url: "https://eitc.fazr.co.kr/eligibility",
    images: [
      {
        url: "/og-guide.jpg",
        width: 1200,
        height: 630,
        alt: "근로장려금 대상자 확인 — 5문항 자격 체크",
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
