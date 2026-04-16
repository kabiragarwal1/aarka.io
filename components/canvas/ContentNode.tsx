"use client";

import { Copy, DollarSign, Globe2, Sparkles, Zap } from "lucide-react";
import { PLATFORM_MAP } from "@/lib/platforms";
import type { ContentObject } from "@/lib/types";
import { cn, formatNumber, truncate } from "@/lib/utils";

export function ContentNode({
  content,
  selected,
  insightsMode,
  onPointerDown,
  onSelect,
  onDuplicate,
}: {
  content: ContentObject;
  selected: boolean;
  insightsMode: boolean;
  onPointerDown: (e: React.PointerEvent) => void;
  onSelect: () => void;
  onDuplicate: () => void;
}) {
  const hasAd = content.placements.some((p) => p.isAd);
  const organic = content.placements.filter((p) => !p.isAd);
  const totalImpressions = content.placements.reduce(
    (s, p) => s + (p.metrics?.impressions ?? 0),
    0,
  );
  const totalClicks = content.placements.reduce(
    (s, p) => s + (p.metrics?.clicks ?? 0),
    0,
  );
  const totalSpend = content.placements.reduce((s, p) => s + (p.metrics?.spend ?? 0), 0);

  return (
    <div
      onPointerDown={onPointerDown}
      onClick={onSelect}
      className={cn(
        "group absolute w-[280px] rounded-2xl overflow-hidden transition-shadow cursor-grab active:cursor-grabbing select-none",
        selected
          ? "ring-2 ring-brand-400 shadow-glow"
          : "ring-1 ring-white/10 hover:ring-white/25",
      )}
      style={{
        left: content.x,
        top: content.y,
        background: "rgba(15,15,26,0.85)",
        backdropFilter: "blur(8px)",
      }}
    >
      {/* header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-white/5">
        <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
        <div className="text-[11px] font-semibold truncate flex-1">{content.title}</div>
        <div className="flex items-center gap-1">
          {hasAd && (
            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-gradient-to-br from-brand-500 to-accent-cyan text-ink-950">
              AD
            </span>
          )}
          {organic.length > 0 && !hasAd && (
            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-white/10 text-white">
              ORGANIC
            </span>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
            }}
            className="h-6 w-6 grid place-items-center rounded hover:bg-white/10 text-ink-200 hover:text-white"
            title="Duplicate / variation"
          >
            <Copy className="h-3 w-3" />
          </button>
        </div>
      </div>
      {/* image */}
      <div className="relative aspect-[4/5] bg-black/50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={content.image} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        {/* caption overlay */}
        <div className="absolute left-3 right-3 bottom-3 text-white">
          <div className="text-[12.5px] leading-snug drop-shadow">
            {truncate(content.caption, 90)}
          </div>
        </div>
        {/* version count */}
        <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur text-[10px] font-semibold text-white">
          {content.versions.length} variation{content.versions.length > 1 ? "s" : ""}
        </div>
      </div>
      {/* footer: placements */}
      <div className="p-2.5 space-y-2">
        <div className="flex items-center gap-1 flex-wrap">
          {content.placements.length === 0 && (
            <div className="text-[11px] text-ink-300 italic px-1">
              Drag to a platform to publish →
            </div>
          )}
          {content.placements.map((p) => {
            const meta = PLATFORM_MAP[p.platform];
            const state = p.state;
            return (
              <span
                key={p.platform}
                className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-white/5 border border-white/10"
                title={`${meta.label} — ${state}${p.isAd ? " · Ad" : ""}`}
              >
                <span
                  className="h-4 w-4 rounded grid place-items-center text-[8px] font-bold text-white"
                  style={{ backgroundImage: meta.gradient }}
                >
                  {meta.icon[0]}
                </span>
                <span className="text-ink-100">{meta.label}</span>
                <span
                  className={cn(
                    "ml-0.5 h-1.5 w-1.5 rounded-full",
                    state === "live" && "bg-emerald-400",
                    state === "scheduled" && "bg-yellow-400",
                    state === "draft" && "bg-ink-300",
                  )}
                />
                {p.isAd && <DollarSign className="h-2.5 w-2.5 text-brand-300" />}
              </span>
            );
          })}
        </div>
        {insightsMode && content.placements.length > 0 && (
          <div className="grid grid-cols-3 gap-1 pt-2 border-t border-white/5">
            <Stat icon={<Globe2 className="h-3 w-3" />} label="Imp." value={formatNumber(totalImpressions)} />
            <Stat icon={<Zap className="h-3 w-3" />} label="Clicks" value={formatNumber(totalClicks)} />
            <Stat
              icon={<DollarSign className="h-3 w-3" />}
              label="Spend"
              value={totalSpend ? "$" + formatNumber(totalSpend) : "$0"}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col items-start gap-0.5 px-1.5 py-1 rounded-md bg-white/[0.02]">
      <div className="flex items-center gap-1 text-[9px] uppercase tracking-widest text-ink-300">
        {icon}
        {label}
      </div>
      <div className="text-[12px] font-semibold text-white">{value}</div>
    </div>
  );
}
