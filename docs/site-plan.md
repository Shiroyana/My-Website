# Cambi Growth site plan (step 2, for approval)

Line 1, kind: **service** (people are hired). `data-type="service"`, `site-kind="other"`.

Line 2, the deal: brand colours through `start.mjs brand` (the logo's green and the original amber and cream: a drafting sheet and mass timber, the two materials of a build, fit a business that turns a shop's details into something solid); type **Onest**; radius **soft**; hero **split**; nav **nav-split**; footer **footer-dark**; close **close-type**; rhythm **surface-pairs**, plus the blueprint hero and one blueprint band; buttons **solid**; mark: the client's own logo replaces the dealt wordmark. Moments: **word-highlight** (home, problem) and **photo-chapters** (home, how it works). Effect: the one 3D hero (brief override, see waivers).

## Sitemap

| Route | Page | In nav |
|---|---|---|
| `/` | Home | logo |
| `/audit` | Free AI readiness audit (form + sample report) | primary button, site-wide |
| `/packages` | Packages and prices | yes |
| `/case-studies` | Case studies (template, empty state) | yes |
| `/about` | About Yan | yes |
| `/contact` | Contact | footer |
| `/work` | Web design work for existing clients | footer |
| `/privacy` | Privacy (the form collects contact details) | footer |
| `/audit/thanks` | After a real send only, `noindex` | no |
| `/llms.txt`, `/sitemap.xml`, `/robots.txt` | Machine files | no |
| `not-found` | 404 | no |

Nav (nav-split): How it works, Packages, Case studies, About on the left; logo in the middle; **Get my free audit** on the right. At 390 a full-screen menu.

## Home, screen by screen

| # | Section | One idea | Picture (kind) | Screens 1440 / 768 / 390 | Ground |
|---|---|---|---|---|---|
| 1 | hero (split) | We set up NYC trade shops so AI assistants can price and book them | **3D timber frame** in blueprint (object); glass float card: "Free audit: your score out of 100 across 7 checks" | 1 / 1 / 1 | blueprint |
| 2 | problem (word-highlight moment) | AI assistants already call shops for customers and often leave with no price and no answer | none (the moment's own statement section) | 1 / 1 / 1 | cream |
| 3 | what AI reads | After setup, your prices, hours, area and open slots are readable in one place | **blueprint drawing** of a shop's data sheet with leader lines naming each item (diagram, still) | 1 / 2 / 2 | blueprint band |
| 4 | how it works (photo-chapters moment) | Three steps: audit, setup, jobs land in your schedule | **3 photographs** of trade work in NYC (use) | 3 to 4 (the moment) | cream |
| 5 | packages | Four packages from a free audit to a monthly plan | 4 **glass cards** on a blueprint grid, timber edge on Setup | 1 / 2 / 2 | blueprint grid |
| 6 | work | Sites we have already built and run | **3 screenshots**: AAFARMA Inc., African Green Manor, VitalCare Essential Supplies (work) | 1 / 1 / 2 | cream-alt |
| 7 | questions (FAQ) | The five things owners ask first | none (FAQ, allowed once) | 1 / 1 / 2 | cream |
| 8 | close (close-type) | Get booked by AI, not just found | the line set large + the big button | 1 | blueprint footer |

Proof: there is no client result yet, so proof is the three real client sites plus a "First NYC pilot underway" line linking to case studies. No quotes, logos or numbers are invented.

### Draft headlines (copy is finalized and linted in step 3)

- h1 (Taste rule: names the category and the buyer, not a slogan): **"AI booking setup for NYC trade shops"**
- Notice line above it: "HVAC, plumbing and electrical, all five boroughs" (the first screen's hard fact is the place)
- Lead: "When a customer asks ChatGPT or Google to find a plumber, the AI looks for a price, your hours and an open slot. We put yours where it can read them, so the job lands in your schedule."
- Buttons: **Get my free audit**, See packages
- Your headline idea "Get booked by AI, not just found" is the page's one brand line: it closes the page (section 8), and it is the `<title>` and Open Graph title. Taste forbids a slogan as the h1, so it is not the h1.
- FAQ: Do I have to publish exact prices? / Will a robot answer my phone? / Do I need new scheduling software? / Who owns my data? / What is in the free audit?

## Other pages

- **/audit:** hero split (h1 "Free AI readiness audit for your shop"; the form on the right: business name, trade, borough, website, phone, email). Then the **sample report** as an architectural drawing sheet (title block, score, seven checks, leader lines to three fixes), headed "Sample report". Then "What we check": the seven-check rubric with points (from the pivot plan). Then what happens next, in three steps.
- **/packages:** the four packages in detail (what you get, from $X, who it suits), a comparison table, pricing FAQ. Each package also goes into JSON-LD as a Service with an Offer.
- **/case-studies:** the template (shop, trade, borough, before and after readiness score, booked-jobs change, owner quote) rendered once as an empty state: "First NYC pilot underway." No fake entry.
- **/about:** Yan: NYU, based in NYC, engineering plus finance, why it matters to small shops. No portrait (removed Nov 19 at the owner's request).
- **/contact:** email (getcambi@gmail.com), area served (five boroughs), a short message form using the same server action, the audit as the recommended path.
- **/work:** the three existing client sites, a screenshot and one line each, linking out.

## Where the effects go

- **3D hero:** home hero only. Live at 1024 and wider on capable devices; the still everywhere else (768, 390, low-power, reduced motion). No 3D on any other page.
- **Glass:** the nav (dark over blueprint, light over cream), the home and /packages package cards, the hero float card. Nothing else.
- **Blueprint linework:** home hero, home section 3, the package ground, the footer, the sample report (in teal on paper).
- **Moments:** home only (word-highlight, photo-chapters). The other pages keep the hero entrance and the hover layer.

## Machine-readable layer

- JSON-LD: `ProfessionalService` (name, url, logo, email, areaServed: the five boroughs as `City`/`AdministrativeArea`), a `Service` + `Offer` per package, `FAQPage` on home and /packages, `BreadcrumbList` on inner pages, `Person` for Yan on /about.
- `/llms.txt`: what Cambi does, the packages with prices, the area served, how to request the audit, links to each page.
- Every price and fact in server-rendered HTML.

## Tech

- Next.js (App Router, latest stable), TypeScript, React 19, ESLint + Prettier.
- CSS: Taste Skill's `system.css` as the global layer with DESIGN.md tokens on `:root`, plus CSS Modules for page CSS. No Tailwind, so two CSS systems are never mixed.
- Font: Onest through `next/font/google` (self-hosted at build).
- 3D: `@react-three/fiber` v9 + `three`, `next/dynamic` with `ssr: false`.
- Hosting: Netlify (your paid plan), Next.js runtime, previews from the `redesign` branch.

## Waivers against Taste Skill (1 to 4 approved; 5 and 6 new, need approval)

1. 3D hero on a service page (brief asks for it).
2. Next.js server build instead of a static export (the form needs a server action); checks run against the running site.
3. Real contact details instead of `.example` (real business).
4. Stand-in photographs filtered to CC0 and public domain only.
5. Multi-page site instead of one page (brief lists seven pages).
6. "from $X" price placeholders shown on the page until you fill them in (brief).
