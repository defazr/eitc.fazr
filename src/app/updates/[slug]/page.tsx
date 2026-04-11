import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Clock, ArrowRight, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DisclaimerBanner } from "@/components/disclaimer-banner";
import { AdSlot } from "@/components/ad-slot";
import { ShareButtons } from "@/components/share-buttons";
import { UPDATES } from "@/data/updates";

export function generateStaticParams() {
  return UPDATES.map((post) => ({ slug: post.slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = UPDATES.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/updates/${slug}` },
    openGraph: {
      type: "article",
      publishedTime: post.date,
      authors: ["근로·자녀장려금"],
      images: [
        {
          url: "/og-guide.jpg",
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: ["/og-guide.jpg"],
    },
  };
}

export default async function UpdateDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = UPDATES.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link
        href="/updates"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        전체 업데이트
      </Link>

      <article>
        <Badge variant="secondary" className="mb-3">
          <Clock className="h-3 w-3 mr-1" />
          {post.date}
        </Badge>
        <h1 className="text-2xl md:text-3xl font-bold mb-4">{post.title}</h1>
        <p className="text-muted-foreground mb-6">{post.description}</p>

        <ShareButtons title={post.title} />

        {/* Ad Slot 3 */}
        <div className="my-6">
          <AdSlot slot="6086273688" format="rectangle" />
        </div>

        <div className="prose prose-sm max-w-prose leading-relaxed prose-headings:text-foreground prose-h2:mt-10 prose-h2:mb-4 prose-h3:mt-8 prose-h3:mb-3 prose-p:text-muted-foreground prose-p:mb-4 prose-li:text-muted-foreground prose-a:text-primary prose-strong:text-foreground prose-ul:my-4 prose-ul:space-y-2 prose-ol:my-4 prose-ol:space-y-2 prose-hr:my-8">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ href, children, ...props }) => {
                const isExternal = href?.startsWith("http");
                return (
                  <a
                    href={href}
                    {...(isExternal && {
                      target: "_blank",
                      rel: "noopener noreferrer",
                    })}
                    {...props}
                  >
                    {children}
                  </a>
                );
              },
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </article>

      <ShareButtons title={post.title} />

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 mt-10 mb-8">
        <Button render={<Link href="/calculator" />} className="gap-2">
            <Calculator className="h-4 w-4" />내 예상 지원금 계산하기
        </Button>
        <Button variant="outline" render={<Link href="/eligibility" />} className="gap-2">
            대상 기준 확인하기
            <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      <DisclaimerBanner />
    </div>
  );
}
