export type PlatformKey =
  | "instagram"
  | "tiktok"
  | "youtube"
  | "ott"
  | "display"
  | "network"
  | "mobile";

export type Objective = "awareness" | "engagement" | "sales";

export type PublishState = "draft" | "scheduled" | "live";

export interface ContentVersion {
  id: string;
  caption: string;
  tone?: string;
}

export interface Metrics {
  impressions: number;
  engagement: number; // %
  clicks: number;
  ctr: number; // %
  spend?: number;
  conversions?: number;
}

export interface PlatformPlacement {
  platform: PlatformKey;
  state: PublishState;
  scheduledAt?: string; // ISO
  isAd: boolean;
  budget?: number;
  durationDays?: number;
  metrics?: Metrics;
}

export interface ContentObject {
  id: string;
  title: string;
  image: string; // URL
  caption: string;
  versions: ContentVersion[];
  activeVersionId: string;
  placements: PlatformPlacement[];
  campaignId?: string;
  createdAt: string;
  // canvas layout
  x: number;
  y: number;
  tags?: string[];
}

export interface Campaign {
  id: string;
  name: string;
  objective: Objective;
  contentIds: string[];
  createdAt: string;
  status: "draft" | "active" | "paused" | "ended";
}

export interface PlatformNodePos {
  platform: PlatformKey;
  x: number;
  y: number;
}

export interface Connection {
  id: string;
  contentId: string;
  platform: PlatformKey;
}
