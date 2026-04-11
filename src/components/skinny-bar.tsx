"use client";

import Link from "next/link";
import { Megaphone } from "lucide-react";
import { SKINNY_BAR } from "@/data/banner";

export function SkinnyBar() {
  if (!SKINNY_BAR.active) return null;

  return (
    <div className="bg-primary text-primary-foreground text-sm py-2 overflow-hidden">
      <Link href={SKINNY_BAR.link} className="block cursor-pointer">
        <div className="animate-marquee whitespace-nowrap">
          <span className="mx-8 inline-flex items-center gap-1.5">
            <Megaphone className="w-3.5 h-3.5 shrink-0" />
            {SKINNY_BAR.text}
          </span>
          <span className="mx-8 inline-flex items-center gap-1.5">
            <Megaphone className="w-3.5 h-3.5 shrink-0" />
            {SKINNY_BAR.text}
          </span>
          <span className="mx-8 inline-flex items-center gap-1.5">
            <Megaphone className="w-3.5 h-3.5 shrink-0" />
            {SKINNY_BAR.text}
          </span>
        </div>
      </Link>
    </div>
  );
}
