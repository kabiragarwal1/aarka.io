"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  DollarSign,
  Eye,
  Image as ImageIcon,
  Megaphone,
  Send,
  Shuffle,
  Sparkles,
  Target,
  Wand2,
  Zap,
} from "lucide-react";
import { cn, uid } from "@/lib/utils";
import { useMediaOS } from "@/lib/store";
import { ALL_PLATFORMS } from "@/lib/mock";
import { PLATFORM_MAP } from "@/lib/platforms";
import { PlatformChip } from "@/components/PlatformChip";
import { PlatformPreview } from "@/components/previews";
import type { Objective, PlatformKey } from "@/lib/types";

type Step = "campaign" | "content" | "preview" | "publish";

const STEPS: { key: Step; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "campaign", label: "Campaign", icon: Megaphone },
  { key: "content", label: "Content", icon: ImageIcon },
  { key: "preview", label: "Preview", icon: Eye },
  { key: "publish", label: "Publish", icon: Send },
];

const OBJECTIVES: {
  key: Objective;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { key: "awareness", label: "Awareness", description: "Reach new audiences", icon: Target },
  { key: "engagement", label: "Engagement", description: "Spark saves, shares, comments", icon: Sparkles },
  { key: "sales", label: "Sales", description: "Drive clicks & conversions", icon: Zap },
];

const STOCK_IMAGES = [
  "https://picsum.photos/seed/summer-capsule/900/1100",
  "https://picsum.photos/seed/studio-bw/900/1100",
  "https://picsum.photos/seed/urban-color/900/1100",
  "https://picsum.photos/seed/soft-pastel/900/1100",
  "https://picsum.photos/seed/golden-hour/900/1100",
  "https://picsum.photos/seed/neon-night/900/1100",
];

const AI_CAPTIONS = (topic: string) => [
  { tone: "Warm", caption: `${topic}. Made for long weekends and longer stories.` },
  { tone: "Punchy", caption: `New. ${topic}. Go.` },
  { tone: "Promo", caption: `${topic} — launching Friday. Early access for subscribers.` },
];

export default function NewCampaignPage() {
  const router = useRouter();
  const createCampaign = useMediaOS((s) => s.createCampaign);
  const addContent = useMediaOS((s) => s.addContent);
  const publishTo = useMediaOS((s) => s.publishTo);
  const promoteToAd = useMediaOS((s) => s.promoteToAd);

  const [step, setStep] = useState<Step>("campaign");
  const [name, setName] = useState("");
  const [objective, setObjective] = useState<Objective>("awareness");

  const [image, setImage] = useState<string>(STOCK_IMAGES[0]);
  const [topic, setTopic] = useState("Ocean Teal capsule drop");
  const [caption, setCaption] = useState(
    "Ocean Teal capsule drop. Crafted for long days and warm nights.",
  );
  const [variations, setVariations] = useState<{ tone: string; caption: string }[]>(
    AI_CAPTIONS("Ocean Teal capsule drop"),
  );
  const [activeVariation, setActiveVariation] = useState(0);

  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformKey[]>([
    "instagram",
    "tiktok",
    "youtube",
  ]);
  const [adPlatforms, setAdPlatforms] = useState<Record<PlatformKey, boolean>>({
    instagram: false,
    tiktok: false,
    youtube: false,
    ott: false,
    display: false,
    network: false,
    mobile: false,
  });
  const [schedule, setSchedule] = useState<"now" | "later">("now");
  const [budget, setBudget] = useState<number>(500);
  const [duration, setDuration] = useState<number>(7);

  const stepIdx = STEPS.findIndex((s) => s.key === step);
  const canNext = useMemo(() => {
    if (step === "campaign") return name.trim().length > 1;
    if (step === "content") return caption.trim().length > 2;
    if (step === "preview") return selectedPlatforms.length > 0;
    return true;
  }, [step, name, caption, selectedPlatforms]);

  // keep caption synced to active variation
  useEffect(() => {
    if (variations[activeVariation]) setCaption(variations[activeVariation].caption);
  }, [activeVariation, variations]);

  function next() {
    const idx = STEPS.findIndex((s) => s.key === step);
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1].key);
  }
  function back() {
    const idx = STEPS.findIndex((s) => s.key === step);
    if (idx > 0) setStep(STEPS[idx - 1].key);
  }

  function regenerateCaptions() {
    setVariations(AI_CAPTIONS(topic || "New drop"));
    setActiveVariation(0);
  }

  function shuffleImage() {
    const next = STOCK_IMAGES[(STOCK_IMAGES.indexOf(image) + 1) % STOCK_IMAGES.length];
    setImage(next);
  }

  function publish() {
    const campaign = createCampaign(name, objective);
    // create content using the store API; pass full fields
    const c = addContent({
      title: topic || name,
      image,
      caption,
      versions: variations.map((v, i) => ({
        id: uid("v"),
        caption: v.caption,
        tone: v.tone,
      })),
      campaignId: campaign.id,
    });
    // activate version matching current caption
    // publish to each selected platform
    selectedPlatforms.forEach((p) => {
      publishTo(c.id, p, schedule === "now" ? "now" : "schedule");
      if (adPlatforms[p]) {
        promoteToAd(c.id, p, budget, duration);
      }
    });
    router.push("/canvas?c=" + c.id);
  }

  return (
    <div className="h-full w-full overflow-hidden bg-ink-950 bg-mesh-grad">
      <div className="h-full flex flex-col">
        {/* Progress bar */}
        <div className="shrink-0 px-8 pt-6">
          <div className="flex items-center gap-2">
            {STEPS.map((s, i) => {
              const active = i === stepIdx;
              const done = i < stepIdx;
              const Icon = s.icon;
              return (
                <div key={s.key} className="flex items-center gap-2 flex-1">
                  <button
                    onClick={() => done && setStep(s.key)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-semibold transition",
                      active
                        ? "bg-white text-ink-950"
                        : done
                        ? "bg-brand-500/20 text-brand-200 hover:bg-brand-500/30"
                        : "bg-white/5 text-ink-300",
                    )}
                  >
                    <span
                      className={cn(
                        "h-5 w-5 rounded-full grid place-items-center text-[10px]",
                        active ? "bg-ink-950 text-white" : done ? "bg-brand-500 text-white" : "bg-white/10",
                      )}
                    >
                      {done ? <Check className="h-3 w-3" /> : <Icon className="h-3 w-3" />}
                    </span>
                    {s.label}
                  </button>
                  {i < STEPS.length - 1 && (
                    <div
                      className={cn(
                        "h-[2px] flex-1 rounded-full transition",
                        i < stepIdx ? "bg-brand-400" : "bg-white/10",
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 min-h-0 grid grid-cols-12 gap-6 p-6 overflow-hidden">
          {/* Left column: inputs */}
          <div className="col-span-5 min-h-0 overflow-y-auto pr-2">
            {step === "campaign" && (
              <StepCampaign
                name={name}
                setName={setName}
                objective={objective}
                setObjective={setObjective}
              />
            )}
            {step === "content" && (
              <StepContent
                image={image}
                setImage={setImage}
                topic={topic}
                setTopic={setTopic}
                caption={caption}
                setCaption={setCaption}
                variations={variations}
                setVariations={setVariations}
                activeVariation={activeVariation}
                setActiveVariation={setActiveVariation}
                regenerate={regenerateCaptions}
                shuffleImage={shuffleImage}
              />
            )}
            {step === "preview" && (
              <StepPreview
                selectedPlatforms={selectedPlatforms}
                setSelectedPlatforms={setSelectedPlatforms}
                adPlatforms={adPlatforms}
                setAdPlatforms={setAdPlatforms}
              />
            )}
            {step === "publish" && (
              <StepPublish
                name={name}
                schedule={schedule}
                setSchedule={setSchedule}
                selectedPlatforms={selectedPlatforms}
                adPlatforms={adPlatforms}
                budget={budget}
                setBudget={setBudget}
                duration={duration}
                setDuration={setDuration}
              />
            )}
          </div>

          {/* Right column: Live preview */}
          <div className="col-span-7 min-h-0 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-[11px] uppercase tracking-[0.22em] text-ink-300">
                  Live multi-platform preview
                </div>
                <div className="text-[15px] font-display font-semibold text-white">
                  {selectedPlatforms.length} surface{selectedPlatforms.length === 1 ? "" : "s"} — rendered from one object
                </div>
              </div>
              <div className="text-[11px] text-ink-300">
                Layout auto-adapts per platform
              </div>
            </div>
            <div className="flex-1 min-h-0 overflow-auto rounded-2xl glass p-6">
              <div className="flex flex-wrap gap-6 items-start justify-center">
                {(step === "campaign" ? (["instagram", "tiktok", "youtube"] as PlatformKey[]) : selectedPlatforms).map(
                  (p) => (
                    <div key={p} className="flex flex-col items-center gap-2">
                      <div className="text-[11px] uppercase tracking-widest text-ink-300">
                        {PLATFORM_MAP[p].label}
                      </div>
                      <PlatformPreview
                        platform={p}
                        image={image}
                        caption={caption}
                        isAd={!!adPlatforms[p]}
                      />
                    </div>
                  ),
                )}
                {step !== "campaign" && selectedPlatforms.length === 0 && (
                  <div className="text-ink-300 p-8 text-center">
                    Select a platform to see the live preview.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="shrink-0 border-t border-white/5 px-8 py-4 flex items-center justify-between glass-strong">
          <button
            onClick={() => (step === "campaign" ? router.push("/campaigns") : back())}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-ink-200 hover:text-white hover:bg-white/5"
          >
            <ArrowLeft className="h-4 w-4" />
            {step === "campaign" ? "Back to campaigns" : "Back"}
          </button>
          <div className="text-[11px] text-ink-300">
            Step {stepIdx + 1} of {STEPS.length} · one decision at a time
          </div>
          {step === "publish" ? (
            <button
              onClick={publish}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-br from-brand-500 to-accent-cyan text-ink-950 text-sm font-semibold shadow-glow hover:brightness-110"
            >
              <Send className="h-4 w-4" />
              {schedule === "now" ? "Publish now" : "Schedule"}
            </button>
          ) : (
            <button
              disabled={!canNext}
              onClick={next}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition",
                canNext
                  ? "bg-white text-ink-950 hover:bg-white/90"
                  : "bg-white/10 text-ink-300 cursor-not-allowed",
              )}
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function StepCampaign({
  name,
  setName,
  objective,
  setObjective,
}: {
  name: string;
  setName: (v: string) => void;
  objective: Objective;
  setObjective: (o: Objective) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-gradient">
          Start a new campaign
        </h1>
        <p className="text-ink-200 mt-1 text-sm">
          Name it, pick an objective. We'll adapt everything else.
        </p>
      </div>
      <Field label="Campaign name">
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Summer Capsule Drop"
          className="w-full px-3.5 py-3 rounded-xl bg-white/[0.04] border border-white/10 focus:border-brand-400 focus:bg-white/[0.06] outline-none text-white placeholder:text-ink-300"
        />
      </Field>
      <Field label="Objective">
        <div className="grid grid-cols-3 gap-3">
          {OBJECTIVES.map((o) => {
            const Icon = o.icon;
            const active = objective === o.key;
            return (
              <button
                key={o.key}
                onClick={() => setObjective(o.key)}
                className={cn(
                  "text-left p-4 rounded-xl border transition-all",
                  active
                    ? "border-brand-400/60 bg-brand-500/10 shadow-glow"
                    : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05]",
                )}
              >
                <Icon className={cn("h-5 w-5 mb-2", active ? "text-brand-300" : "text-ink-200")} />
                <div className="font-semibold text-[14px]">{o.label}</div>
                <div className="text-[11px] text-ink-300 mt-0.5">{o.description}</div>
              </button>
            );
          })}
        </div>
      </Field>
      <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02]">
        <div className="text-[11px] uppercase tracking-widest text-brand-300 mb-1.5">
          Why this matters
        </div>
        <div className="text-[13px] text-ink-100 leading-relaxed">
          Objective shapes pacing, creative guidance, and which placements get emphasis — from
          organic social to OTT, display, and mobile networks.
        </div>
      </div>
    </div>
  );
}

function StepContent({
  image,
  setImage,
  topic,
  setTopic,
  caption,
  setCaption,
  variations,
  setVariations,
  activeVariation,
  setActiveVariation,
  regenerate,
  shuffleImage,
}: {
  image: string;
  setImage: (v: string) => void;
  topic: string;
  setTopic: (v: string) => void;
  caption: string;
  setCaption: (v: string) => void;
  variations: { tone: string; caption: string }[];
  setVariations: (v: { tone: string; caption: string }[]) => void;
  activeVariation: number;
  setActiveVariation: (n: number) => void;
  regenerate: () => void;
  shuffleImage: () => void;
}) {
  return (
    <div className="space-y-5">
      <h2 className="font-display text-2xl font-semibold tracking-tight">Create content</h2>
      <Field label="Image">
        <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black/30 aspect-[4/5] max-h-[300px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="" className="h-full w-full object-cover" />
          <div className="absolute top-2 right-2 flex gap-2">
            <button
              onClick={shuffleImage}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-black/60 backdrop-blur border border-white/15 text-[11px] font-semibold hover:bg-black/80"
            >
              <Shuffle className="h-3 w-3" /> Swap
            </button>
            <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-gradient-to-br from-brand-500 to-accent-cyan text-ink-950 text-[11px] font-semibold">
              <Wand2 className="h-3 w-3" /> Generate
            </button>
          </div>
        </div>
      </Field>
      <Field label="Topic · for AI caption">
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="What is this content about?"
          className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:border-brand-400 outline-none"
        />
      </Field>
      <Field label="Caption variations">
        <div className="space-y-2">
          {variations.map((v, i) => {
            const active = i === activeVariation;
            return (
              <button
                key={i}
                onClick={() => setActiveVariation(i)}
                className={cn(
                  "w-full text-left p-3 rounded-xl border transition",
                  active
                    ? "border-brand-400/60 bg-brand-500/10"
                    : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05]",
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="text-[10px] uppercase tracking-widest text-brand-300">
                    {v.tone}
                  </div>
                  {active && (
                    <div className="text-[10px] text-ink-300">active</div>
                  )}
                </div>
                <div className="text-[13px] leading-snug">{v.caption}</div>
              </button>
            );
          })}
          <button
            onClick={regenerate}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-dashed border-white/15 text-[12px] text-ink-200 hover:bg-white/[0.03] hover:text-white"
          >
            <Wand2 className="h-3.5 w-3.5" />
            Regenerate with AI
          </button>
        </div>
      </Field>
      <Field label="Caption (editable)">
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          rows={3}
          className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:border-brand-400 outline-none resize-none"
        />
      </Field>
    </div>
  );
}

function StepPreview({
  selectedPlatforms,
  setSelectedPlatforms,
  adPlatforms,
  setAdPlatforms,
}: {
  selectedPlatforms: PlatformKey[];
  setSelectedPlatforms: (v: PlatformKey[]) => void;
  adPlatforms: Record<PlatformKey, boolean>;
  setAdPlatforms: (v: Record<PlatformKey, boolean>) => void;
}) {
  function toggle(p: PlatformKey) {
    setSelectedPlatforms(
      selectedPlatforms.includes(p)
        ? selectedPlatforms.filter((x) => x !== p)
        : [...selectedPlatforms, p],
    );
  }
  function toggleAd(p: PlatformKey) {
    setAdPlatforms({ ...adPlatforms, [p]: !adPlatforms[p] });
  }
  return (
    <div className="space-y-5">
      <h2 className="font-display text-2xl font-semibold tracking-tight">Choose surfaces</h2>
      <p className="text-[13px] text-ink-200 -mt-3">
        Pick where this single content object will appear — organic or paid. You can flip the ad
        toggle any time.
      </p>
      <div className="grid grid-cols-2 gap-2.5">
        {ALL_PLATFORMS.map((p) => (
          <PlatformChip
            key={p}
            platform={p}
            selected={selectedPlatforms.includes(p)}
            onClick={() => toggle(p)}
            showDescription
          />
        ))}
      </div>
      {selectedPlatforms.length > 0 && (
        <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02]">
          <div className="text-[11px] uppercase tracking-widest text-ink-300 mb-2">
            Organic ↔ Paid
          </div>
          <div className="space-y-1.5">
            {selectedPlatforms.map((p) => (
              <div key={p} className="flex items-center justify-between text-[13px]">
                <span className="text-ink-100">{PLATFORM_MAP[p].label}</span>
                <button
                  onClick={() => toggleAd(p)}
                  className={cn(
                    "relative h-6 w-11 rounded-full transition",
                    adPlatforms[p] ? "bg-brand-500" : "bg-white/10",
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all",
                      adPlatforms[p] ? "left-[22px]" : "left-0.5",
                    )}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StepPublish({
  name,
  schedule,
  setSchedule,
  selectedPlatforms,
  adPlatforms,
  budget,
  setBudget,
  duration,
  setDuration,
}: {
  name: string;
  schedule: "now" | "later";
  setSchedule: (v: "now" | "later") => void;
  selectedPlatforms: PlatformKey[];
  adPlatforms: Record<PlatformKey, boolean>;
  budget: number;
  setBudget: (n: number) => void;
  duration: number;
  setDuration: (n: number) => void;
}) {
  const anyAd = selectedPlatforms.some((p) => adPlatforms[p]);
  return (
    <div className="space-y-5">
      <h2 className="font-display text-2xl font-semibold tracking-tight">Publish</h2>
      <p className="text-[13px] text-ink-200 -mt-3">
        Review, schedule, and ship. You can always come back to edit in the canvas.
      </p>
      <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-ink-300">Campaign</div>
            <div className="text-[15px] font-semibold">{name || "Untitled"}</div>
          </div>
          <div className="flex -space-x-1">
            {selectedPlatforms.map((p) => (
              <div
                key={p}
                className="h-7 w-7 rounded-lg ring-2 ring-ink-800 grid place-items-center text-[10px] font-bold text-white"
                style={{ backgroundImage: PLATFORM_MAP[p].gradient }}
              >
                {PLATFORM_MAP[p].icon}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Field label="When">
        <div className="grid grid-cols-2 gap-3">
          {(["now", "later"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSchedule(s)}
              className={cn(
                "p-4 rounded-xl border text-left transition",
                schedule === s
                  ? "border-brand-400/60 bg-brand-500/10 shadow-glow"
                  : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05]",
              )}
            >
              <div className="flex items-center gap-2">
                {s === "now" ? (
                  <Zap className="h-4 w-4 text-accent-cyan" />
                ) : (
                  <Calendar className="h-4 w-4 text-brand-300" />
                )}
                <div className="font-semibold text-[14px]">
                  {s === "now" ? "Publish now" : "Schedule"}
                </div>
              </div>
              <div className="text-[11px] text-ink-300 mt-0.5">
                {s === "now" ? "Ship immediately across surfaces" : "Pick a time in the canvas"}
              </div>
            </button>
          ))}
        </div>
      </Field>
      {anyAd && (
        <div className="p-4 rounded-xl border border-brand-400/30 bg-brand-500/[0.06] space-y-3">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-brand-300" />
            <div className="text-[13px] font-semibold">Ad settings</div>
            <div className="ml-auto text-[11px] text-ink-300">
              Applied to paid placements
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Total budget">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300 text-[13px]">$</span>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(+e.target.value)}
                  className="w-full pl-7 pr-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/10 focus:border-brand-400 outline-none"
                />
              </div>
            </Field>
            <Field label="Duration (days)">
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(+e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/10 focus:border-brand-400 outline-none"
              />
            </Field>
          </div>
        </div>
      )}
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
