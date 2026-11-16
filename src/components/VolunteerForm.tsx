"use client";

import { useActionState, useEffect, useRef } from "react";
import { volunteerShop } from "@/app/case-studies/actions";
import {
  BOROUGHS,
  TRADES,
  type VolunteerField,
  type VolunteerState,
} from "@/lib/volunteer-fields";
import { Arrow } from "./Arrow";

const initial: VolunteerState = { status: "idle" };

type FieldDef = {
  name: Exclude<VolunteerField, "publish">;
  label: string;
  type?: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  options?: readonly string[];
  placeholder?: string;
};

const FIELDS: FieldDef[] = [
  { name: "name", label: "Your name", autoComplete: "name" },
  { name: "business", label: "Business name", autoComplete: "organization" },
  { name: "trade", label: "Trade", options: TRADES },
  { name: "borough", label: "Borough", options: BOROUGHS },
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
 * The case-study volunteer form: a shop owner offers their shop as a pilot and case study. Works
 * without JavaScript (the server action posts and redirects); with it, errors show under their
 * fields and the first invalid field takes focus. Wrapped in <div class="form"> so Taste's system.js
 * never takes it over.
 */
export function VolunteerForm() {
  const [state, action, pending] = useActionState(volunteerShop, initial);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status !== "invalid" || !state.errors) return;
    const first = FIELDS.find((f) => state.errors?.[f.name]);
    if (first) formRef.current?.querySelector<HTMLElement>(`#v-${first.name}`)?.focus();
  }, [state]);

  return (
    <form ref={formRef} action={action} noValidate aria-labelledby="volunteer-form-h">
      <div className="form">
        {FIELDS.map((f) => {
          const err = state.errors?.[f.name];
          const id = `v-${f.name}`;
          const common = {
            id,
            name: f.name,
            required: true,
            "aria-invalid": err ? true : undefined,
            "aria-describedby": err ? `${id}-err` : undefined,
            defaultValue: state.values?.[f.name] ?? "",
          } as const;
          return (
            <div
              className={`field${f.name === "email" ? " field--full" : ""}`}
              key={`${f.name}-${state.values?.[f.name] ?? ""}`}
            >
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
                  spellCheck={f.type === "email" ? false : undefined}
                />
              )}
              <p className="field__error" id={`${id}-err`} hidden={!err}>
                {err}
              </p>
            </div>
          );
        })}

        <label className="check field--full" htmlFor="v-publish">
          <input
            id="v-publish"
            name="publish"
            type="checkbox"
            value="yes"
            defaultChecked={state.values?.publish === "yes"}
          />
          <span>You may publish my shop&rsquo;s name with the results</span>
        </label>

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
          <label htmlFor="v-bot">Leave this empty</label>
          <input id="v-bot" name="bot-field" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="btn-row">
          <button className="btn btn--secondary" type="submit" aria-disabled={pending || undefined}>
            {pending ? <span className="spinner" aria-hidden="true" /> : null}
            Apply as a founding partner
            {pending ? null : <Arrow />}
          </button>
        </div>
        <p className="form__status" role="status" aria-live="polite">
          {pending ? "Sending…" : (state.message ?? "")}
        </p>
        <p className="t-small muted">
          Nothing is published without your written OK, even if you tick the box. We reply by
          email.
        </p>
      </div>
    </form>
  );
}
