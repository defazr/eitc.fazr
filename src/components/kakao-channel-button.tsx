"use client";

import { MessageCircle } from "lucide-react";

export function KakaoChannelButton() {
  const handleClick = () => {
    if (typeof window === "undefined") return;

    const channelId = process.env.NEXT_PUBLIC_KAKAO_CHANNEL_ID;

    if (!channelId) {
      alert("잠시 후 다시 시도해주세요");
      return;
    }

    // 추적 이벤트
    const gtag = (window as any).gtag;
    if (gtag) {
      // GA4 이벤트
      gtag("event", "kakao_channel_click", {
        event_category: "engagement",
        event_label: "calculator_result",
      });

      // Google Ads 전환 이벤트
      const conversionId = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID;
      if (conversionId) {
        gtag("event", "conversion", {
          send_to: conversionId,
        });
      }
    }

    // 친구 추가 페이지로 이동 (모바일 카카오톡 앱 자동 호출)
    window.location.href = `https://pf.kakao.com/${channelId}/friend`;
  };

  return (
    <div className="mt-6 p-4 rounded-lg bg-muted/50 border">
      <p className="text-sm text-muted-foreground mb-3 text-center">
        지금 계산한 금액, 신청 시기까지 챙겨드립니다
      </p>
      <button
        onClick={handleClick}
        className="w-full bg-[#FEE500] hover:bg-[#FADA00] text-black font-medium py-3 rounded-md transition-colors flex items-center justify-center gap-2"
      >
        <MessageCircle className="w-5 h-5" />
        5월 신청 시작 놓치지 않기 · 카카오 알림 받기
      </button>
    </div>
  );
}
