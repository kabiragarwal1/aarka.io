"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Megaphone, Plus, Sparkles, Target, Zap } from "lucide-react";
import { useMediaOS } from "@/lib/store";
import { PLATFORM_MAP } from "@/lib/platforms";
import { cn, formatMoney, formatNumber } from "@/lib/utils";
import type { Objective } from "@/lib/types";

const OBJECTIVE_ICON: Record<Objective, React.ComponentType<{ className?: string }>> = {
  awareness: Target,
  engagement: Sparkles,
  sales: Zap,
};

export default function CampaignsPage() {
  const campaigns = useMediaOS((s) => s.campaigns);
  const content = useMediaOS((s) => s.content);
  const router = useRouter();

  return (
    <div className="h-full w-full overflow-y-auto bg-mesh-grad">
      <div className="max-w-[1200px] mx-auto px-8 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-ink-300">Campaigns</div>
            <h1 className="font-display text-[32px] font-semibold tracking-tight">
              Your campaigns
            </h1>
            <p className="text-ink-200 text-[14px] mt-1">
              Each campaign groups a set of content objects. Jump into a campaign to edit, publish,
              and promote.
            </p>
          </div>
          <button
            onClick={() => router.push("/campaigns/new")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-br from-brand-500 to-accent-cyan text-ink-950 text-sm font-semibold shadow-glow"
          >
            <Plus className="h-4 w-4" /> Create campaign
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {campaigns.map((c) => {
            const cContent = content.filter((x) => x.campaignId === c.id);
            const totals = cContent.reduce(
              (acc, c) => {
                for (const p of c.placements) {
                  acc.impressions += p.metrics?.impressions ?? 0;
                  acc.spend += p.metrics?.spend ?? 0;
                  acc.placements += 1;
                }
                return acc;
              },
              { impressions: 0, spend: 0, placements: 0 },
            );
            const Icon = OBJECTIVE_ICON[c.objective];
            return (
              <Link
                key={c.id}
                href="/canvas"
                className="rounded-2xl border border-white/10 glass p-5 hover:border-white/20 transition group block"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-500/40 to-accent-cyan/30 grid place-items-center">
                      <Megaphone className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-display text-[17px] font-semibold">{c.name}</div>
                      <div className="text-[11px] text-ink-300 flex items-center gap-1.5">
                        <Icon className="h-3 w-3" />
                        {c.objective}
                        <span className={cn(
                          "ml-1 px-1.5 py-0.5 rounded text-[9px] font-bold",
                          c.status === "active" && "bg-emerald-500/20 text-emerald-300",
                          c.status === "draft" && "bg-white/10 text-ink-200",
                          c.status === "paused" && "bg-yellow-500/20 text-yellow-300",
                          c.status === "ended" && "bg-red-500/20 text-red-300",
                        )}>
                          {c.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-ink-300 group-hover:text-white" />
                </div>
                {/* thumbs */}
                <div className="flex -space-x-2 mb-4">
                  {cContent.slice(0, 5).map((ct) => (
                    <div
                      key={ct.id}
                      className="h-12 w-12 rounded-lg ring-2 ring-ink-900 overflow-hidden"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={ct.image} alt="" className="h-full w-full object-cover" />
                    </div>
                  ))}
                  {cContent.length === 0 && (
                    <div className="h-12 w-full rounded-lg border border-dashed border-white/15 grid place-items-center text-[11px] text-ink-300">
                      No content yet — add some in the canvas
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2 text-[11px]">
                  <Stat label="Content" value={cContent.length.toString()} />
                  <Stat label="Placements" value={totals.placements.toString()} />
                  <Stat label="Impressions" value={formatNumber(totals.impressions)} />
                </div>
                {totals.spend > 0 && (
                  <div className="mt-3 text-[11px] text-ink-200">
                    Paid spend so far:{" "}
                    <span className="font-semibold text-white">{formatMoney(totals.spend)}</span>
                  </div>
                )}
              </Link>
            );
          })}
          {campaigns.length === 0 && (
            <div className="col-span-2 p-8 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] text-center">
              <div className="text-ink-200 text-sm">
                No campaigns yet. Create one to start.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white/[0.03] border border-white/5 px-2.5 py-1.5">
      <div className="text-[9px] uppercase tracking-widest text-ink-300">{label}</div>
      <div className="text-[13px] font-semibold text-white tabular-nums">{value}</div>
    </div>
  );
}
