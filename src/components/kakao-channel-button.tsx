"use client";

export function KakaoChannelButton() {
  const handleClick = () => {
    if (typeof window === "undefined") return;

    const Kakao = (window as any).Kakao;
    const channelId = process.env.NEXT_PUBLIC_KAKAO_CHANNEL_ID;
    const jsKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;

    // 1차 가드: SDK 또는 환경변수 누락
    if (!Kakao || !channelId || !jsKey) {
      alert("잠시 후 다시 시도해주세요");
      return;
    }

    // Fallback init (KakaoInit이 실패했을 경우 대비)
    if (!Kakao.isInitialized()) {
      Kakao.init(jsKey);
    }

    // 2차 가드: Channel 객체 없음
    if (!Kakao.Channel) {
      alert("카카오 연결에 실패했습니다");
      return;
    }

    // GA4 이벤트 발화
    if ((window as any).gtag) {
      (window as any).gtag("event", "kakao_channel_click", {
        event_category: "engagement",
        event_label: "calculator_result",
      });
    }

    // 채널 추가 호출
    Kakao.Channel.addChannel({ channelPublicId: channelId });
  };

  return (
    <div className="mt-6 p-4 rounded-lg bg-muted/50 border">
      <p className="text-sm text-muted-foreground mb-3 text-center">
        지금 계산한 금액, 신청 시기까지 챙겨드립니다
      </p>
      <button
        onClick={handleClick}
        className="w-full bg-[#FEE500] hover:bg-[#FADA00] text-black font-medium py-3 rounded-md transition-colors"
      >
        5월 신청 시작 놓치지 않기 · 카카오 알림 받기
      </button>
    </div>
  );
}
