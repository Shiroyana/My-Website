"use server";

import { redirect } from "next/navigation";
import { fieldErrors, forwardToNetlify, rateLimited } from "@/lib/forms";
import {
  VOLUNTEER_FORM_NAME,
  volunteerSchema,
  type VolunteerField,
  type VolunteerState,
} from "@/lib/volunteer";

const FIELDS: VolunteerField[] = ["name", "business", "trade", "borough", "email", "publish"];

/**
 * A shop owner volunteers their shop for a case study. Same path as the audit request: server-side
 * validation, honeypot, rate limit, then Netlify Forms (form "case-study-volunteer").
 */
export async function volunteerShop(
  _prev: VolunteerState,
  formData: FormData,
): Promise<VolunteerState> {
  const values = Object.fromEntries(
    FIELDS.map((f) => [f, String(formData.get(f) ?? "")]),
  ) as Record<VolunteerField, string>;

  if (String(formData.get("bot-field") ?? "").trim() !== "") redirect("/case-studies/thanks");

  const parsed = volunteerSchema.safeParse(values);
  if (!parsed.success) {
    return { status: "invalid", ...fieldErrors<VolunteerField>(parsed.error.issues), values };
  }

  if (await rateLimited()) {
    return {
      status: "error",
      message: "Too many requests from this connection. Please try again in an hour, or email us.",
      values,
    };
  }

  const result = await forwardToNetlify(VOLUNTEER_FORM_NAME, parsed.data);
  if (result === "failed") {
    return {
      status: "error",
      message: "We could not send this just now. Please try again, or email getcambi@gmail.com.",
      values,
    };
  }

  redirect("/case-studies/thanks");
}
