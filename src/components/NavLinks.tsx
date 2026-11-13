"use client";

import { usePathname } from "next/navigation";

type Item = { readonly label: string; readonly href: string };

/** The nav words; marks the page you are on with aria-current (inner pages only). */
export function NavLinks({ items }: { items: readonly Item[] }) {
  const path = usePathname();
  return (
    <nav className="nav__links" aria-label="Main">
      {items.map((item) => {
        const current = !item.href.includes("#") && item.href !== "/" && path.startsWith(item.href);
        return (
          <div className="nav__item" key={item.href}>
            <a className="nav__link" href={item.href} aria-current={current ? "page" : undefined}>
              {item.label}
            </a>
          </div>
        );
      })}
    </nav>
  );
}
