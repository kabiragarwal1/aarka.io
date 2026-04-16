import { Heart, MessageCircle, Music2, Share2 } from "lucide-react";
import { truncate } from "@/lib/utils";

export function TikTokPreview({
  image,
  caption,
  handle = "yourbrand",
  isAd = false,
}: {
  image: string;
  caption: string;
  handle?: string;
  isAd?: boolean;
}) {
  return (
    <div className="relative w-full max-w-[280px] aspect-[9/16] rounded-2xl overflow-hidden bg-black text-white shadow-xl">
      {/* bg video mock */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-95" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70" />
      {/* top */}
      <div className="absolute top-3 inset-x-0 flex items-center justify-center gap-5 text-[13px] font-semibold">
        <span className="opacity-60">Following</span>
        <span>
          For You
          <div className="h-[3px] w-4 bg-white rounded-full mx-auto mt-0.5" />
        </span>
      </div>
      {/* right rail */}
      <div className="absolute right-2 bottom-20 flex flex-col items-center gap-4">
        <div className="h-10 w-10 rounded-full border-2 border-white bg-neutral-700 grid place-items-center text-xs font-bold">
          {handle.slice(0, 2).toUpperCase()}
        </div>
        <Icon label="1.2M"><Heart className="h-6 w-6 fill-white/0" /></Icon>
        <Icon label="4.3K"><MessageCircle className="h-6 w-6" /></Icon>
        <Icon label="Share"><Share2 className="h-6 w-6" /></Icon>
      </div>
      {/* bottom caption */}
      <div className="absolute left-3 right-16 bottom-4 space-y-2">
        <div className="text-[13px] font-semibold">@{handle}</div>
        <div className="text-[12.5px] leading-snug">{truncate(caption, 120)}</div>
        <div className="flex items-center gap-1.5 text-[11px] opacity-90">
          <Music2 className="h-3 w-3" />
          <span>original sound — {handle}</span>
        </div>
        {isAd && (
          <button className="mt-1 px-3 py-1.5 rounded-md bg-[#FE2C55] text-[12px] font-semibold">
            Learn more
          </button>
        )}
      </div>
    </div>
  );
}

function Icon({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      {children}
      <div className="text-[10px] font-semibold">{label}</div>
    </div>
  );
}
