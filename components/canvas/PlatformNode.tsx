"use client";

import { PLATFORM_MAP } from "@/lib/platforms";
import type { PlatformKey } from "@/lib/types";
import { cn, formatNumber } from "@/lib/utils";
import { Zap } from "lucide-react";

export function PlatformNode({
  platform,
  x,
  y,
  publishedCount,
  totalImpressions,
  highlight,
  onPointerDown,
  onDragEnter,
  onDragLeave,
  onDrop,
}: {
  platform: PlatformKey;
  x: number;
  y: number;
  publishedCount: number;
  totalImpressions: number;
  highlight: boolean;
  onPointerDown: (e: React.PointerEvent) => void;
  onDragEnter?: () => void;
  onDragLeave?: () => void;
  onDrop?: () => void;
}) {
  const meta = PLATFORM_MAP[platform];
  return (
    <div
      data-platform={platform}
      onPointerDown={onPointerDown}
      onPointerEnter={onDragEnter}
      onPointerLeave={onDragLeave}
      onPointerUp={onDrop}
      className={cn(
        "absolute flex items-center gap-3 px-3.5 py-3 rounded-2xl border transition-all select-none cursor-grab active:cursor-grabbing min-w-[200px]",
        highlight
          ? "border-brand-400 bg-brand-500/20 shadow-glow scale-[1.03]"
          : "border-white/10 bg-ink-800/80 hover:border-white/20 hover:bg-ink-700/70",
      )}
      style={{
        left: x,
        top: y,
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        className="h-10 w-10 rounded-xl grid place-items-center text-white font-bold text-[13px] shrink-0"
        style={{ backgroundImage: meta.gradient }}
      >
        {meta.icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-semibold leading-tight">{meta.label}</div>
        <div className="text-[10px] text-ink-300 truncate">{meta.description}</div>
      </div>
      <div className="flex flex-col items-end gap-0.5 shrink-0">
        <div className="text-[11px] font-semibold text-white flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          {publishedCount}
        </div>
        {totalImpressions > 0 && (
          <div className="text-[10px] text-ink-300 flex items-center gap-0.5">
            <Zap className="h-2.5 w-2.5" />
            {formatNumber(totalImpressions)}
          </div>
        )}
      </div>
    </div>
  );
}
