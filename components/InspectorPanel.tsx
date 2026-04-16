"use client";

import { useState } from "react";
import {
  Copy,
  DollarSign,
  Globe2,
  Megaphone,
  Plus,
  Sparkles,
  Trash2,
  Wand2,
  X,
} from "lucide-react";
import { useMediaOS } from "@/lib/store";
import { PLATFORMS, PLATFORM_MAP } from "@/lib/platforms";
import type { PlatformKey } from "@/lib/types";
import { cn, formatMoney, formatNumber } from "@/lib/utils";
import { PromoteToAdModal } from "./PromoteToAdModal";

export function InspectorPanel() {
  const selectedId = useMediaOS((s) => s.selectedContentId);
  const content = useMediaOS((s) =>
    s.content.find((c) => c.id === s.selectedContentId),
  );
  const updateContent = useMediaOS((s) => s.updateContent);
  const duplicate = useMediaOS((s) => s.duplicateContent);
  const removeContent = useMediaOS((s) => s.removeContent);
  const publishTo = useMediaOS((s) => s.publishTo);
  const unpublish = useMediaOS((s) => s.unpublish);
  const demoteAd = useMediaOS((s) => s.demoteAd);
  const setActiveVersion = useMediaOS((s) => s.setActiveVersion);
  const addVersion = useMediaOS((s) => s.addVersion);
  const insightsMode = useMediaOS((s) => s.insightsMode);
  const selectContent = useMediaOS((s) => s.selectContent);

  const [promoteOpen, setPromoteOpen] = useState<{ platform?: PlatformKey } | null>(null);

  if (!content) {
    return (
      <div className="h-full w-[340px] shrink-0 border-l border-white/5 glass-strong p-5 flex flex-col items-center justify-center text-center">
        <div className="h-10 w-10 rounded-xl bg-white/5 grid place-items-center mb-3">
          <Sparkles className="h-5 w-5 text-ink-300" />
        </div>
        <div className="text-[13px] font-semibold text-ink-100">No content selected</div>
        <div className="text-[12px] text-ink-300 mt-1 max-w-[220px] leading-snug">
          Click any card on the canvas to edit caption, platforms, and ad settings.
        </div>
      </div>
    );
  }

  return (
    <aside className="h-full w-[340px] shrink-0 border-l border-white/5 glass-strong flex flex-col">
      {/* header */}
      <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
        <div className="flex-1 min-w-0">
          <div className="text-[10px] uppercase tracking-widest text-ink-300">
            Content object
          </div>
          <input
            value={content.title}
            onChange={(e) => updateContent(content.id, { title: e.target.value })}
            className="w-full bg-transparent outline-none text-[15px] font-semibold truncate"
          />
        </div>
        <button
          onClick={() => selectContent(null)}
          className="h-7 w-7 grid place-items-center rounded-md hover:bg-white/5 text-ink-200"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-5">
        {/* preview */}
        <div className="relative rounded-xl overflow-hidden border border-white/5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={content.image} alt="" className="w-full aspect-[4/5] object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent" />
          <button className="absolute top-2 right-2 flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-black/60 backdrop-blur border border-white/15 text-[11px]">
            <Wand2 className="h-3 w-3" />
            Regenerate
          </button>
        </div>

        {/* caption + versions */}
        <Section label="Caption & variations">
          <textarea
            value={content.caption}
            onChange={(e) => updateContent(content.id, { caption: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 focus:border-brand-400 outline-none text-[13px] leading-snug resize-none"
          />
          <div className="space-y-1.5">
            {content.versions.map((v, i) => {
              const active = v.id === content.activeVersionId;
              return (
                <button
                  key={v.id}
                  onClick={() => setActiveVersion(content.id, v.id)}
                  className={cn(
                    "w-full text-left p-2 rounded-lg border transition text-[12px]",
                    active
                      ? "border-brand-400/60 bg-brand-500/10"
                      : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05]",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-widest text-brand-300">
                      {v.tone ?? `V${i + 1}`}
                    </span>
                    {active && <span className="text-[10px] text-ink-300">active</span>}
                  </div>
                  <div className="text-ink-100 mt-0.5 line-clamp-2">{v.caption}</div>
                </button>
              );
            })}
            <button
              onClick={() => addVersion(content.id, content.caption, "Alt")}
              className="w-full flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg border border-dashed border-white/15 text-[11px] text-ink-200 hover:text-white hover:bg-white/5"
            >
              <Plus className="h-3 w-3" />
              Add variation
            </button>
          </div>
        </Section>

        {/* platforms & ad toggle */}
        <Section label="Platforms">
          <div className="space-y-1.5">
            {PLATFORMS.map((p) => {
              const pl = content.placements.find((x) => x.platform === p.key);
              const active = !!pl;
              return (
                <div
                  key={p.key}
                  className={cn(
                    "flex items-center gap-2.5 p-2 rounded-lg border transition",
                    active
                      ? "border-white/15 bg-white/[0.04]"
                      : "border-white/5 bg-white/[0.02]",
                  )}
                >
                  <div
                    className="h-7 w-7 rounded-md grid place-items-center text-[10px] font-bold text-white shrink-0"
                    style={{ backgroundImage: p.gradient }}
                  >
                    {p.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[12px] font-semibold leading-tight flex items-center gap-1.5">
                      {p.label}
                      {pl && (
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            pl.state === "live" && "bg-emerald-400",
                            pl.state === "scheduled" && "bg-yellow-400",
                          )}
                        />
                      )}
                    </div>
                    <div className="text-[10px] text-ink-300 truncate">
                      {pl
                        ? pl.isAd
                          ? `Ad · ${formatMoney(pl.budget ?? 0)} · ${pl.durationDays}d`
                          : `Organic · ${pl.state}`
                        : p.description}
                    </div>
                  </div>
                  {!active ? (
                    <button
                      onClick={() => publishTo(content.id, p.key, "now")}
                      className="text-[10px] font-semibold px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 border border-white/10"
                    >
                      Publish
                    </button>
                  ) : (
                    <div className="flex items-center gap-1">
                      <AdToggle
                        isAd={pl.isAd}
                        onAd={() => setPromoteOpen({ platform: p.key })}
                        onOrganic={() => demoteAd(content.id, p.key)}
                      />
                      <button
                        onClick={() => unpublish(content.id, p.key)}
                        className="h-6 w-6 grid place-items-center rounded hover:bg-white/10 text-ink-300"
                        title="Unpublish"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Section>

        {/* metrics */}
        {insightsMode && content.placements.some((p) => p.metrics) && (
          <Section label="Performance">
            <div className="space-y-2">
              {content.placements
                .filter((p) => p.metrics)
                .map((p) => (
                  <div
                    key={p.platform}
                    className="p-2.5 rounded-lg border border-white/10 bg-white/[0.02]"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <div
                        className="h-5 w-5 rounded grid place-items-center text-[9px] font-bold text-white"
                        style={{ backgroundImage: PLATFORM_MAP[p.platform].gradient }}
                      >
                        {PLATFORM_MAP[p.platform].icon[0]}
                      </div>
                      <div className="text-[12px] font-semibold">
                        {PLATFORM_MAP[p.platform].label}
                      </div>
                      {p.isAd && (
                        <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-200 font-bold">
                          PAID
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                      <Metric label="Imp." value={formatNumber(p.metrics!.impressions)} />
                      <Metric label="Clicks" value={formatNumber(p.metrics!.clicks)} />
                      <Metric label="CTR" value={`${p.metrics!.ctr}%`} />
                    </div>
                  </div>
                ))}
            </div>
          </Section>
        )}
      </div>

      {/* footer actions */}
      <div className="border-t border-white/5 p-3 space-y-2">
        <button
          onClick={() => setPromoteOpen({})}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-gradient-to-br from-brand-500 to-accent-cyan text-ink-950 text-sm font-semibold shadow-glow hover:brightness-110"
        >
          <Megaphone className="h-4 w-4" />
          Promote to Ad
        </button>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => duplicate(content.id)}
            className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-md text-[12px] bg-white/5 hover:bg-white/10"
          >
            <Copy className="h-3 w-3" />
            Duplicate
          </button>
          <button
            onClick={() => removeContent(content.id)}
            className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-md text-[12px] bg-white/5 hover:bg-red-500/20 hover:text-red-300"
          >
            <Trash2 className="h-3 w-3" />
            Delete
          </button>
        </div>
      </div>

      {promoteOpen && (
        <PromoteToAdModal
          contentId={content.id}
          initialPlatform={promoteOpen.platform}
          onClose={() => setPromoteOpen(null)}
        />
      )}
    </aside>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="text-[10px] uppercase tracking-widest text-ink-300 font-semibold">
        {label}
      </div>
      {children}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-white/[0.03] px-2 py-1">
      <div className="text-[9px] uppercase tracking-widest text-ink-300">{label}</div>
      <div className="text-[12px] font-semibold text-white tabular-nums">{value}</div>
    </div>
  );
}

function AdToggle({
  isAd,
  onAd,
  onOrganic,
}: {
  isAd: boolean;
  onAd: () => void;
  onOrganic: () => void;
}) {
  return (
    <button
      onClick={() => (isAd ? onOrganic() : onAd())}
      className={cn(
        "relative h-5 w-9 rounded-full transition",
        isAd ? "bg-gradient-to-r from-brand-500 to-accent-cyan" : "bg-white/10",
      )}
      title={isAd ? "Convert to organic" : "Promote to ad"}
    >
      <span
        className={cn(
          "absolute top-0.5 h-4 w-4 rounded-full bg-white grid place-items-center text-[8px] transition-all",
          isAd ? "left-[18px]" : "left-0.5",
        )}
      >
        {isAd ? <DollarSign className="h-2.5 w-2.5 text-brand-600" /> : <Globe2 className="h-2.5 w-2.5 text-ink-500" />}
      </span>
    </button>
  );
}
