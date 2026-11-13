import "server-only";
import { z } from "zod";
import { BOROUGHS, TRADES } from "./audit-fields";

export { FORM_NAME, type AuditField, type AuditState } from "./audit-fields";

const normalizeUrl = (v: string) => {
  const s = v.trim();
  if (!s) return "";
  return /^https?:\/\//i.test(s) ? s : `https://${s}`;
};

/** The six audit fields. Error messages name the field and say what to type (Taste system.md, Forms). */
export const auditSchema = z.object({
  business: z
    .string()
    .trim()
    .min(2, "Write your business name as customers know it.")
    .max(120, "Keep the business name under 120 characters."),
  trade: z.enum(TRADES, { message: "Choose your trade." }),
  borough: z.enum(BOROUGHS, { message: "Choose the borough you work in most." }),
  website: z
    .string()
    .max(200, "Keep the website address under 200 characters.")
    .transform(normalizeUrl)
    .refine((v) => v === "" || z.url().safeParse(v).success, {
      message: "Write your website address, like yourshop.com, or leave it empty.",
    }),
  phone: z
    .string()
    .trim()
    .refine((v) => v.replace(/\D/g, "").length >= 10 && v.replace(/\D/g, "").length <= 11, {
      message: "Write the shop phone number with its area code, like 718 555 0123.",
    }),
  email: z
    .string()
    .trim()
    .max(200)
    .pipe(z.email({ message: "Write an email address with an @, like name@yourshop.com." })),
});

export type AuditInput = z.infer<typeof auditSchema>;
