"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useMediaOS } from "@/lib/store";
import type { PlatformKey } from "@/lib/types";
import { PLATFORM_MAP } from "@/lib/platforms";
import { ContentNode } from "./ContentNode";
import { PlatformNode } from "./PlatformNode";
import { cn } from "@/lib/utils";
import { Minus, Plus, Maximize2 } from "lucide-react";

interface DragState {
  kind: "content" | "platform" | "pan" | "link" | null;
  id?: string; // content or platform id
  offsetX?: number;
  offsetY?: number;
  startX?: number;
  startY?: number;
  // link drag
  fromContent?: string;
  cursorX?: number;
  cursorY?: number;
  hoverPlatform?: PlatformKey | null;
}

const CONTENT_NODE_W = 280;
const CONTENT_NODE_H = 380;

export function Canvas() {
  const content = useMediaOS((s) => s.content);
  const positions = useMediaOS((s) => s.platformPositions);
  const selectedId = useMediaOS((s) => s.selectedContentId);
  const selectContent = useMediaOS((s) => s.selectContent);
  const moveContent = useMediaOS((s) => s.moveContent);
  const movePlatform = useMediaOS((s) => s.movePlatform);
  const duplicateContent = useMediaOS((s) => s.duplicateContent);
  const publishTo = useMediaOS((s) => s.publishTo);
  const insightsMode = useMediaOS((s) => s.insightsMode);

  const viewportRef = useRef<HTMLDivElement>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [drag, setDrag] = useState<DragState>({ kind: null });

  // fit-on-mount: pan so content cluster is roughly centered
  useEffect(() => {
    if (!viewportRef.current) return;
    const rect = viewportRef.current.getBoundingClientRect();
    // Center around content x~500
    setPan({ x: rect.width / 2 - 850, y: 60 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toWorld(clientX: number, clientY: number) {
    const rect = viewportRef.current!.getBoundingClientRect();
    return {
      x: (clientX - rect.left - pan.x) / zoom,
      y: (clientY - rect.top - pan.y) / zoom,
    };
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!drag.kind) return;
    const { x, y } = toWorld(e.clientX, e.clientY);
    if (drag.kind === "content" && drag.id) {
      moveContent(drag.id, x - (drag.offsetX ?? 0), y - (drag.offsetY ?? 0));
    } else if (drag.kind === "platform" && drag.id) {
      movePlatform(
        drag.id as PlatformKey,
        x - (drag.offsetX ?? 0),
        y - (drag.offsetY ?? 0),
      );
    } else if (drag.kind === "pan") {
      setPan({
        x: (drag.startX ?? 0) + (e.clientX - (drag.cursorX ?? 0)),
        y: (drag.startY ?? 0) + (e.clientY - (drag.cursorY ?? 0)),
      });
    } else if (drag.kind === "link" && drag.fromContent) {
      // detect hover platform
      const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
      const platformEl = el?.closest("[data-platform]") as HTMLElement | null;
      const hoverPlatform = (platformEl?.getAttribute("data-platform") as PlatformKey | null) ?? null;
      setDrag((d) => ({ ...d, cursorX: x, cursorY: y, hoverPlatform }));
    }
  }

  function onPointerUp() {
    if (drag.kind === "link" && drag.fromContent && drag.hoverPlatform) {
      publishTo(drag.fromContent, drag.hoverPlatform, "now");
    }
    setDrag({ kind: null });
  }

  // content node drag
  function startContentDrag(e: React.PointerEvent, id: string) {
    e.stopPropagation();
    const c = content.find((x) => x.id === id);
    if (!c) return;
    const { x, y } = toWorld(e.clientX, e.clientY);
    selectContent(id);
    // ALT / shift => start a link (publish) drag
    if (e.altKey || e.metaKey || e.shiftKey) {
      setDrag({
        kind: "link",
        fromContent: id,
        cursorX: x,
        cursorY: y,
        hoverPlatform: null,
      });
      return;
    }
    setDrag({
      kind: "content",
      id,
      offsetX: x - c.x,
      offsetY: y - c.y,
    });
  }

  // link handle (explicit): starts from a small handle on node
  function startLink(e: React.PointerEvent, id: string) {
    e.stopPropagation();
    const { x, y } = toWorld(e.clientX, e.clientY);
    setDrag({ kind: "link", fromContent: id, cursorX: x, cursorY: y, hoverPlatform: null });
  }

  function startPlatformDrag(e: React.PointerEvent, platform: PlatformKey) {
    e.stopPropagation();
    const p = positions.find((x) => x.platform === platform);
    if (!p) return;
    const { x, y } = toWorld(e.clientX, e.clientY);
    setDrag({
      kind: "platform",
      id: platform,
      offsetX: x - p.x,
      offsetY: y - p.y,
    });
  }

  function startPan(e: React.PointerEvent) {
    // only if empty background
    if ((e.target as HTMLElement).closest("[data-node]")) return;
    selectContent(null);
    setDrag({
      kind: "pan",
      startX: pan.x,
      startY: pan.y,
      cursorX: e.clientX,
      cursorY: e.clientY,
    });
  }

  function onWheel(e: React.WheelEvent) {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = -e.deltaY * 0.0015;
      setZoom((z) => Math.min(1.6, Math.max(0.4, z + delta)));
    }
  }

  // Connection lines
  const edges = useMemo(() => {
    const list: {
      id: string;
      fromX: number;
      fromY: number;
      toX: number;
      toY: number;
      isAd: boolean;
      state: string;
    }[] = [];
    for (const c of content) {
      for (const pl of c.placements) {
        const p = positions.find((x) => x.platform === pl.platform);
        if (!p) continue;
        list.push({
          id: c.id + ":" + pl.platform,
          fromX: c.x + CONTENT_NODE_W,
          fromY: c.y + CONTENT_NODE_H / 2,
          toX: p.x,
          toY: p.y + 30,
          isAd: pl.isAd,
          state: pl.state,
        });
      }
    }
    return list;
  }, [content, positions]);

  // counts per platform
  const platformStats = useMemo(() => {
    const stats: Record<string, { count: number; impressions: number }> = {};
    for (const c of content) {
      for (const p of c.placements) {
        stats[p.platform] = stats[p.platform] || { count: 0, impressions: 0 };
        stats[p.platform].count += 1;
        stats[p.platform].impressions += p.metrics?.impressions ?? 0;
      }
    }
    return stats;
  }, [content]);

  const worldStyle: React.CSSProperties = {
    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
    transformOrigin: "0 0",
  };

  return (
    <div
      ref={viewportRef}
      className={cn(
        "relative h-full w-full overflow-hidden canvas-grid no-select",
        drag.kind && "cursor-grabbing",
      )}
      onPointerDown={startPan}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={() => setDrag({ kind: null })}
      onWheel={onWheel}
    >
      {/* World */}
      <div className="absolute inset-0" style={worldStyle}>
        {/* connection SVG */}
        <svg
          className="absolute top-0 left-0 pointer-events-none overflow-visible"
          width={3000}
          height={2000}
        >
          {edges.map((e) => {
            const dx = e.toX - e.fromX;
            const cp1x = e.fromX + dx * 0.5;
            const cp1y = e.fromY;
            const cp2x = e.toX - dx * 0.5;
            const cp2y = e.toY;
            const color = e.isAd ? "#7043ff" : "#29e5d6";
            return (
              <g key={e.id}>
                <path
                  d={`M ${e.fromX} ${e.fromY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${e.toX} ${e.toY}`}
                  stroke={color}
                  strokeWidth={1.5}
                  fill="none"
                  opacity={e.state === "live" ? 0.85 : 0.35}
                  className={e.state === "scheduled" ? "connector-line" : ""}
                />
                <circle cx={e.fromX} cy={e.fromY} r={3} fill={color} />
                <circle cx={e.toX} cy={e.toY} r={3} fill={color} />
              </g>
            );
          })}

          {drag.kind === "link" && drag.fromContent && (() => {
            const c = content.find((x) => x.id === drag.fromContent);
            if (!c || drag.cursorX == null || drag.cursorY == null) return null;
            const fromX = c.x + CONTENT_NODE_W;
            const fromY = c.y + CONTENT_NODE_H / 2;
            const color = drag.hoverPlatform ? "#c6ff5a" : "#ffffff";
            return (
              <path
                d={`M ${fromX} ${fromY} L ${drag.cursorX} ${drag.cursorY}`}
                stroke={color}
                strokeWidth={2}
                fill="none"
                strokeDasharray="6 6"
                opacity={0.8}
              />
            );
          })()}
        </svg>

        {/* platform nodes */}
        {positions.map((p) => (
          <div key={p.platform} data-node="platform">
            <PlatformNode
              platform={p.platform}
              x={p.x}
              y={p.y}
              publishedCount={platformStats[p.platform]?.count ?? 0}
              totalImpressions={platformStats[p.platform]?.impressions ?? 0}
              highlight={drag.kind === "link" && drag.hoverPlatform === p.platform}
              onPointerDown={(e) => startPlatformDrag(e, p.platform)}
            />
          </div>
        ))}

        {/* content nodes */}
        {content.map((c) => (
          <div key={c.id} data-node="content" className="relative">
            <ContentNode
              content={c}
              selected={selectedId === c.id}
              insightsMode={insightsMode}
              onPointerDown={(e) => startContentDrag(e, c.id)}
              onSelect={() => selectContent(c.id)}
              onDuplicate={() => duplicateContent(c.id)}
            />
            {/* link handle */}
            <button
              className={cn(
                "absolute rounded-full h-5 w-5 bg-gradient-to-br from-brand-500 to-accent-cyan text-ink-950 text-[10px] font-bold grid place-items-center shadow-glow hover:scale-110 transition",
                selectedId === c.id ? "opacity-100" : "opacity-0 group-hover:opacity-100",
              )}
              style={{
                left: c.x + CONTENT_NODE_W - 10,
                top: c.y + CONTENT_NODE_H / 2 - 10,
              }}
              onPointerDown={(e) => startLink(e, c.id)}
              title="Drag to a platform to publish"
            >
              →
            </button>
          </div>
        ))}
      </div>

      {/* HUD */}
      <div className="absolute bottom-5 left-5 flex items-center gap-1 rounded-lg border border-white/10 bg-ink-800/80 backdrop-blur p-0.5">
        <button
          onClick={() => setZoom((z) => Math.max(0.4, z - 0.1))}
          className="h-7 w-7 grid place-items-center rounded-md hover:bg-white/10"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <div className="px-2 text-[11px] text-ink-200 tabular-nums">
          {Math.round(zoom * 100)}%
        </div>
        <button
          onClick={() => setZoom((z) => Math.min(1.6, z + 0.1))}
          className="h-7 w-7 grid place-items-center rounded-md hover:bg-white/10"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
        <div className="h-5 w-px bg-white/10 mx-1" />
        <button
          onClick={() => {
            setZoom(1);
            if (viewportRef.current) {
              const rect = viewportRef.current.getBoundingClientRect();
              setPan({ x: rect.width / 2 - 850, y: 60 });
            }
          }}
          className="h-7 w-7 grid place-items-center rounded-md hover:bg-white/10"
          title="Fit"
        >
          <Maximize2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Help hint */}
      <div className="absolute bottom-5 right-[360px] flex items-center gap-2 text-[11px] text-ink-300">
        <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">
          Drag node
        </span>
        to move ·
        <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">
          Alt + drag
        </span>
        or
        <span className="px-1.5 py-0.5 rounded bg-gradient-to-br from-brand-500 to-accent-cyan text-ink-950 font-semibold">
          →
        </span>
        to publish ·
        <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">
          Ctrl + wheel
        </span>
        to zoom
      </div>
    </div>
  );
}
