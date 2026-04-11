"use client";

import { useEffect } from "react";

export function VignetteCleanup() {
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const body = document.body;

      const hasAriaHidden = body.getAttribute("aria-hidden") === "true";
      const hasOverflowHidden = body.style.overflow === "hidden";

      if (!hasAriaHidden && !hasOverflowHidden) return;

      const vignetteEl = document.querySelector(
        '[id^="google_vignette"], [id*="vignette"], ins.adsbygoogle[data-ad-status="filled"][data-vignette]'
      );

      const menuOpen = body.getAttribute("data-menu-open") === "true";

      if (!vignetteEl && !menuOpen) {
        if (hasAriaHidden) {
          body.removeAttribute("aria-hidden");
        }
        if (hasOverflowHidden) {
          body.style.overflow = "";
        }
      }
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["aria-hidden", "style"],
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
