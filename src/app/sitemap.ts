import type { MetadataRoute } from "next";
import regionsData from "@/data/regions.json";
import { UPDATES } from "@/data/updates";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://support.fazr.co.kr";

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/eligibility`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/calculator`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/regions`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/updates`, lastModified: new Date(), changeFrequency: "daily", priority: 0.7 },
  ];

  const regionPages: MetadataRoute.Sitemap = regionsData.regions.map((region) => ({
    url: `${baseUrl}/regions/${region.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const updatePages: MetadataRoute.Sitemap = UPDATES.map((post) => ({
    url: `${baseUrl}/updates/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...regionPages, ...updatePages];
}
