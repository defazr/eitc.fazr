import { Info } from "lucide-react";

export function DisclaimerBanner() {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 items-start">
      <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
      <p className="text-sm text-amber-800">
        본 사이트의 계산 결과는 조세특례제한법 시행령 별표 11·11의2(2025.2.28
        개정)에 근거한 예상 금액이며, 실제 지급액은 국세청의 최종 심사 결과에
        따라 달라질 수 있습니다. 정확한 신청과 자격 확인은
        홈택스(hometax.go.kr) 또는 장려금 상담센터(1566-3636)를 이용하세요.
      </p>
    </div>
  );
}
