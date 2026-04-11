"use client";

import { useState, useEffect } from "react";
import { Link2, Share2 } from "lucide-react";

interface ShareButtonsProps {
  title: string;
  className?: string;
}

export function ShareButtons({ title, className = "" }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setUrl(window.location.href);
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  if (!url) return null;

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  function openShare(shareUrl: string) {
    window.open(shareUrl, "_blank", "noopener,noreferrer,width=600,height=400");
  }

  async function handleNativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: title, url });
      } catch {
        handleCopy();
      }
    } else {
      handleCopy();
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  if (isMobile) {
    return (
      <div className={`mt-6 ${className}`}>
        <p className="text-sm text-muted-foreground mb-3 text-center">
          이 정보가 도움이 됐다면 공유해주세요
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleNativeShare}
            className="flex items-center justify-center gap-2 h-11 rounded-2xl shadow-sm text-sm font-semibold bg-[#0369A1] text-white active:opacity-90 transition-opacity cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            공유하기
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 h-11 rounded-2xl shadow-sm text-sm font-semibold bg-gray-100 text-gray-700 active:bg-gray-200 transition-colors cursor-pointer"
          >
            <Link2 className="w-4 h-4" />
            {copied ? "복사됨!" : "링크 복사"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`mt-6 ${className}`}>
      <p className="text-sm text-muted-foreground mb-3 text-center">
        이 정보가 도움이 됐다면 공유해주세요
      </p>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() =>
            openShare(
              `https://share.naver.com/web/shareView?url=${encodedUrl}&title=${encodedTitle}`
            )
          }
          className="flex items-center justify-center gap-2 h-11 rounded-2xl shadow-sm text-sm font-semibold bg-[#03C75A] text-white hover:opacity-90 transition-opacity cursor-pointer"
        >
          네이버
        </button>
        <button
          onClick={() =>
            openShare(
              `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`
            )
          }
          className="flex items-center justify-center gap-2 h-11 rounded-2xl shadow-sm text-sm font-semibold bg-black text-white hover:opacity-90 transition-opacity cursor-pointer"
        >
          X (트위터)
        </button>
        <button
          onClick={() =>
            openShare(
              `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
            )
          }
          className="flex items-center justify-center gap-2 h-11 rounded-2xl shadow-sm text-sm font-semibold bg-[#1877F2] text-white hover:opacity-90 transition-opacity cursor-pointer"
        >
          페이스북
        </button>
        <button
          onClick={handleCopy}
          className="flex items-center justify-center gap-2 h-11 rounded-2xl shadow-sm text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
        >
          <Link2 className="w-4 h-4" />
          {copied ? "복사됨!" : "링크 복사"}
        </button>
      </div>
    </div>
  );
}
