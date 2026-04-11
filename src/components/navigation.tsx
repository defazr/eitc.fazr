"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

const NAV_ITEMS = [
  { href: "/", label: "홈" },
  { href: "/eligibility", label: "대상 확인" },
  { href: "/calculator", label: "계산기" },
  { href: "/regions", label: "지역별 안내" },
  { href: "/faq", label: "자주 묻는 질문" },
  { href: "/updates", label: "업데이트" },
];

export function Navigation() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    document.body.setAttribute("data-menu-open", "true");
    return () => {
      document.body.style.overflow = "auto";
      document.body.removeAttribute("data-menu-open");
    };
  }, [open]);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b border-border">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg text-primary cursor-pointer">
          고유가 피해지원금
        </Link>

        {/* Desktop */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-md cursor-pointer ${
                isActive(item.href)
                  ? "text-[#0369A1] bg-[#0369A1]/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="md:hidden">
            <Button variant="ghost" size="icon" render={<span />}>
              <Menu className="h-5 w-5" />
              <span className="sr-only">메뉴 열기</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 bg-white border-l border-gray-200 shadow-xl">
            <SheetTitle className="sr-only">메뉴</SheetTitle>
            <div className="border-b border-gray-200 mb-0" />
            <nav className="flex flex-col gap-1 pt-4">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`px-4 py-3 text-base font-medium rounded-lg transition-colors duration-200 cursor-pointer ${
                    isActive(item.href)
                      ? "text-[#0369A1] bg-[#0369A1]/10"
                      : "text-foreground hover:bg-gray-50"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
