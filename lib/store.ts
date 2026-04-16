"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Campaign,
  ContentObject,
  Objective,
  PlatformKey,
  PlatformNodePos,
  PlatformPlacement,
  PublishState,
} from "./types";
import { INITIAL_DATA, emptyContent, newCampaign } from "./mock";
import { fakeMetrics, uid } from "./utils";

interface State {
  campaigns: Campaign[];
  content: ContentObject[];
  platformPositions: PlatformNodePos[];
  activeCampaignId: string | null;
  insightsMode: boolean;
  selectedContentId: string | null;

  // campaign
  createCampaign: (name: string, objective: Objective) => Campaign;
  setActiveCampaign: (id: string | null) => void;

  // content
  addContent: (c?: Partial<ContentObject>) => ContentObject;
  updateContent: (id: string, patch: Partial<ContentObject>) => void;
  duplicateContent: (id: string) => ContentObject | null;
  removeContent: (id: string) => void;
  setActiveVersion: (id: string, versionId: string) => void;
  addVersion: (id: string, caption: string, tone?: string) => void;
  selectContent: (id: string | null) => void;
  moveContent: (id: string, x: number, y: number) => void;

  // publishing / ads
  publishTo: (contentId: string, platform: PlatformKey, when: "now" | "schedule") => void;
  unpublish: (contentId: string, platform: PlatformKey) => void;
  promoteToAd: (
    contentId: string,
    platform: PlatformKey,
    budget: number,
    durationDays: number,
  ) => void;
  demoteAd: (contentId: string, platform: PlatformKey) => void;

  // canvas
  movePlatform: (platform: PlatformKey, x: number, y: number) => void;
  toggleInsights: () => void;

  // reset (for demo)
  resetAll: () => void;
}

export const useMediaOS = create<State>()(
  persist(
    (set, get) => ({
      ...INITIAL_DATA,
      insightsMode: false,
      selectedContentId: null,

      createCampaign: (name, objective) => {
        const c = newCampaign(name, objective);
        set((s) => ({
          campaigns: [c, ...s.campaigns],
          activeCampaignId: c.id,
        }));
        return c;
      },
      setActiveCampaign: (id) => set({ activeCampaignId: id }),

      addContent: (partial) => {
        const base = emptyContent(get().activeCampaignId ?? undefined);
        const c: ContentObject = { ...base, ...partial };
        set((s) => ({
          content: [...s.content, c],
          campaigns: s.campaigns.map((k) =>
            k.id === c.campaignId ? { ...k, contentIds: [...k.contentIds, c.id] } : k,
          ),
          selectedContentId: c.id,
        }));
        return c;
      },
      updateContent: (id, patch) =>
        set((s) => ({
          content: s.content.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        })),
      duplicateContent: (id) => {
        const c = get().content.find((x) => x.id === id);
        if (!c) return null;
        const copy: ContentObject = {
          ...c,
          id: uid("c"),
          title: c.title + " · variation",
          x: c.x + 40,
          y: c.y + 60,
          placements: [],
          createdAt: new Date().toISOString(),
          versions: c.versions.map((v) => ({ ...v, id: uid("v") })),
        };
        copy.activeVersionId = copy.versions[0]?.id ?? "v1";
        set((s) => ({
          content: [...s.content, copy],
          campaigns: s.campaigns.map((k) =>
            k.id === copy.campaignId ? { ...k, contentIds: [...k.contentIds, copy.id] } : k,
          ),
          selectedContentId: copy.id,
        }));
        return copy;
      },
      removeContent: (id) =>
        set((s) => ({
          content: s.content.filter((c) => c.id !== id),
          campaigns: s.campaigns.map((k) => ({
            ...k,
            contentIds: k.contentIds.filter((cid) => cid !== id),
          })),
          selectedContentId: s.selectedContentId === id ? null : s.selectedContentId,
        })),
      setActiveVersion: (id, versionId) =>
        set((s) => ({
          content: s.content.map((c) => {
            if (c.id !== id) return c;
            const v = c.versions.find((v) => v.id === versionId);
            return {
              ...c,
              activeVersionId: versionId,
              caption: v?.caption ?? c.caption,
            };
          }),
        })),
      addVersion: (id, caption, tone) =>
        set((s) => ({
          content: s.content.map((c) =>
            c.id === id
              ? {
                  ...c,
                  versions: [...c.versions, { id: uid("v"), caption, tone }],
                }
              : c,
          ),
        })),
      selectContent: (id) => set({ selectedContentId: id }),
      moveContent: (id, x, y) =>
        set((s) => ({
          content: s.content.map((c) => (c.id === id ? { ...c, x, y } : c)),
        })),

      publishTo: (contentId, platform, when) =>
        set((s) => ({
          content: s.content.map((c) => {
            if (c.id !== contentId) return c;
            const existing = c.placements.find((p) => p.platform === platform);
            const state: PublishState = when === "schedule" ? "scheduled" : "live";
            const newPlacement: PlatformPlacement = existing
              ? {
                  ...existing,
                  state,
                  scheduledAt:
                    when === "schedule"
                      ? new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString()
                      : undefined,
                  metrics:
                    state === "live"
                      ? existing.metrics ?? fakeMetrics(c.id + platform, existing.isAd)
                      : existing.metrics,
                }
              : {
                  platform,
                  state,
                  isAd: false,
                  scheduledAt:
                    when === "schedule"
                      ? new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString()
                      : undefined,
                  metrics: state === "live" ? fakeMetrics(c.id + platform, false) : undefined,
                };
            const placements = existing
              ? c.placements.map((p) => (p.platform === platform ? newPlacement : p))
              : [...c.placements, newPlacement];
            return { ...c, placements };
          }),
        })),
      unpublish: (contentId, platform) =>
        set((s) => ({
          content: s.content.map((c) =>
            c.id === contentId
              ? { ...c, placements: c.placements.filter((p) => p.platform !== platform) }
              : c,
          ),
        })),
      promoteToAd: (contentId, platform, budget, durationDays) =>
        set((s) => ({
          content: s.content.map((c) => {
            if (c.id !== contentId) return c;
            const existing = c.placements.find((p) => p.platform === platform);
            const updated: PlatformPlacement = existing
              ? {
                  ...existing,
                  isAd: true,
                  budget,
                  durationDays,
                  state: "live",
                  metrics: fakeMetrics(c.id + platform + "_ad", true),
                }
              : {
                  platform,
                  state: "live",
                  isAd: true,
                  budget,
                  durationDays,
                  metrics: fakeMetrics(c.id + platform + "_ad", true),
                };
            const placements = existing
              ? c.placements.map((p) => (p.platform === platform ? updated : p))
              : [...c.placements, updated];
            return { ...c, placements };
          }),
        })),
      demoteAd: (contentId, platform) =>
        set((s) => ({
          content: s.content.map((c) => {
            if (c.id !== contentId) return c;
            return {
              ...c,
              placements: c.placements.map((p) =>
                p.platform === platform
                  ? {
                      ...p,
                      isAd: false,
                      budget: undefined,
                      durationDays: undefined,
                      metrics: fakeMetrics(c.id + platform, false),
                    }
                  : p,
              ),
            };
          }),
        })),

      movePlatform: (platform, x, y) =>
        set((s) => ({
          platformPositions: s.platformPositions.map((p) =>
            p.platform === platform ? { ...p, x, y } : p,
          ),
        })),

      toggleInsights: () => set((s) => ({ insightsMode: !s.insightsMode })),

      resetAll: () =>
        set({
          ...INITIAL_DATA,
          insightsMode: false,
          selectedContentId: null,
        }),
    }),
    {
      name: "aarka-media-os",
      version: 1,
    },
  ),
);
