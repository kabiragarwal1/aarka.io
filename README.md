# aarka.io — AI Media OS

A **unified media operating system** prototype for content, publishing, and ads —
a visual, AI-native workspace where content flows into distribution and performance
loops back into creation.

> Not a tool. Not a dashboard. **A system.**

## Core principle

Everything is built on a **Content Object System** — a single piece of content can be
an organic post, a paid ad, and published across many platforms simultaneously.
Content isn't duplicated; it's **reused, transformed, and extended**.

## The primary user flow (works end-to-end)

1. **Create Campaign** → name + objective (Awareness / Engagement / Sales)
2. **Content Creation Flow** → upload/generate image, AI caption variations
3. **Live Multi-Platform Preview** → Instagram · TikTok · YouTube · OTT · Display · Networks · Mobile
4. **Select surfaces** → organic or paid (toggle per platform)
5. **Publish now or schedule** → lands in the **Canvas**
6. **Canvas workspace** → all content as visual nodes, drag to platforms to publish,
   click **Promote to Ad** to interchange organic ↔ paid
7. **Insights Mode** → performance attaches to each node

## Surfaces supported

Instagram · TikTok · YouTube · OTT / CTV · Display · Ad Networks (programmatic) · Mobile Apps

## Tech

- **Next.js 14** (App Router) + **React 18** + **TypeScript**
- **Tailwind CSS** for styling
- **Zustand** (with `persist`) for local state — no backend required
- All platform previews are hand-built mock surfaces
- Infinite canvas with drag-to-publish built from scratch (no canvas library)

## Quick start

```bash
npm install
npm run dev
# open http://localhost:3000
```

### Also available

```bash
npm run build      # production build
npm run typecheck  # TypeScript check
```

## Navigation

| Route                | Purpose                                          |
| -------------------- | ------------------------------------------------ |
| `/`                  | Dashboard — light overview                       |
| `/campaigns`         | Campaigns list                                   |
| `/campaigns/new`     | **Flow-based campaign builder** (wizard)         |
| `/canvas`            | **Content-centric canvas** — main workspace     |
| `/content`           | Content object library                           |

## Canvas interactions

- **Drag a content card** to move it around the canvas
- **Drag the → handle** (or `Alt/⌥ + drag` from a card) to a platform to publish
- **Click a card** → opens the right-hand inspector (caption, variations, platforms, ad toggle)
- **Promote to Ad** → one-click interchangeability modal (budget + duration)
- **Canvas ↔ Insights** toggle in the top bar overlays performance on every node
- **Ctrl/⌘ + wheel** to zoom · drag empty background to pan

## What's deliberately excluded (prototype scope)

- No real API integrations
- No real-time bidding / advanced media planning
- No inbox / engagement system

## Repo layout

```
app/                 # Next.js app router — pages
  page.tsx           # Dashboard
  campaigns/         # List + flow-based builder
  canvas/            # Main visual workspace
  content/           # Content library
components/
  Shell.tsx          # Sidebar + top bar
  canvas/            # Canvas, ContentNode, PlatformNode
  previews/          # IG · TikTok · YouTube · OTT · Display · Network · MobileApp
  InspectorPanel.tsx # Right panel
  InsightsOverlay.tsx
  PromoteToAdModal.tsx
lib/
  store.ts           # Zustand store (persisted)
  types.ts           # Content, Campaign, Placement
  platforms.ts       # Platform metadata
  mock.ts            # Seed data
```

## Legacy Python scaffold

The earlier Python scaffold lives under `src/media_management/` and can still be
exercised via:

```bash
PYTHONPATH=src python -m pytest -q
```

It's kept for reference — the active prototype is the Next.js app.
