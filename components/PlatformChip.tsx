"use client";

import type { PlatformKey } from "@/lib/types";
import { PLATFORM_MAP } from "@/lib/platforms";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export function PlatformChip({
  platform,
  selected,
  onClick,
  size = "md",
  showDescription = false,
}: {
  platform: PlatformKey;
  selected?: boolean;
  onClick?: () => void;
  size?: "sm" | "md";
  showDescription?: boolean;
}) {
  const meta = PLATFORM_MAP[platform];
  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        "group relative flex items-center gap-2.5 rounded-xl border transition-all text-left",
        size === "md" ? "px-3 py-2.5" : "px-2.5 py-2",
        selected
          ? "border-brand-400/50 bg-brand-500/[0.12] shadow-glow"
          : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20",
      )}
    >
      <div
        className={cn(
          "shrink-0 rounded-lg grid place-items-center text-[11px] font-bold text-white",
          size === "md" ? "h-8 w-8" : "h-7 w-7",
        )}
        style={{ backgroundImage: meta.gradient }}
      >
        {meta.icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-semibold leading-tight">{meta.label}</div>
        {showDescription && (
          <div className="text-[11px] text-ink-300 truncate">{meta.description}</div>
        )}
      </div>
      {selected && (
        <div className="shrink-0 h-5 w-5 rounded-full bg-brand-500 grid place-items-center text-white">
          <Check className="h-3 w-3" />
        </div>
      )}
    </button>
  );
}
