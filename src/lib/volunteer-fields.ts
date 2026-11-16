/**
 * The case-study volunteer form's fields, with no validation library, so the browser bundle stays
 * small. Validation (zod) lives in volunteer.ts and runs on the server only.
 */
export { BOROUGHS, TRADES } from "./audit-fields";

export type VolunteerField = "name" | "business" | "trade" | "borough" | "email" | "publish";

export type VolunteerState = {
  status: "idle" | "invalid" | "error";
  message?: string;
  errors?: Partial<Record<VolunteerField, string>>;
  values?: Partial<Record<VolunteerField, string>>;
};

export const VOLUNTEER_FORM_NAME = "case-study-volunteer";
