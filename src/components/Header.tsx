import { MAIN_ACTION, nav, site } from "@/lib/site";
import { NavLinks } from "./NavLinks";
import { Arrow } from "./Arrow";

/* nav-split (dealt): the words left, the logo in the middle, the main action right.
   Dark glass on the inverse ground (DESIGN.md waiver over Taste's opaque bar).
   Plain <a> links: full page loads, so the kit scripts start fresh on every page. */
export function Header() {
  return (
    <header className="nav nav--split nav--tone glass-dark">
      <div className="wrap nav__bar">
        <a className="skip-link" href="#top">
          Skip to content
        </a>
        <a className="nav__logo" href="/" aria-label={`${site.name}, home`}>
          {/* eslint-disable-next-line @next/next/no-img-element -- the brand PNG as is, 56px source for 28px */}
          <img src="/brand/brand-mark.png" alt="" width={28} height={28} />
          <span translate="no">{site.name}</span>
        </a>
        <NavLinks items={nav} />
        <div className="nav__actions">
          <a className="btn btn--primary" href={MAIN_ACTION.href}>
            {MAIN_ACTION.label}
            <Arrow />
          </a>
        </div>
        {/* system.js wires this up (aria-expanded, the phone sheet, Escape) */}
        <button className="nav__toggle" type="button" aria-expanded="false" aria-label="Menu">
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path
              d="M2 5h14M2 13h14"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}
