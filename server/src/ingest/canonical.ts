// canonical.ts
const TRACKING = ["ref", "fbclid", "gclid"];

export function canonicalUrl(raw: string): string {
  const u = new URL(raw);
  u.hash = "";
  u.hostname = u.hostname.toLowerCase();
  for (const key of [...u.searchParams.keys()]) {
    if (key.startsWith("utm_") || TRACKING.includes(key)) u.searchParams.delete(key);
  }
  return u.toString().replace(/\/$/, "");
}