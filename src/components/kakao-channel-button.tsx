"use client";

function KakaoIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 256 256"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M128 36C70.562 36 24 72.713 24 118c0 29.279 19.466 54.97 48.748 69.477-1.593 5.494-10.237 35.344-10.581 37.689 0 0-.207 1.762.934 2.434s2.483.15 2.483.15c3.272-.457 37.943-24.811 43.944-29.04 5.995.849 12.168 1.29 18.472 1.29 57.438 0 104-36.712 104-82 0-45.287-46.562-82-104-82z" />
    </svg>
  );
}

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
        <KakaoIcon />
        5월 신청 알림 받기
      </button>
    </div>
  );
}
