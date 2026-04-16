"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Canvas } from "@/components/canvas/Canvas";
import { InspectorPanel } from "@/components/InspectorPanel";
import { InsightsOverlay } from "@/components/InsightsOverlay";
import { useMediaOS } from "@/lib/store";

function CanvasInner() {
  const params = useSearchParams();
  const selectContent = useMediaOS((s) => s.selectContent);
  const insightsMode = useMediaOS((s) => s.insightsMode);

  useEffect(() => {
    const c = params?.get("c");
    if (c) selectContent(c);
  }, [params, selectContent]);

  return (
    <div className="absolute inset-0 flex">
      <div className="relative flex-1 min-w-0">
        <Canvas />
        {insightsMode && <InsightsOverlay />}
      </div>
      <InspectorPanel />
    </div>
  );
}

export default function CanvasPage() {
  return (
    <Suspense fallback={<div className="p-6 text-ink-300">Loading canvas…</div>}>
      <CanvasInner />
    </Suspense>
  );
}
