import { truncate } from "@/lib/utils";

export function DisplayPreview({
  image,
  caption,
  handle = "yourbrand.com",
}: {
  image: string;
  caption: string;
  handle?: string;
}) {
  const hook = truncate(caption.split(".")[0] || "Discover the new capsule", 40);
  return (
    <div className="space-y-3">
      {/* 300x250 */}
      <div className="relative w-[300px] h-[250px] rounded-md overflow-hidden bg-white text-black shadow-lg border border-black/10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute left-3 top-3 px-1.5 py-0.5 rounded bg-white/90 text-[9px] font-bold tracking-wider">
          AD · 300×250
        </div>
        <div className="absolute left-3 right-3 bottom-3 text-white">
          <div className="text-[16px] font-display font-semibold leading-tight drop-shadow">
            {hook}
          </div>
          <div className="mt-2 flex items-center justify-between">
            <div className="text-[10px] opacity-80">{handle}</div>
            <button className="px-2 py-1 rounded bg-white text-black text-[11px] font-semibold">
              Shop
            </button>
          </div>
        </div>
      </div>
      {/* 728x90 */}
      <div className="relative w-[340px] h-[50px] rounded-md overflow-hidden bg-white text-black shadow border border-black/10 flex items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt="" className="absolute inset-y-0 left-0 h-full w-[120px] object-cover" />
        <div className="ml-[128px] flex-1 pr-3 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="text-[11px] font-semibold leading-tight truncate">{hook}</div>
            <div className="text-[9px] text-neutral-500">{handle} · Ad</div>
          </div>
          <button className="shrink-0 px-2 py-1 rounded bg-black text-white text-[10px] font-semibold">
            Visit
          </button>
        </div>
      </div>
    </div>
  );
}
