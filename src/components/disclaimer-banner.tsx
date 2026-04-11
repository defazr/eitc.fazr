import { Info } from "lucide-react";

export function DisclaimerBanner() {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 items-start">
      <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
      <p className="text-sm text-amber-800">
        본 사이트는 정부 공식 사이트가 아니며, 안내 정보는 정책 확정 전 예상
        기준으로 변경될 수 있습니다.
      </p>
    </div>
  );
}
