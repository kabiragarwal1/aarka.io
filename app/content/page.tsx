"use client";

import Link from "next/link";
import { DollarSign, Globe2, Layers } from "lucide-react";
import { useMediaOS } from "@/lib/store";
import { PLATFORM_MAP } from "@/lib/platforms";
import { cn, formatNumber, truncate } from "@/lib/utils";

export default function ContentPage() {
  const content = useMediaOS((s) => s.content);
  const selectContent = useMediaOS((s) => s.selectContent);

  return (
    <div className="h-full w-full overflow-y-auto bg-mesh-grad">
      <div className="max-w-[1300px] mx-auto px-8 py-8 space-y-6">
        <div>
          <div className="text-[11px] uppercase tracking-widest text-ink-300">Content library</div>
          <h1 className="font-display text-[32px] font-semibold tracking-tight">
            Every content object
          </h1>
          <p className="text-ink-200 text-[14px] mt-1 max-w-xl">
            One object — many lives. Reused across organic and paid surfaces. Metrics attach to the
            object, not the platform.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {content.map((c) => {
            const hasAd = c.placements.some((p) => p.isAd);
            const totalImp = c.placements.reduce(
              (s, p) => s + (p.metrics?.impressions ?? 0),
              0,
            );
            return (
              <Link
                key={c.id}
                href={`/canvas?c=${c.id}`}
                onClick={() => selectContent(c.id)}
                className="group rounded-2xl border border-white/10 bg-ink-800/50 hover:bg-ink-700/50 transition overflow-hidden"
              >
                <div className="relative aspect-[4/5] bg-black/30">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.image}
                    alt=""
                    className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/0" />
                  <div className="absolute top-2 left-2 flex gap-1">
                    {hasAd && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-gradient-to-br from-brand-500 to-accent-cyan text-ink-950">
                        AD
                      </span>
                    )}
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-black/60 backdrop-blur text-white">
                      {c.versions.length}V
                    </span>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 text-white">
                    <div className="text-[12px] font-semibold line-clamp-2 drop-shadow">
                      {truncate(c.caption, 100)}
                    </div>
                  </div>
                </div>
                <div className="p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-[12px] font-semibold truncate">{c.title}</div>
                    <div className="flex items-center gap-1 text-[11px] text-ink-200">
                      <Globe2 className="h-3 w-3" />
                      {formatNumber(totalImp)}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-wrap">
                    {c.placements.slice(0, 6).map((p) => {
                      const meta = PLATFORM_MAP[p.platform];
                      return (
                        <span
                          key={p.platform}
                          className="h-5 w-5 rounded grid place-items-center text-[9px] font-bold text-white"
                          title={meta.label + (p.isAd ? " · Ad" : "")}
                          style={{ backgroundImage: meta.gradient }}
                        >
                          {meta.icon[0]}
                        </span>
                      );
                    })}
                    {c.placements.length === 0 && (
                      <span className="text-[10px] text-ink-300">Not yet published</span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
