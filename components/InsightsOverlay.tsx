"use client";

import { useMemo } from "react";
import { useMediaOS } from "@/lib/store";
import { PLATFORM_MAP } from "@/lib/platforms";
import type { PlatformKey } from "@/lib/types";
import { formatMoney, formatNumber } from "@/lib/utils";
import { Activity, DollarSign, MousePointerClick, Users } from "lucide-react";

export function InsightsOverlay() {
  const content = useMediaOS((s) => s.content);

  const totals = useMemo(() => {
    let impressions = 0;
    let clicks = 0;
    let spend = 0;
    let conversions = 0;
    const byPlatform: Record<string, { imp: number; clicks: number; spend: number }> = {};
    for (const c of content) {
      for (const p of c.placements) {
        impressions += p.metrics?.impressions ?? 0;
        clicks += p.metrics?.clicks ?? 0;
        spend += p.metrics?.spend ?? 0;
        conversions += p.metrics?.conversions ?? 0;
        byPlatform[p.platform] = byPlatform[p.platform] || { imp: 0, clicks: 0, spend: 0 };
        byPlatform[p.platform].imp += p.metrics?.impressions ?? 0;
        byPlatform[p.platform].clicks += p.metrics?.clicks ?? 0;
        byPlatform[p.platform].spend += p.metrics?.spend ?? 0;
      }
    }
    return { impressions, clicks, spend, conversions, byPlatform };
  }, [content]);

  const maxImp = Math.max(1, ...Object.values(totals.byPlatform).map((p) => p.imp));

  return (
    <div className="pointer-events-none absolute top-4 left-4 right-4 z-20 flex flex-col gap-3">
      <div className="pointer-events-auto flex items-center gap-3 flex-wrap">
        <Kpi
          icon={<Users className="h-3.5 w-3.5" />}
          label="Impressions"
          value={formatNumber(totals.impressions)}
          accent="#29e5d6"
        />
        <Kpi
          icon={<MousePointerClick className="h-3.5 w-3.5" />}
          label="Clicks"
          value={formatNumber(totals.clicks)}
          accent="#c6ff5a"
        />
        <Kpi
          icon={<Activity className="h-3.5 w-3.5" />}
          label="CTR avg"
          value={
            totals.impressions
              ? ((totals.clicks / totals.impressions) * 100).toFixed(2) + "%"
              : "—"
          }
          accent="#ff5acf"
        />
        <Kpi
          icon={<DollarSign className="h-3.5 w-3.5" />}
          label="Spend"
          value={formatMoney(totals.spend)}
          accent="#ff8a3b"
        />
      </div>
      <div className="pointer-events-auto self-start rounded-2xl glass-strong border border-white/10 px-4 py-3 w-[360px]">
        <div className="text-[10px] uppercase tracking-widest text-ink-300 mb-2">
          Reach by platform
        </div>
        <div className="space-y-1.5">
          {Object.entries(totals.byPlatform).map(([k, v]) => {
            const meta = PLATFORM_MAP[k as PlatformKey];
            return (
              <div key={k} className="flex items-center gap-2">
                <div
                  className="h-5 w-5 rounded grid place-items-center text-[9px] font-bold text-white shrink-0"
                  style={{ backgroundImage: meta.gradient }}
                >
                  {meta.icon[0]}
                </div>
                <div className="text-[11px] font-semibold w-[80px] truncate">
                  {meta.label}
                </div>
                <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: (v.imp / maxImp) * 100 + "%",
                      background: meta.gradient,
                    }}
                  />
                </div>
                <div className="text-[10px] tabular-nums text-ink-200 w-[52px] text-right">
                  {formatNumber(v.imp)}
                </div>
              </div>
            );
          })}
          {Object.keys(totals.byPlatform).length === 0 && (
            <div className="text-[11px] text-ink-300">No live placements yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function Kpi({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="rounded-xl glass-strong border border-white/10 px-3.5 py-2.5 min-w-[140px]">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-ink-300">
        <span style={{ color: accent }}>{icon}</span>
        {label}
      </div>
      <div className="text-[18px] font-display font-semibold tabular-nums mt-0.5">
        {value}
      </div>
    </div>
  );
}
