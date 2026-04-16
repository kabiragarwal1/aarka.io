import { truncate } from "@/lib/utils";

export function MobileAppPreview({
  image,
  caption,
  handle = "yourbrand",
}: {
  image: string;
  caption: string;
  handle?: string;
}) {
  const hook = truncate(caption.split(".")[0] || "Keep playing?", 40);
  return (
    <div className="relative w-[260px] h-[520px] rounded-[36px] overflow-hidden bg-black border-[10px] border-neutral-900 shadow-2xl">
      {/* status bar */}
      <div className="absolute top-1 inset-x-0 flex items-center justify-between px-6 text-[10px] font-semibold text-white z-10">
        <span>9:41</span>
        <span>●●●● 5G</span>
      </div>
      {/* app background */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-900 via-indigo-900 to-black">
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
            backgroundSize: "18px 18px",
          }}
        />
      </div>
      {/* host app UI */}
      <div className="absolute top-8 inset-x-3 flex items-center justify-between text-white text-[11px]">
        <div>Level 12 · Forest</div>
        <div>★ 4,281</div>
      </div>
      {/* interstitial */}
      <div className="absolute top-16 bottom-16 left-3 right-3 rounded-2xl overflow-hidden bg-white text-black shadow-2xl">
        <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-black/10 text-[10px]">
          <span className="text-neutral-500">Ad · interstitial</span>
          <span className="h-5 w-5 rounded-full bg-neutral-200 grid place-items-center">×</span>
        </div>
        <div className="relative aspect-[4/5]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="p-2.5">
          <div className="text-[12px] font-semibold leading-tight">{hook}</div>
          <div className="text-[10px] text-neutral-500 mt-0.5">{handle} · sponsored</div>
          <button className="mt-2 w-full py-1.5 rounded-md bg-emerald-500 text-white text-[11px] font-semibold">
            Install now
          </button>
        </div>
      </div>
      {/* bottom nav */}
      <div className="absolute bottom-3 inset-x-6 h-10 rounded-2xl bg-white/10 backdrop-blur-md grid grid-cols-4 place-items-center text-white/80 text-[11px]">
        <span>Home</span>
        <span>Play</span>
        <span>Shop</span>
        <span>You</span>
      </div>
    </div>
  );
}
