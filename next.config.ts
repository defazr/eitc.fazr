import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/updates/oil-subsidy-budget-passed",
        destination: "/updates/2026-application-period",
        permanent: true,
      },
      {
        source: "/updates/when-will-oil-subsidy-be-paid",
        destination: "/updates/2026-payment-date",
        permanent: true,
      },
      {
        source: "/updates/how-to-apply-oil-subsidy-2026",
        destination: "/updates/2026-application-period",
        permanent: true,
      },
      {
        source: "/regions/:path*",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
