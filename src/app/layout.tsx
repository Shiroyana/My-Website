import type { Metadata, Viewport } from "next";
import { Onest } from "next/font/google";
import Script from "next/script";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TasteRuntime } from "@/components/TasteRuntime";
import { JsonLd } from "@/components/JsonLd";
import { organizationJsonLd } from "@/lib/jsonld";
import { MAIN_ACTION, SITE_URL, site } from "@/lib/site";

// The Taste Skill kit CSS loads as plain files from public/assets, as the skill prescribes (its
// checker reads each layer by name), then the brand sheet (public/styles/brand.css: DESIGN.md
// tokens and page styles) after it, so brand rules win ties. React keeps this order by precedence.
const KIT_CSS = [
  "/assets/system.css",
  "/assets/ui/cards.css",
  "/assets/motion/motion.css",
  "/assets/layout/layout.css",
];
const BRAND_CSS = "/styles/brand.css";

const onest = Onest({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-onest",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${site.name}: ${site.brandLine}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_US",
    url: "/",
  },
  twitter: { card: "summary_large_image" },
  icons: {
    icon: [
      { url: "/brand/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/favicon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/brand/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  other: { "site-kind": "other", "page-type": "service" },
};

export const viewport: Viewport = {
  themeColor: "#0e1712",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const UMAMI_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

// The hero entrance guard (Taste motion layer) and the moments guard, before first paint.
// The entrance shows the hero by 700ms even if motion.js is late (Taste's value); moments get 2.5s.
const HEAD_GUARD =
  "var d=document.documentElement;d.classList.add('m-enter','mo-js');" +
  "setTimeout(function(){d.classList.add('m-enter-done')},700);" +
  "setTimeout(function(){d.classList.add('mo-safe')},2500);";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={onest.variable}
      data-type="service"
      data-radius="soft"
      data-buttons="solid"
      suppressHydrationWarning
    >
      <head>
        {KIT_CSS.map((href) => (
          <link key={href} rel="stylesheet" href={href} precedence="kit" />
        ))}
        <link rel="stylesheet" href={BRAND_CSS} precedence="brand" />
        <script dangerouslySetInnerHTML={{ __html: HEAD_GUARD }} />
        <JsonLd data={organizationJsonLd()} />
      </head>
      <body>
        <Header />
        <main id="top">{children}</main>
        <Footer />
        {/* the phone action bar (Taste system.md, Nav): system.js shows it once the hero's button
            has scrolled away; under 640px the nav's button moves into the menu sheet */}
        <nav className="actionbar ground-inverse" aria-label="Quick actions">
          <a className="btn btn--primary" href={MAIN_ACTION.href}>
            {MAIN_ACTION.label}
          </a>
        </nav>
        <TasteRuntime />
        {UMAMI_ID ? (
          <Script
            src="https://cloud.umami.is/script.js"
            data-website-id={UMAMI_ID}
            strategy="afterInteractive"
          />
        ) : null}
      </body>
    </html>
  );
}
