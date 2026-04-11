"use client";

import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GOV_LINKS } from "@/data/gov-links";

interface GovLinkButtonProps {
  type: keyof typeof GOV_LINKS;
  variant?: "default" | "outline";
  className?: string;
}

export function GovLinkButton({
  type,
  variant = "default",
  className,
}: GovLinkButtonProps) {
  const link = GOV_LINKS[type];

  if (!link.active) {
    return (
      <div className={className}>
        <Button variant={variant} disabled className="w-full gap-2">
          <ExternalLink className="h-4 w-4" />
          {link.label}
        </Button>
        <p className="text-xs text-muted-foreground mt-1 text-center">
          {link.note}
        </p>
      </div>
    );
  }

  return (
    <Button
      variant={variant}
      render={<a href={link.url} target="_blank" rel="noopener noreferrer" />}
      className={`gap-2 ${className}`}
    >
      <ExternalLink className="h-4 w-4" />
      {link.label}
    </Button>
  );
}
