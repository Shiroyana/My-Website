import "server-only";
import { createHash } from "node:crypto";

/**
 * A small fixed-window rate limiter for form posts: `limit` sends per `windowMs` per visitor.
 * On Netlify it keeps counts in Netlify Blobs (free, shared by every function instance); locally it
 * falls back to memory. Visitor IPs are never stored, only a salted hash.
 */

const memory = new Map<string, { count: number; reset: number }>();

function key(ip: string) {
  const salt = process.env.RATE_LIMIT_SALT ?? "cambi-local-salt";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}

export async function allow(ip: string, limit = 5, windowMs = 60 * 60 * 1000): Promise<boolean> {
  const id = key(ip || "unknown");
  const now = Date.now();

  if (process.env.NETLIFY || process.env.NETLIFY_BLOBS_CONTEXT) {
    try {
      const { getStore } = await import("@netlify/blobs");
      const store = getStore({ name: "form-rate-limit", consistency: "strong" });
      const entry = (await store.get(id, { type: "json" })) as {
        count: number;
        reset: number;
      } | null;
      const next =
        entry && entry.reset > now
          ? { count: entry.count + 1, reset: entry.reset }
          : { count: 1, reset: now + windowMs };
      await store.setJSON(id, next);
      return next.count <= limit;
    } catch {
      // Blobs unavailable: fall through to memory rather than block real leads
    }
  }

  const entry = memory.get(id);
  const next =
    entry && entry.reset > now
      ? { count: entry.count + 1, reset: entry.reset }
      : { count: 1, reset: now + windowMs };
  memory.set(id, next);
  return next.count <= limit;
}
