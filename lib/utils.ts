import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`;
}

export function formatNumber(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toString();
}

export function formatMoney(n: number) {
  return "$" + n.toLocaleString(undefined, { maximumFractionDigits: 0 });
}

export function truncate(s: string, n = 80) {
  if (!s) return "";
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

export function seededRandom(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = (h * 16777619) >>> 0;
  }
  return () => {
    h = (h * 48271) % 0x7fffffff;
    return (h & 0xffff) / 0xffff;
  };
}

export function fakeMetrics(seed: string, isAd = false) {
  const r = seededRandom(seed);
  const impressions = Math.floor(8000 + r() * (isAd ? 180000 : 40000));
  const engagement = +(1.2 + r() * (isAd ? 3.5 : 6.5)).toFixed(1);
  const clicks = Math.floor(impressions * (0.005 + r() * 0.04));
  const ctr = +((clicks / impressions) * 100).toFixed(2);
  const spend = isAd ? Math.floor(40 + r() * 900) : undefined;
  const conversions = isAd ? Math.floor(clicks * (0.02 + r() * 0.08)) : undefined;
  return { impressions, engagement, clicks, ctr, spend, conversions };
}
