"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  DollarSign,
  LayoutGrid,
  Megaphone,
  MousePointerClick,
  Plus,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { useMediaOS } from "@/lib/store";
import { PLATFORM_MAP } from "@/lib/platforms";
import { formatMoney, formatNumber } from "@/lib/utils";

export default function DashboardPage() {
  const campaigns = useMediaOS((s) => s.campaigns);
  const content = useMediaOS((s) => s.content);
  const router = useRouter();

  const stats = useMemo(() => {
    let impressions = 0;
    let clicks = 0;
    let spend = 0;
    for (const c of content) {
      for (const p of c.placements) {
        impressions += p.metrics?.impressions ?? 0;
        clicks += p.metrics?.clicks ?? 0;
        spend += p.metrics?.spend ?? 0;
      }
    }
    return { impressions, clicks, spend, ctr: impressions ? (clicks / impressions) * 100 : 0 };
  }, [content]);

  const activePlacements = content.flatMap((c) =>
    c.placements.map((p) => ({ ...p, contentId: c.id, title: c.title, image: c.image })),
  );

  return (
    <div className="relative h-full w-full overflow-y-auto bg-mesh-grad">
      <div className="max-w-[1300px] mx-auto px-8 py-8 space-y-8">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 glass-strong p-8">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-white/10 bg-white/[0.04] text-[11px] uppercase tracking-widest text-ink-200 mb-4">
              <Sparkles className="h-3 w-3 text-accent-cyan" />
              AI Media OS · Prototype
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-semibold leading-[1.05] tracking-tight">
              <span className="text-gradient">One workspace</span>
              <br />
              for content, distribution & ads.
            </h1>
            <p className="text-ink-200 mt-4 text-[15px] leading-relaxed max-w-[520px]">
              Create once. Preview everywhere. Publish organically or promote into paid — across
              Instagram, TikTok, YouTube, OTT, display, networks and mobile apps. Watch performance
              loop right back into creation.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={() => router.push("/campaigns/new")}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-br from-brand-500 to-accent-cyan text-ink-950 text-sm font-semibold shadow-glow hover:brightness-110"
              >
                <Plus className="h-4 w-4" /> Create Campaign
              </button>
              <Link
                href="/canvas"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-sm"
              >
                <LayoutGrid className="h-4 w-4" />
                Open Canvas
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
          {/* floating platform logos */}
          <div className="absolute right-6 top-6 bottom-6 w-[360px] hidden lg:block">
            <div className="relative h-full">
              {Object.values(PLATFORM_MAP).map((p, i) => {
                const positions = [
                  { x: 20, y: 40, rot: -6 },
                  { x: 180, y: 10, rot: 8 },
                  { x: 110, y: 140, rot: -3 },
                  { x: 240, y: 100, rot: 6 },
                  { x: 40, y: 220, rot: -8 },
                  { x: 190, y: 250, rot: 10 },
                  { x: 120, y: 20, rot: 3 },
                ];
                const pos = positions[i % positions.length];
                return (
                  <div
                    key={p.key}
                    className="absolute h-16 w-16 rounded-2xl grid place-items-center text-[13px] font-bold text-white shadow-xl animate-float"
                    style={{
                      left: pos.x,
                      top: pos.y,
                      transform: `rotate(${pos.rot}deg)`,
                      backgroundImage: p.gradient,
                      animationDelay: `${i * 0.25}s`,
                    }}
                  >
                    {p.icon}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* KPI row */}
        <section className="grid grid-cols-4 gap-3">
          <KpiCard
            icon={<Users className="h-4 w-4" />}
            label="Impressions"
            value={formatNumber(stats.impressions)}
            delta="+18.2%"
          />
          <KpiCard
            icon={<MousePointerClick className="h-4 w-4" />}
            label="Clicks"
            value={formatNumber(stats.clicks)}
            delta="+9.4%"
          />
          <KpiCard
            icon={<Zap className="h-4 w-4" />}
            label="CTR avg"
            value={stats.ctr.toFixed(2) + "%"}
            delta="+0.21pp"
          />
          <KpiCard
            icon={<DollarSign className="h-4 w-4" />}
            label="Spend"
            value={formatMoney(stats.spend)}
            delta="-4.1%"
            negative
          />
        </section>

        {/* Campaigns + live */}
        <section className="grid grid-cols-5 gap-4">
          <div className="col-span-3 rounded-2xl border border-white/10 glass p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-[11px] uppercase tracking-widest text-ink-300">
                  Campaigns
                </div>
                <div className="font-display text-[18px] font-semibold">Active & recent</div>
              </div>
              <Link
                href="/campaigns"
                className="text-[12px] text-ink-200 hover:text-white flex items-center gap-1"
              >
                All <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="space-y-2">
              {campaigns.map((c) => {
                const cContent = content.filter((x) => x.campaignId === c.id);
                return (
                  <Link
                    key={c.id}
                    href={`/canvas`}
                    className="flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition group"
                  >
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-brand-500/40 to-accent-cyan/30 grid place-items-center shrink-0">
                      <Megaphone className="h-4 w-4 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 text-[13px] font-semibold">
                        {c.name}
                        <span className="text-[10px] uppercase tracking-widest text-brand-300">
                          {c.objective}
                        </span>
                      </div>
                      <div className="text-[11px] text-ink-300">
                        {cContent.length} content object{cContent.length === 1 ? "" : "s"} ·{" "}
                        {cContent.reduce((s, c) => s + c.placements.length, 0)} placements
                      </div>
                    </div>
                    <div className="flex -space-x-1">
                      {cContent.slice(0, 4).map((ct) => (
                        <div
                          key={ct.id}
                          className="h-7 w-7 rounded-md ring-2 ring-ink-900 overflow-hidden"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={ct.image} alt="" className="h-full w-full object-cover" />
                        </div>
                      ))}
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-ink-300 group-hover:text-white" />
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="col-span-2 rounded-2xl border border-white/10 glass p-5">
            <div className="text-[11px] uppercase tracking-widest text-ink-300">
              Live placements
            </div>
            <div className="font-display text-[18px] font-semibold mb-3">
              Across {new Set(activePlacements.map((p) => p.platform)).size} surfaces
            </div>
            <div className="space-y-2">
              {activePlacements.slice(0, 6).map((p, i) => {
                const meta = PLATFORM_MAP[p.platform];
                return (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 p-2 rounded-lg border border-white/5 bg-white/[0.02]"
                  >
                    <div
                      className="h-7 w-7 rounded-md grid place-items-center text-[10px] font-bold text-white"
                      style={{ backgroundImage: meta.gradient }}
                    >
                      {meta.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[12px] font-semibold truncate">{p.title}</div>
                      <div className="text-[10px] text-ink-300">
                        {meta.label} · {p.isAd ? "Paid" : "Organic"} · {p.state}
                      </div>
                    </div>
                    {p.metrics && (
                      <div className="text-[11px] tabular-nums text-ink-100">
                        {formatNumber(p.metrics.impressions)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Principle */}
        <section className="rounded-3xl border border-white/10 bg-white/[0.02] p-7 relative overflow-hidden">
          <div className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(900px 400px at 80% 20%, rgba(112,67,255,0.18), transparent 60%)",
            }}
          />
          <div className="relative grid grid-cols-3 gap-6">
            <Principle
              title="Content is an object"
              body="Not a post. Not a file. A reusable object that can appear anywhere — organic, paid, across every surface."
            />
            <Principle
              title="Interchangeable formats"
              body="One click flips a post into an ad. One toggle pulls an ad back to organic. Same object, same metrics."
            />
            <Principle
              title="Performance loops back"
              body="Insights attach to each node and feed the next creative decision — not a dashboard you have to visit."
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function KpiCard({
  icon,
  label,
  value,
  delta,
  negative,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  delta: string;
  negative?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/10 glass p-4">
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-ink-300">
        {icon}
        {label}
      </div>
      <div className="text-[26px] font-display font-semibold tabular-nums mt-1 text-white">
        {value}
      </div>
      <div
        className={
          negative
            ? "text-[11px] text-red-300 mt-0.5"
            : "text-[11px] text-emerald-300 mt-0.5"
        }
      >
        {delta} vs last period
      </div>
    </div>
  );
}

function Principle({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-widest text-accent-cyan mb-2">
        Principle
      </div>
      <div className="text-[18px] font-display font-semibold text-white">{title}</div>
      <div className="text-[13px] text-ink-200 mt-1 leading-relaxed">{body}</div>
    </div>
  );
}
