"use server";

import { redirect } from "next/navigation";
import { FORM_NAME, auditSchema, type AuditField, type AuditState } from "@/lib/audit";
import { fieldErrors, forwardToNetlify, rateLimited } from "@/lib/forms";

const FIELDS: AuditField[] = ["business", "trade", "borough", "website", "phone", "email"];

/**
 * Validates the audit request on the server, drops bots (honeypot), rate-limits by a hashed IP, then
 * forwards the submission to Netlify Forms (form "audit-request"), so it lands in the Netlify
 * dashboard and its email notifications. Success redirects to the thank-you page, which only a real
 * send reaches.
 */
export async function requestAudit(_prev: AuditState, formData: FormData): Promise<AuditState> {
  const values = Object.fromEntries(
    FIELDS.map((f) => [f, String(formData.get(f) ?? "")]),
  ) as Record<AuditField, string>;

  // Honeypot: people never see or fill this field. Pretend success so bots learn nothing.
  if (String(formData.get("bot-field") ?? "").trim() !== "") redirect("/audit/thanks");

  const parsed = auditSchema.safeParse(values);
  if (!parsed.success) {
    return { status: "invalid", ...fieldErrors<AuditField>(parsed.error.issues), values };
  }

  if (await rateLimited()) {
    return {
      status: "error",
      message: "Too many requests from this connection. Please try again in an hour, or email us.",
      values,
    };
  }

  const result = await forwardToNetlify(FORM_NAME, parsed.data);
  if (result === "failed") {
    return {
      status: "error",
      message:
        "We could not send your request just now. Please try again, or email getcambi@gmail.com.",
      values,
    };
  }

  redirect("/audit/thanks");
}
