"use client";

import { useActionState, useEffect, useRef } from "react";
import { requestAudit } from "@/app/audit/actions";
import { BOROUGHS, TRADES, type AuditField, type AuditState } from "@/lib/audit-fields";
import { MAIN_ACTION } from "@/lib/site";
import { Arrow } from "./Arrow";

const initial: AuditState = { status: "idle" };

type FieldDef = {
  name: AuditField;
  label: string;
  type?: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  options?: readonly string[];
  optional?: boolean;
  placeholder?: string;
};

const FIELDS: FieldDef[] = [
  { name: "business", label: "Business name", autoComplete: "organization" },
  { name: "trade", label: "Trade", options: TRADES },
  { name: "borough", label: "Borough", options: BOROUGHS },
  {
    name: "website",
    label: "Website (optional)",
    type: "text",
    autoComplete: "url",
    inputMode: "url",
    optional: true,
    placeholder: "yourshop.com…",
  },
  {
    name: "phone",
    label: "Shop phone",
    type: "tel",
    autoComplete: "tel",
    inputMode: "tel",
    placeholder: "718 555 0123…",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    autoComplete: "email",
    inputMode: "email",
    placeholder: "name@yourshop.com…",
  },
];

/**
 * The audit request form. Works without JavaScript (the server action posts and redirects); with it,
 * errors show under their fields, the first invalid field takes focus, and the status line is read out.
 * Its wrapper is <div class="form"> inside <form>, so Taste's system.js never takes it over.
 */
export function AuditForm() {
  const [state, action, pending] = useActionState(requestAudit, initial);
  const formRef = useRef<HTMLFormElement>(null);

  // Warn before leaving the page with typed but unsent details.
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    let dirty = false;
    const onInput = () => {
      dirty = true;
    };
    const onSubmit = () => {
      dirty = false;
    };
    const onLeave = (e: BeforeUnloadEvent) => {
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = "";
    };
    form.addEventListener("input", onInput);
    form.addEventListener("submit", onSubmit);
    window.addEventListener("beforeunload", onLeave);
    return () => {
      form.removeEventListener("input", onInput);
      form.removeEventListener("submit", onSubmit);
      window.removeEventListener("beforeunload", onLeave);
    };
  }, []);

  useEffect(() => {
    if (state.status !== "invalid" || !state.errors) return;
    const first = FIELDS.find((f) => state.errors?.[f.name]);
    if (first) formRef.current?.querySelector<HTMLElement>(`#f-${first.name}`)?.focus();
  }, [state]);

  return (
    <form ref={formRef} action={action} noValidate aria-labelledby="audit-form-h">
      <div className="form">
        {FIELDS.map((f) => {
          const err = state.errors?.[f.name];
          const id = `f-${f.name}`;
          const common = {
            id,
            name: f.name,
            required: !f.optional,
            "aria-invalid": err ? true : undefined,
            "aria-describedby": err ? `${id}-err` : undefined,
            defaultValue: state.values?.[f.name] ?? "",
          } as const;
          return (
            <div className="field" key={`${f.name}-${state.values?.[f.name] ?? ""}`}>
              <label htmlFor={id}>{f.label}</label>
              {f.options ? (
                <select {...common} autoComplete="off">
                  <option value="" disabled>
                    Choose one
                  </option>
                  {f.options.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  {...common}
                  type={f.type ?? "text"}
                  autoComplete={f.autoComplete}
                  inputMode={f.inputMode}
                  placeholder={f.placeholder}
                  spellCheck={f.type === "email" || f.inputMode === "url" ? false : undefined}
                />
              )}
              <p className="field__error" id={`${id}-err`} hidden={!err}>
                {err}
              </p>
            </div>
          );
        })}

        {/* honeypot: hidden from people and assistive tech */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: "-10000px",
            width: 1,
            height: 1,
            overflow: "hidden",
          }}
        >
          <label htmlFor="f-bot">Leave this empty</label>
          <input id="f-bot" name="bot-field" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="btn-row">
          <button className="btn btn--primary" type="submit" aria-disabled={pending || undefined}>
            {pending ? <span className="spinner" aria-hidden="true" /> : null}
            {MAIN_ACTION.label}
            {pending ? null : <Arrow />}
          </button>
        </div>
        <p className="form__status" role="status" aria-live="polite">
          {pending ? "Sending…" : (state.message ?? "")}
        </p>
        <p className="t-small muted">Your report comes by email. We never share your details.</p>
      </div>
    </form>
  );
}
