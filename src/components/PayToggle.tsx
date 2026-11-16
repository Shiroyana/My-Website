"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

type Mode = "upfront" | "zerodown";

const noSubscribe = () => () => {};
/** false while server-rendering and hydrating, true once running in the browser */
const useHydrated = () =>
  useSyncExternalStore(
    noSubscribe,
    () => true,
    () => false,
  );

/**
 * "$0 down" / "Standard" switch for a pricing section ($0 down shown first). It sets data-pay-mode on the section
 * (`scopeId`), and CSS hides the other price line. Rendered only after hydration, in a box that
 * keeps its height, so there is no layout shift; without JavaScript both prices show.
 */
export function PayToggle({
  scopeId,
  tone = "dark",
}: {
  scopeId: string;
  /** "dark" on the blueprint sections, "light" on cream ones */
  tone?: "dark" | "light";
}) {
  const [mode, setMode] = useState<Mode>("zerodown");
  const ready = useHydrated();

  useEffect(() => {
    if (!ready) return;
    document.getElementById(scopeId)?.setAttribute("data-pay-mode", mode);
  }, [mode, ready, scopeId]);

  return (
    <div className="pay-toggle-slot">
      {ready ? (
        <div
          className={`pay-toggle${tone === "light" ? " pay-toggle--light" : ""}`}
          role="group"
          aria-label="How to pay"
        >
          {(
            [
              ["zerodown", "$0 down"],
              ["upfront", "Standard"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              className="pay-toggle__btn"
              aria-pressed={mode === value}
              onClick={() => setMode(value)}
            >
              {label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
