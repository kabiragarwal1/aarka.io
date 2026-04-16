import type { Campaign, ContentObject, PlatformKey, PlatformNodePos } from "./types";
import { fakeMetrics, uid } from "./utils";

// Demo images — served via picsum with stable seeds
const img = (seed: string, w = 800, h = 1000) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;

const now = () => new Date().toISOString();

const campaign1: Campaign = {
  id: "camp_summer_drop",
  name: "Summer Capsule Drop",
  objective: "awareness",
  contentIds: ["c_hero", "c_lifestyle", "c_closeup"],
  createdAt: now(),
  status: "active",
};

const campaign2: Campaign = {
  id: "camp_back_to_school",
  name: "Back to School — Conversions",
  objective: "sales",
  contentIds: ["c_student"],
  createdAt: now(),
  status: "draft",
};

const content: ContentObject[] = [
  {
    id: "c_hero",
    title: "Hero shot · Ocean Teal",
    image: img("hero-ocean", 900, 1100),
    caption:
      "New summer. New story. The Ocean Teal capsule drops Friday — crafted for long days, warm nights, and everything in between. ✨",
    versions: [
      { id: "v1", caption: "New summer. New story. Ocean Teal capsule drops Friday.", tone: "Warm" },
      { id: "v2", caption: "Meet Ocean Teal. Crafted for long days & warm nights. Friday.", tone: "Punchy" },
      { id: "v3", caption: "Friday. Ocean Teal. Nothing else to say.", tone: "Minimal" },
    ],
    activeVersionId: "v1",
    placements: [
      {
        platform: "instagram",
        state: "live",
        isAd: false,
        metrics: fakeMetrics("c_hero_ig"),
      },
      {
        platform: "tiktok",
        state: "live",
        isAd: false,
        metrics: fakeMetrics("c_hero_tt"),
      },
      {
        platform: "ott",
        state: "scheduled",
        isAd: true,
        budget: 1200,
        durationDays: 14,
        scheduledAt: now(),
        metrics: fakeMetrics("c_hero_ott", true),
      },
    ],
    campaignId: campaign1.id,
    createdAt: now(),
    x: 120,
    y: 140,
    tags: ["hero", "launch"],
  },
  {
    id: "c_lifestyle",
    title: "Lifestyle · Coastal",
    image: img("lifestyle-coastal", 900, 1100),
    caption:
      "Linen mornings, salt in your hair. The capsule was built for this feeling.",
    versions: [
      { id: "v1", caption: "Linen mornings, salt in your hair.", tone: "Poetic" },
      { id: "v2", caption: "Built for the coast. Worn everywhere.", tone: "Direct" },
    ],
    activeVersionId: "v1",
    placements: [
      { platform: "instagram", state: "live", isAd: false, metrics: fakeMetrics("c_life_ig") },
      { platform: "youtube", state: "live", isAd: false, metrics: fakeMetrics("c_life_yt") },
      {
        platform: "display",
        state: "live",
        isAd: true,
        budget: 480,
        durationDays: 10,
        metrics: fakeMetrics("c_life_dp", true),
      },
    ],
    campaignId: campaign1.id,
    createdAt: now(),
    x: 480,
    y: 360,
    tags: ["lifestyle"],
  },
  {
    id: "c_closeup",
    title: "Product · Stitch detail",
    image: img("closeup-stitch", 900, 900),
    caption: "Hand-finished in Porto. 38 stitches per inch. You'll feel it.",
    versions: [
      { id: "v1", caption: "Hand-finished in Porto. 38 stitches per inch.", tone: "Crafted" },
    ],
    activeVersionId: "v1",
    placements: [
      { platform: "instagram", state: "scheduled", isAd: false, scheduledAt: now() },
    ],
    campaignId: campaign1.id,
    createdAt: now(),
    x: 820,
    y: 180,
    tags: ["product"],
  },
  {
    id: "c_student",
    title: "BTS · Student moment",
    image: img("back-to-school", 900, 1100),
    caption: "Packs that carry more than books. 20% off this week only.",
    versions: [
      { id: "v1", caption: "Packs that carry more than books.", tone: "Warm" },
      { id: "v2", caption: "20% off. This week only. Built to last.", tone: "Promo" },
    ],
    activeVersionId: "v2",
    placements: [
      {
        platform: "network",
        state: "live",
        isAd: true,
        budget: 2400,
        durationDays: 21,
        metrics: fakeMetrics("c_student_nw", true),
      },
      {
        platform: "mobile",
        state: "live",
        isAd: true,
        budget: 900,
        durationDays: 14,
        metrics: fakeMetrics("c_student_mo", true),
      },
    ],
    campaignId: campaign2.id,
    createdAt: now(),
    x: 200,
    y: 620,
    tags: ["promo", "seasonal"],
  },
];

// Positions for platform nodes on the canvas — placed around content cluster
const platformPositions: PlatformNodePos[] = [
  { platform: "instagram", x: 1180, y: 120 },
  { platform: "tiktok", x: 1180, y: 270 },
  { platform: "youtube", x: 1180, y: 420 },
  { platform: "ott", x: 1180, y: 570 },
  { platform: "display", x: 1400, y: 120 },
  { platform: "network", x: 1400, y: 270 },
  { platform: "mobile", x: 1400, y: 420 },
];

export const INITIAL_DATA = {
  campaigns: [campaign1, campaign2] as Campaign[],
  content,
  activeCampaignId: campaign1.id as string | null,
  platformPositions,
};

export function emptyContent(campaignId?: string): ContentObject {
  const id = uid("c");
  return {
    id,
    title: "Untitled content",
    image: img("draft-" + id, 900, 1100),
    caption: "",
    versions: [{ id: "v1", caption: "" }],
    activeVersionId: "v1",
    placements: [],
    campaignId,
    createdAt: now(),
    x: 300 + Math.random() * 300,
    y: 200 + Math.random() * 300,
    tags: [],
  };
}

export function newCampaign(
  name: string,
  objective: "awareness" | "engagement" | "sales",
): Campaign {
  return {
    id: uid("camp"),
    name,
    objective,
    contentIds: [],
    createdAt: now(),
    status: "draft",
  };
}

export const ALL_PLATFORMS: PlatformKey[] = [
  "instagram",
  "tiktok",
  "youtube",
  "ott",
  "display",
  "network",
  "mobile",
];
