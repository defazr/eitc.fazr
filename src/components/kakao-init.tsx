"use client";

import { useEffect } from "react";

export function KakaoInit() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const Kakao = (window as any).Kakao;
    if (!Kakao) return;

    if (!Kakao.isInitialized()) {
      const jsKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
      if (jsKey) Kakao.init(jsKey);
    }
  }, []);

  return null;
}
