"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  LayoutGrid,
  Layers,
  Megaphone,
  Plus,
  Sparkles,
  Activity,
  RotateCcw,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useMediaOS } from "@/lib/store";

const nav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/canvas", label: "Canvas", icon: LayoutGrid },
  { href: "/campaigns", label: "Campaigns", icon: Megaphone },
  { href: "/content", label: "Content", icon: Layers },
];

export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const insightsMode = useMediaOS((s) => s.insightsMode);
  const toggleInsights = useMediaOS((s) => s.toggleInsights);
  const reset = useMediaOS((s) => s.resetAll);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-ink-950">
      {/* Sidebar */}
      <aside className="w-[236px] shrink-0 border-r border-white/5 glass-strong flex flex-col">
        <div className="p-5 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative h-8 w-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-cyan grid place-items-center shadow-glow">
              <Sparkles className="h-4 w-4 text-white" />
              <div className="absolute inset-0 rounded-lg ring-1 ring-white/20" />
            </div>
            <div className="leading-tight">
              <div className="font-display font-semibold tracking-tight text-[15px]">
                Aarka
              </div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-ink-300">
                Media OS
              </div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {nav.map((n) => {
            const active = n.href === "/" ? pathname === "/" : pathname?.startsWith(n.href);
            const Icon = n.icon;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors",
                  active
                    ? "bg-white/5 text-white shadow-panel"
                    : "text-ink-200 hover:text-white hover:bg-white/[0.03]",
                )}
              >
                <Icon className={cn("h-4 w-4", active && "text-brand-300")} />
                <span>{n.label}</span>
                {active && <ChevronRight className="h-3.5 w-3.5 ml-auto opacity-50" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/5 space-y-2">
          <button
            onClick={() => router.push("/campaigns/new")}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 hover:brightness-110 text-white text-sm font-semibold shadow-glow transition"
          >
            <Plus className="h-4 w-4" />
            Create Campaign
          </button>
          <button
            onClick={reset}
            className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-md text-[11px] text-ink-300 hover:text-white hover:bg-white/[0.04]"
            title="Reset demo state"
          >
            <RotateCcw className="h-3 w-3" />
            Reset demo
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 shrink-0 flex items-center justify-between border-b border-white/5 px-5 glass-strong">
          <div className="flex items-center gap-3">
            <Crumbs pathname={pathname ?? "/"} />
          </div>
          <div className="flex items-center gap-2">
            <ViewToggle
              insightsMode={insightsMode}
              onToggle={toggleInsights}
              onCanvas={() => router.push("/canvas")}
              pathname={pathname ?? "/"}
            />
            <button
              onClick={() => router.push("/campaigns/new")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm bg-white/5 hover:bg-white/10 border border-white/10 transition"
            >
              <Plus className="h-3.5 w-3.5" />
              New
            </button>
          </div>
        </header>

        <main className="flex-1 min-h-0 overflow-hidden relative">{children}</main>
      </div>
    </div>
  );
}

function Crumbs({ pathname }: { pathname: string }) {
  const parts = pathname === "/" ? ["Dashboard"] : pathname.split("/").filter(Boolean);
  return (
    <div className="flex items-center gap-1.5 text-[13px] text-ink-200">
      {parts.map((p, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight className="h-3 w-3 text-ink-300" />}
          <span className={cn(i === parts.length - 1 && "text-white capitalize")}>
            {p.replace(/-/g, " ")}
          </span>
        </span>
      ))}
    </div>
  );
}

function ViewToggle({
  insightsMode,
  onToggle,
  pathname,
}: {
  insightsMode: boolean;
  onToggle: () => void;
  onCanvas: () => void;
  pathname: string;
}) {
  const onCanvasPage = pathname.startsWith("/canvas");
  if (!onCanvasPage) return null;
  return (
    <div className="flex items-center gap-1 p-0.5 rounded-lg border border-white/10 bg-white/[0.03]">
      <button
        onClick={() => insightsMode && onToggle()}
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition",
          !insightsMode ? "bg-white/10 text-white" : "text-ink-200 hover:text-white",
        )}
      >
        <LayoutGrid className="h-3.5 w-3.5" />
        Canvas
      </button>
      <button
        onClick={() => !insightsMode && onToggle()}
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition",
          insightsMode
            ? "bg-gradient-to-br from-accent-cyan/80 to-brand-500 text-ink-950"
            : "text-ink-200 hover:text-white",
        )}
      >
        <Activity className="h-3.5 w-3.5" />
        Insights
      </button>
    </div>
  );
}
