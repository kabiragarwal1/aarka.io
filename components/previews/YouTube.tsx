import { truncate } from "@/lib/utils";

export function YouTubePreview({
  image,
  caption,
  handle = "Your Brand",
  isAd = false,
}: {
  image: string;
  caption: string;
  handle?: string;
  isAd?: boolean;
}) {
  const title = truncate(caption.split(".")[0] || "Introducing the new drop", 72);
  return (
    <div className="w-full max-w-[340px] rounded-2xl overflow-hidden bg-white text-black shadow-xl">
      <div className="relative aspect-video bg-neutral-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt="" className="h-full w-full object-cover" />
        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-white text-[10px] font-semibold">
          0:32
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30">
          <div className="h-full w-1/3 bg-[#FF0000]" />
        </div>
        {isAd && (
          <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-yellow-300 text-black text-[10px] font-bold">
            Ad · Skip in 5s
          </div>
        )}
      </div>
      <div className="p-3 flex gap-2.5">
        <div className="h-9 w-9 rounded-full bg-neutral-200 shrink-0" />
        <div className="min-w-0">
          <div className="text-[14px] font-semibold leading-tight line-clamp-2">
            {title}
          </div>
          <div className="text-[12px] text-neutral-600 mt-1 flex items-center gap-1">
            {handle} <span className="text-blue-500">✓</span>
          </div>
          <div className="text-[11px] text-neutral-500">
            {isAd ? "Sponsored" : "128K views · 2 hrs ago"}
          </div>
        </div>
      </div>
    </div>
  );
}
