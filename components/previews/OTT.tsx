import { truncate } from "@/lib/utils";

export function OTTPreview({
  image,
  caption,
  handle = "Your Brand",
  isAd = true,
}: {
  image: string;
  caption: string;
  handle?: string;
  isAd?: boolean;
}) {
  const title = truncate(caption.split(".")[0] || "Feel the difference", 64);
  return (
    <div className="w-full max-w-[380px] rounded-2xl overflow-hidden bg-black text-white shadow-xl">
      {/* TV chrome */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-gradient-to-b from-neutral-950 to-neutral-900 border-b border-white/10 text-[10px] uppercase tracking-widest text-ink-200">
        <span>OTT · Connected TV</span>
        <span>AD</span>
      </div>
      <div className="relative aspect-video">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-white/90 text-black text-[10px] font-bold">
          SPONSORED
        </div>
        <div className="absolute bottom-4 left-5 right-5">
          <div className="text-[10px] uppercase tracking-[0.2em] text-accent-cyan mb-1">
            {handle}
          </div>
          <div className="text-[22px] font-display font-semibold leading-tight drop-shadow">
            {title}
          </div>
          <div className="mt-2 flex items-center gap-3">
            <button className="px-3 py-1.5 rounded bg-white text-black text-[12px] font-semibold">
              Visit on your phone
            </button>
            <div className="text-[10px] opacity-70">QR · Scan with remote</div>
          </div>
        </div>
      </div>
      <div className="px-4 py-2 text-[11px] text-ink-200 flex items-center justify-between">
        <span>Hulu · Roku · Samsung Ads</span>
        <span>15s · non-skippable</span>
      </div>
    </div>
  );
}
