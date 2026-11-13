"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { FORM_NAME, auditSchema, type AuditField, type AuditState } from "@/lib/audit";
import { allow } from "@/lib/rate-limit";

const FIELDS: AuditField[] = ["business", "trade", "borough", "website", "phone", "email"];

/**
 * Validates the audit request on the server, drops bots (honeypot), rate-limits by a hashed IP, then
 * forwards the submission to Netlify Forms (form "audit-request", registered by public/__forms.html),
 * so it lands in the Netlify dashboard and its email notifications. Success redirects to the thank-you
 * page, which only a real send reaches.
 */
export async function requestAudit(_prev: AuditState, formData: FormData): Promise<AuditState> {
  const values = Object.fromEntries(
    FIELDS.map((f) => [f, String(formData.get(f) ?? "")]),
  ) as Record<AuditField, string>;

  // Honeypot: people never see or fill this field. Pretend success so bots learn nothing.
  if (String(formData.get("bot-field") ?? "").trim() !== "") redirect("/audit/thanks");

  const parsed = auditSchema.safeParse(values);
  if (!parsed.success) {
    const errors: AuditState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as AuditField;
      if (!errors[field]) errors[field] = issue.message;
    }
    const n = Object.keys(errors).length;
    return {
      status: "invalid",
      message: n === 1 ? "One field needs fixing." : `${n} fields need fixing.`,
      errors,
      values,
    };
  }

  const h = await headers();
  const ip =
    h.get("x-nf-client-connection-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "";
  if (!(await allow(ip))) {
    return {
      status: "error",
      message: "Too many requests from this connection. Please try again in an hour, or email us.",
      values,
    };
  }

  const body = new URLSearchParams({ "form-name": FORM_NAME, ...parsed.data });

  // Netlify sets URL (production) and DEPLOY_PRIME_URL (previews) at runtime.
  const base = process.env.DEPLOY_PRIME_URL ?? process.env.URL;
  if (!base) {
    if (process.env.NODE_ENV !== "production" || process.env.AUDIT_FORM_DRY_RUN === "1") {
      console.info("[audit-request] local submission (not sent):", parsed.data);
      redirect("/audit/thanks");
    }
    return {
      status: "error",
      message: "We could not send your request just now. Please email getcambi@gmail.com.",
      values,
    };
  }

  let ok = false;
  try {
    const res = await fetch(`${base}/__forms.html`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
      cache: "no-store",
    });
    ok = res.ok;
  } catch {
    ok = false;
  }

  if (!ok) {
    return {
      status: "error",
      message:
        "We could not send your request just now. Please try again, or email getcambi@gmail.com.",
      values,
    };
  }

  redirect("/audit/thanks");
}
