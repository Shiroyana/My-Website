import "server-only";
import { headers } from "next/headers";
import { allow } from "./rate-limit";

/**
 * Shared plumbing for the site's forms (audit request, case-study volunteer): the visitor's IP for
 * the rate limit, and forwarding a validated submission to Netlify Forms. Each form is registered by
 * name in public/__forms.html so Netlify detects it at deploy time.
 */

export async function rateLimited(): Promise<boolean> {
  const h = await headers();
  const ip =
    h.get("x-nf-client-connection-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "";
  return !(await allow(ip));
}

/**
 * Posts the fields to Netlify Forms. Returns "sent", "dry-run" (local runs, nothing sent) or
 * "failed". Netlify sets URL (production) and DEPLOY_PRIME_URL (previews) at runtime.
 */
export async function forwardToNetlify(
  formName: string,
  data: Record<string, string>,
): Promise<"sent" | "dry-run" | "failed"> {
  const base = process.env.DEPLOY_PRIME_URL ?? process.env.URL;
  if (!base) {
    if (process.env.NODE_ENV !== "production" || process.env.AUDIT_FORM_DRY_RUN === "1") {
      console.info(`[${formName}] local submission (not sent):`, data);
      return "dry-run";
    }
    return "failed";
  }
  try {
    const res = await fetch(`${base}/__forms.html`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ "form-name": formName, ...data }).toString(),
      cache: "no-store",
    });
    return res.ok ? "sent" : "failed";
  } catch {
    return "failed";
  }
}

/** First error per field, plus the status line that counts them. */
export function fieldErrors<F extends string>(issues: { path: PropertyKey[]; message: string }[]) {
  const errors: Partial<Record<F, string>> = {};
  for (const issue of issues) {
    const field = issue.path[0] as F;
    if (!errors[field]) errors[field] = issue.message;
  }
  const n = Object.keys(errors).length;
  return { errors, message: n === 1 ? "One field needs fixing." : `${n} fields need fixing.` };
}
