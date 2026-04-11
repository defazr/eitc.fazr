"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle: Record<string, unknown>[];
  }
}

interface AdSlotProps {
  slot: string;
  format?: "auto" | "rectangle" | "horizontal" | "autorelaxed";
  className?: string;
  minHeight?: string;
}

const pubId = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID;

export function AdSlot({
  slot,
  format = "auto",
  className = "",
  minHeight = "90px",
}: AdSlotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (!pubId || pushed.current) return;

    const timer = setTimeout(() => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushed.current = true;
      } catch {
        // adsense not ready
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (!pubId) {
    return <div className={`w-full flex items-center justify-center ${className}`} style={{ minHeight }} />;
  }

  const isMultiplex = format === "autorelaxed";

  return (
    <div ref={containerRef} className={`flex justify-center overflow-hidden ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%", minHeight }}
        data-ad-client={`ca-${pubId}`}
        data-ad-slot={slot}
        data-ad-format={format}
        {...(!isMultiplex && { "data-full-width-responsive": "true" })}
      />
    </div>
  );
}
