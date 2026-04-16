import type { PlatformKey } from "./types";

export interface PlatformMeta {
  key: PlatformKey;
  label: string;
  group: "social" | "video" | "ott" | "display" | "network" | "app";
  accent: string; // tailwind color
  gradient: string; // css gradient
  icon: string; // emoji-ish monogram
  description: string;
  surface: string; // what it renders as
}

export const PLATFORMS: PlatformMeta[] = [
  {
    key: "instagram",
    label: "Instagram",
    group: "social",
    accent: "#ff5acf",
    gradient: "linear-gradient(135deg,#feda75 0%,#fa7e1e 25%,#d62976 50%,#962fbf 75%,#4f5bd5 100%)",
    icon: "Ig",
    description: "Feed · Reels · Stories",
    surface: "Feed card",
  },
  {
    key: "tiktok",
    label: "TikTok",
    group: "video",
    accent: "#29e5d6",
    gradient: "linear-gradient(135deg,#25F4EE 0%,#000000 50%,#FE2C55 100%)",
    icon: "Tk",
    description: "9:16 short video",
    surface: "For You",
  },
  {
    key: "youtube",
    label: "YouTube",
    group: "video",
    accent: "#ff3d3d",
    gradient: "linear-gradient(135deg,#ff3d3d 0%,#8b0000 100%)",
    icon: "Yt",
    description: "Shorts · Long-form · Pre-roll",
    surface: "Thumbnail",
  },
  {
    key: "ott",
    label: "OTT / CTV",
    group: "ott",
    accent: "#8b6cff",
    gradient: "linear-gradient(135deg,#0f0c29 0%,#302b63 50%,#24243e 100%)",
    icon: "Tv",
    description: "Hulu · Roku · Samsung Ads",
    surface: "Connected TV spot",
  },
  {
    key: "display",
    label: "Display",
    group: "display",
    accent: "#c6ff5a",
    gradient: "linear-gradient(135deg,#3a1c71 0%,#d76d77 50%,#ffaf7b 100%)",
    icon: "Dp",
    description: "Banner · Native · Rich media",
    surface: "300x250 · 728x90",
  },
  {
    key: "network",
    label: "Ad Networks",
    group: "network",
    accent: "#ff8a3b",
    gradient: "linear-gradient(135deg,#ff8a3b 0%,#7043ff 100%)",
    icon: "Nx",
    description: "Google · The Trade Desk · DV360",
    surface: "Programmatic placements",
  },
  {
    key: "mobile",
    label: "Mobile Apps",
    group: "app",
    accent: "#29e5d6",
    gradient: "linear-gradient(135deg,#43cea2 0%,#185a9d 100%)",
    icon: "Mo",
    description: "Interstitial · Rewarded · Native",
    surface: "In-app placements",
  },
];

export const PLATFORM_MAP: Record<PlatformKey, PlatformMeta> = Object.fromEntries(
  PLATFORMS.map((p) => [p.key, p]),
) as Record<PlatformKey, PlatformMeta>;
