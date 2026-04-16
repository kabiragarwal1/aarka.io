"use client";

import type { PlatformKey } from "@/lib/types";
import { InstagramPreview } from "./Instagram";
import { TikTokPreview } from "./TikTok";
import { YouTubePreview } from "./YouTube";
import { OTTPreview } from "./OTT";
import { DisplayPreview } from "./Display";
import { NetworkPreview } from "./Network";
import { MobileAppPreview } from "./MobileApp";

export interface PreviewProps {
  image: string;
  caption: string;
  handle?: string;
  isAd?: boolean;
}

export function PlatformPreview({
  platform,
  ...props
}: PreviewProps & { platform: PlatformKey }) {
  switch (platform) {
    case "instagram":
      return <InstagramPreview {...props} />;
    case "tiktok":
      return <TikTokPreview {...props} />;
    case "youtube":
      return <YouTubePreview {...props} />;
    case "ott":
      return <OTTPreview {...props} isAd />;
    case "display":
      return <DisplayPreview {...props} />;
    case "network":
      return <NetworkPreview {...props} />;
    case "mobile":
      return <MobileAppPreview {...props} />;
  }
}

export {
  InstagramPreview,
  TikTokPreview,
  YouTubePreview,
  OTTPreview,
  DisplayPreview,
  NetworkPreview,
  MobileAppPreview,
};
