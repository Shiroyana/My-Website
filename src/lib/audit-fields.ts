/**
 * The audit form's field names and choices, with no validation library, so the browser bundle
 * stays small. Validation (zod) lives in audit.ts and runs on the server only.
 */
import { site } from "./site";

export const TRADES = ["HVAC", "Plumbing", "Electrical", "More than one"] as const;
export const BOROUGHS = [...site.boroughs, "Outside NYC"] as const;

export type AuditField = "business" | "trade" | "borough" | "website" | "phone" | "email";

export type AuditState = {
  status: "idle" | "invalid" | "error";
  message?: string;
  errors?: Partial<Record<AuditField, string>>;
  values?: Partial<Record<AuditField, string>>;
};

export const FORM_NAME = "audit-request";
