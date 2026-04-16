"use client";

import { useState } from "react";
import { DollarSign, Sparkles, X } from "lucide-react";
import { useMediaOS } from "@/lib/store";
import { PLATFORM_MAP } from "@/lib/platforms";
import type { PlatformKey } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ALL_PLATFORMS } from "@/lib/mock";
import { PlatformChip } from "./PlatformChip";

export function PromoteToAdModal({
  contentId,
  initialPlatform,
  onClose,
}: {
  contentId: string;
  initialPlatform?: PlatformKey;
  onClose: () => void;
}) {
  const content = useMediaOS((s) => s.content.find((c) => c.id === contentId));
  const promote = useMediaOS((s) => s.promoteToAd);

  const alreadyOnPlatforms = new Set(content?.placements.map((p) => p.platform) ?? []);
  const initiallySelected: PlatformKey[] = initialPlatform
    ? [initialPlatform]
    : content?.placements.filter((p) => !p.isAd).map((p) => p.platform) ?? [];

  const [platforms, setPlatforms] = useState<PlatformKey[]>(initiallySelected);
  const [budget, setBudget] = useState(500);
  const [duration, setDuration] = useState(7);

  if (!content) return null;

  function toggle(p: PlatformKey) {
    setPlatforms((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));
  }

  function confirm() {
    platforms.forEach((p) => promote(contentId, p, budget, duration));
    onClose();
  }

  const suggested = ["display", "network", "mobile", "ott"] as PlatformKey[];

  return (
    <div className="fixed inset-0 z-50 bg-ink-950/80 backdrop-blur-sm grid place-items-center p-6">
      <div className="w-full max-w-[680px] rounded-2xl glass-strong border border-white/10 shadow-panel overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-cyan grid place-items-center">
              <Sparkles className="h-4 w-4 text-ink-950" />
            </div>
            <div>
              <div className="font-display text-[16px] font-semibold">Promote to Ad</div>
              <div className="text-[11px] text-ink-300">
                Same content. Same object. Now paid.
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 grid place-items-center rounded-lg hover:bg-white/10 text-ink-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-5 space-y-5">
          {/* preview strip */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={content.image} alt="" className="h-14 w-14 rounded-lg object-cover" />
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-semibold truncate">{content.title}</div>
              <div className="text-[11px] text-ink-300 truncate">{content.caption}</div>
            </div>
            <div className="text-[10px] uppercase tracking-widest text-ink-300">
              {content.placements.length} placement
              {content.placements.length !== 1 ? "s" : ""}
            </div>
          </div>

          {/* platforms */}
          <div className="space-y-2">
            <div className="text-[11px] uppercase tracking-widest text-ink-300 font-semibold">
              Where to run the ad
            </div>
            <div className="grid grid-cols-2 gap-2">
              {ALL_PLATFORMS.map((p) => (
                <PlatformChip
                  key={p}
                  platform={p}
                  selected={platforms.includes(p)}
                  onClick={() => toggle(p)}
                  showDescription
                />
              ))}
            </div>
            <div className="text-[11px] text-ink-300">
              <span className="text-brand-300 font-semibold">Suggested for this content:</span>{" "}
              {suggested.map((s) => PLATFORM_MAP[s].label).join(" · ")}
            </div>
          </div>

          {/* budget & duration */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Total budget">
              <div className="relative">
                <DollarSign className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" />
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(+e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/10 focus:border-brand-400 outline-none"
                />
              </div>
              <div className="flex gap-1.5 mt-1.5">
                {[100, 500, 1500, 5000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setBudget(amt)}
                    className={cn(
                      "text-[11px] px-2 py-1 rounded-md border",
                      budget === amt
                        ? "border-brand-400 bg-brand-500/10 text-white"
                        : "border-white/10 text-ink-200 hover:bg-white/5",
                    )}
                  >
                    ${amt}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Duration">
              <div className="relative">
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(+e.target.value)}
                  className="w-full pl-3 pr-12 py-2.5 rounded-lg bg-white/[0.04] border border-white/10 focus:border-brand-400 outline-none"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-ink-300">
                  days
                </span>
              </div>
              <div className="flex gap-1.5 mt-1.5">
                {[3, 7, 14, 30].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    className={cn(
                      "text-[11px] px-2 py-1 rounded-md border",
                      duration === d
                        ? "border-brand-400 bg-brand-500/10 text-white"
                        : "border-white/10 text-ink-200 hover:bg-white/5",
                    )}
                  >
                    {d}d
                  </button>
                ))}
              </div>
            </Field>
          </div>

          {/* projection */}
          <div className="p-3 rounded-xl border border-brand-400/30 bg-brand-500/[0.06]">
            <div className="text-[11px] uppercase tracking-widest text-brand-300 mb-1">
              Projected reach
            </div>
            <div className="text-[13px] text-ink-100">
              ~{Math.round((budget * 400) / Math.max(1, duration)).toLocaleString()} impressions
              /day · est. {(budget * 0.08).toFixed(0)} conversions across {platforms.length || 1}{" "}
              placement{platforms.length === 1 ? "" : "s"}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-white/5">
          <button
            onClick={onClose}
            className="px-3.5 py-2 rounded-lg text-sm text-ink-200 hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            disabled={platforms.length === 0}
            onClick={confirm}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-semibold transition",
              platforms.length === 0
                ? "bg-white/10 text-ink-300 cursor-not-allowed"
                : "bg-gradient-to-br from-brand-500 to-accent-cyan text-ink-950 shadow-glow hover:brightness-110",
            )}
          >
            Promote {platforms.length > 0 ? `(${platforms.length})` : ""}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <div className="text-[11px] uppercase tracking-widest text-ink-300 font-semibold">
        {label}
      </div>
      {children}
    </label>
  );
}
