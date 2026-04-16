import Image from "next/image";
import { Bookmark, Heart, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { truncate } from "@/lib/utils";

export function InstagramPreview({
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
    <div className="w-full max-w-[340px] rounded-2xl overflow-hidden bg-white text-black font-sans shadow-xl">
      {/* header */}
      <div className="flex items-center gap-2.5 px-3 py-2.5">
        <div className="h-8 w-8 rounded-full p-[2px]" style={{ background: "conic-gradient(from 210deg,#feda75,#fa7e1e,#d62976,#962fbf,#4f5bd5,#feda75)" }}>
          <div className="h-full w-full rounded-full bg-white grid place-items-center">
            <div className="h-6 w-6 rounded-full bg-neutral-200" />
          </div>
        </div>
        <div className="flex-1 leading-tight">
          <div className="text-[13px] font-semibold flex items-center gap-1">
            {handle}
            <span className="text-blue-500">✓</span>
          </div>
          {isAd && (
            <div className="text-[11px] text-neutral-500">Sponsored</div>
          )}
        </div>
        <MoreHorizontal className="h-4 w-4 text-neutral-700" />
      </div>
      {/* image */}
      <div className="relative aspect-square bg-neutral-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt="" className="h-full w-full object-cover" />
      </div>
      {/* actions */}
      <div className="flex items-center gap-3 px-3 pt-2.5 pb-1">
        <Heart className="h-[22px] w-[22px]" />
        <MessageCircle className="h-[22px] w-[22px]" />
        <Send className="h-[22px] w-[22px]" />
        <Bookmark className="h-[22px] w-[22px] ml-auto" />
      </div>
      <div className="px-3 pb-3 text-[12.5px] leading-snug">
        <div className="font-semibold">{formatLikes(isAd)} likes</div>
        <div>
          <span className="font-semibold">{handle}</span>{" "}
          <span className="text-neutral-800">{truncate(caption, 140)}</span>
        </div>
        {isAd && (
          <button className="mt-2 w-full py-2 rounded-md bg-blue-500 text-white text-[13px] font-semibold">
            Shop Now
          </button>
        )}
      </div>
    </div>
  );
}

function formatLikes(isAd: boolean) {
  return isAd ? "12,493" : "2,184";
}
