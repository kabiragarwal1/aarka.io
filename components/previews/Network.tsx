import { truncate } from "@/lib/utils";

export function NetworkPreview({
  image,
  caption,
  handle = "yourbrand",
}: {
  image: string;
  caption: string;
  handle?: string;
}) {
  const hook = truncate(caption.split(".")[0] || "Trending with creators", 56);
  return (
    <div className="w-full max-w-[340px] rounded-xl overflow-hidden bg-ink-900 border border-white/10 text-ink-100 shadow-xl">
      <div className="px-3 py-2 flex items-center justify-between text-[10px] uppercase tracking-widest text-ink-300 border-b border-white/10">
        <span>Programmatic · Open RTB</span>
        <span>DV360 · TTD · Xandr</span>
      </div>
      <div className="p-3 grid grid-cols-2 gap-2">
        <div className="relative aspect-square rounded-md overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="" className="h-full w-full object-cover" />
          <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-bold">Native</div>
        </div>
        <div className="relative aspect-square rounded-md overflow-hidden bg-black">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="" className="h-full w-full object-cover opacity-70" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="px-2 py-1 rounded-full border border-white/60 text-[10px] font-semibold backdrop-blur-sm">
              ▶ 6s pre-roll
            </div>
          </div>
        </div>
        <div className="col-span-2 p-2 rounded-md bg-white/[0.03] border border-white/5">
          <div className="text-[10px] uppercase tracking-widest text-brand-300">Sponsored</div>
          <div className="text-[13px] font-semibold leading-snug mt-0.5">{hook}</div>
          <div className="text-[11px] text-ink-200 mt-0.5">{handle}.com · Learn more</div>
        </div>
      </div>
      <div className="px-3 py-2 text-[10px] text-ink-300 border-t border-white/5 flex items-center justify-between">
        <span>Bid: $4.20 eCPM</span>
        <span>Audience match 87%</span>
      </div>
    </div>
  );
}
