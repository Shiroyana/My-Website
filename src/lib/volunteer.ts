import "server-only";
import { z } from "zod";
import { BOROUGHS, TRADES } from "./audit-fields";

export {
  VOLUNTEER_FORM_NAME,
  type VolunteerField,
  type VolunteerState,
} from "./volunteer-fields";

/** Error messages name the field and say what to type (Taste system.md, Forms). */
export const volunteerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Write your name, so we know who to ask for.")
    .max(80, "Keep your name under 80 characters."),
  business: z
    .string()
    .trim()
    .min(2, "Write your business name as customers know it.")
    .max(120, "Keep the business name under 120 characters."),
  trade: z.enum(TRADES, { message: "Choose your trade." }),
  borough: z.enum(BOROUGHS, { message: "Choose the borough you work in most." }),
  email: z
    .string()
    .trim()
    .max(200)
    .pipe(z.email({ message: "Write an email address with an @, like name@yourshop.com." })),
  // the checkbox: "yes" when ticked, empty when not; both are fine
  publish: z
    .string()
    .transform((v) => (v === "yes" ? "yes" : "no")),
});
