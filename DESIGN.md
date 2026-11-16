---
version: 1.0
name: Cambi Growth
description: A drafting-table service site for NYC trade shops. Deep logo green carries the dark "blueprint" sheets, warm cream carries the reading surfaces, and burnt amber (the mass-timber tone) carries every action. One typeface, Onest, at regular weight. Linework, not decoration, does the visual work: grids, dimension lines and callouts on dark green, timber tones on light. One 3D hero shows a mass-timber frame drawn as a blueprint that builds into wood. Glass appears on three surfaces only.

colors:
  # brand (fixed, from the logo and the original site)
  logo-tile: "#1B281F"
  logo-green: "#6AAF65"
  blueprint: "#0E1712"
  blueprint-raised: "#172019"
  cream: "#F7F3EC"
  cream-alt: "#EFEAE0"
  cream-sunken: "#ECE4D5"
  ink: "#14140F"
  amber: "#D9832E"
  accent: "#A6591C"
  accent-on-dark: "#E8A75C"
  green: "#3F7D4F"
  teal: "#2E6E72"
  # derived (tints and shades of the brand values above, nothing new)
  ink-soft: "#55534A"
  ink-faint: "#6E6A5C"
  line: "#E4DDCC"
  line-strong: "#D3CAB4"
  on-dark: "#F4F0E6"
  on-dark-soft: "#B9C2B4"
  on-dark-faint: "#94A08D"
  dark-line: "#263229"
  timber-100: "#F1DFC6"
  timber-300: "#E2B27A"
  timber-500: "#D9832E"
  timber-700: "#A6591C"
  timber-900: "#5A2F0E"
  error: "#8C3A0E"
  success: "#3F7D4F"

typography:
  family: "Onest, system-ui, sans-serif"
  source: "Google Fonts via next/font (self-hosted at build, no runtime request)"
  weights: [400, 500]
  display-tracking: "-0.035em, -0.04em at hero size"
  h1: "clamp(38px, 3.24vw + 25.4px, 72px) / 1.04"
  h2: "clamp(30px, 1.72vw + 23.3px, 48px) / 1.1"
  h3: "24px / 1.2 (28px from 1280px)"
  card: "18px / 1.3, weight 500 (20px from 1280px)"
  lead: "18px / 1.5 (20px from 1280px)"
  body: "16px / 1.55"
  small: "14px"
  label: "13px, weight 500, tabular numerals"

spacing: [4, 8, 12, 16, 24, 32, 48, 64, 96, 128]
radius: { sm: 8, md: 12, lg: 20, button: 8 }
container: 1280
grid: 12 columns
---

# Cambi Growth design system

## Overview

Cambi Growth makes NYC trade shops (HVAC, plumbing, electrical) readable and bookable by AI assistants. The site is also the demo: it has to look like the work of someone who builds things properly, and it has to be as machine-readable as the shops we sell to.

Two materials set the look.

- **Blueprint.** The plan before the build. Deep logo green sheets with cream and green linework: a fine grid, dimension lines with tick ends, leader lines that point at a thing and name it. This is how we show structure, data and "what an AI sees".
- **Mass timber.** The built thing. Warm amber and wood tones from the brand amber, real photographs of timber and of trade work, and the 3D hero, where a glulam and CLT frame starts as blueprint lines and settles into wood.

The story the page tells with those two: a shop's prices, hours and open slots are drawn up like a plan, then built into something solid that AI assistants can use.

The register is confident, local and practical. Readers are shop owners on a phone between jobs. Nothing is decorative unless it carries meaning; nothing is cinematic unless it loads fast.

Taste Skill classification: **service** (people are hired). Page metas: `data-type="service"`, `site-kind="other"`.

## Colors

All contrast figures are WCAG 2.x ratios against the surface named.

### Brand and accent

| Token | Hex | Role |
|---|---|---|
| `accent` | `#A6591C` | Primary action fill on light surfaces, links, focus ring on light. 4.7:1 on `cream`, so it is also safe as text. |
| `accent-on-dark` | `#E8A75C` | Primary action fill and links on blueprint surfaces. 8.8:1 on `blueprint`. Button text on it is `blueprint`. |
| `amber` | `#D9832E` | Timber highlight: 3D hero wood, lamination edge details, the word that turns accent in the word-highlight moment. Never text on cream (2.6:1). |
| `logo-green` | `#6AAF65` | The logo arrow. On blueprint it is the "highlighted member" line color and small status dots (6.9:1 on `blueprint`). Never a button fill and never text on cream. |
| `logo-tile` | `#1B281F` | The logo tile. Also the raised panel on blueprint sheets. |
| `green` | `#3F7D4F` | Success states and the "pass" mark in the readiness report. |
| `teal` | `#2E6E72` | Secondary linework on light surfaces only (callout leaders in the sample report). Not used on dark. |

### Surfaces

| Token | Hex | Role |
|---|---|---|
| `cream` | `#F7F3EC` | Page ground. Every reading section. |
| `cream-alt` | `#EFEAE0` | Alternate section ground for the surface-pairs rhythm, card fill. |
| `cream-sunken` | `#ECE4D5` | Form fields, the sample report paper. |
| `blueprint` | `#0E1712` | Dark sheets: hero, the dark band, footer, the "what an AI sees" panels. |
| `blueprint-raised` | `#172019` | Cards and panels on blueprint. |
| `logo-tile` | `#1B281F` | A second raised step on blueprint (the hero float card). |

### Lines

| Token | Value | Role |
|---|---|---|
| `line` | `#E4DDCC` | Hairlines and card borders on cream. |
| `line-strong` | `#D3CAB4` | Field borders, secondary button border on cream. |
| `dark-line` | `#263229` | Hairlines on blueprint. |
| `grid-minor` | `on-dark` at 6% | Blueprint grid, 8px pitch. |
| `grid-major` | `on-dark` at 12% | Blueprint grid, 64px pitch. |
| `dimension` | `on-dark` at 55% | Dimension and leader lines, 1px, with 6px tick ends. |

### Text

| Token | Hex | On | Ratio |
|---|---|---|---|
| `ink` | `#14140F` | cream | 16.7:1 (14.6:1 on cream-sunken) |
| `ink-soft` | `#55534A` | cream | 7.0:1 |
| `ink-faint` | `#6E6A5C` | cream | 4.9:1 (meta text only, never under 14px) |
| `on-dark` | `#F4F0E6` | blueprint | 16.1:1 |
| `on-dark-soft` | `#B9C2B4` | blueprint | 10.0:1 |
| `on-dark-faint` | `#94A08D` | blueprint | 6.7:1 |

`accent` drops to 4.1:1 on `cream-sunken`, so links and text on the form and report surface use `ink`, never `accent`.

### Timber scale (tints and shades of `amber`)

`timber-100 #F1DFC6`, `timber-300 #E2B27A`, `timber-500 #D9832E`, `timber-700 #A6591C`, `timber-900 #5A2F0E`. Used for the 3D wood material, lamination stripes on edges, and photo duotone fallbacks. Text on timber-100 and timber-300 is `ink`.

### Semantic

- **Error** `#8C3A0E` (a deep shade of the accent, 7.0:1 on cream). Always paired with an icon and words, never color alone.
- **Success** `#3F7D4F` for marks and icons only (4.5:1 is not reached as text: 4.46:1 on cream). The words beside a success mark are `ink`.
- No red, blue, violet or any hue outside this sheet.

## Typography

### Family

**Onest** for everything (dealt by Taste Skill for a service business: calm, even and readable). Loaded with `next/font/google`, so the files are self-hosted at build time and there is no layout shift. Fallback `system-ui, sans-serif`.

One family, two weights: **400** for headings and text, **500** for buttons, labels and card titles. No bold, no italic display, no second family.

### Hierarchy

| Level | Size (390 to 1440) | Line height | Weight | Tracking |
|---|---|---|---|---|
| h1 | 38 to 72px (hero split deals 40 to 72) | 1.02 to 1.04 | 400 | -0.04em |
| h2 | 30 to 48px | 1.1 | 400 | -0.035em |
| h3 | 24px, 28px from 1280 | 1.2 | 400 | -0.035em |
| Card title | 18px, 20px from 1280 | 1.3 | 500 | -0.01em |
| Lead | 18px, 20px from 1280 | 1.5 | 400 | 0 |
| Body | 16px | 1.55 | 400 | 0 |
| Small | 14px | 1.5 | 400 | 0 |
| Label | 13px | 1.4 | 500 | 0.01em, tabular numerals |

### Principles

- Sentence case everywhere, including buttons and nav.
- Headings name a thing (a noun in every heading). Buttons are a verb and an object: "Get my free audit".
- Prices and figures use tabular numerals so columns line up like a schedule on a drawing.
- The blueprint feel comes from linework and labels set beside lines, not from a mono or a stencil face.
- Measure 42 to 68 characters for text blocks.
- No em-dashes or en-dashes anywhere, in copy or code comments. Use a colon, a comma or two sentences.

## Layout

### Spacing

4px base: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128. Card padding 24px. Card gap 12px, 24px from 1280.

### Grid and container

- 12 columns, container 1280px, side gutter 24px at 390, 48px from 640, 80px from 1280.
- Every block sits on the `.wrap` edges or on column lines. Left and right content edges are equal.
- **One section per screen.** The hero fills the first screen alone. Every section is one or two screens tall at 1440x900, its h2 first and top-aligned, with no neighbouring heading peeking in.

### Section rhythm

Dealt **surface-pairs**: cream and cream-alt alternate, with one blueprint band (the "what an AI sees" proof) and the blueprint footer. The hero is blueprint.

### Hero (dealt: split)

Text in 5 columns on the left, the 3D frame in 6 columns from column 7, ending on the right edge, 628x716 at 1440, radius `lg`. One float card, 300px wide, 24px in from the picture's lower left. At 390 the text comes first, buttons full width and stacked, the picture below at 342px wide (the static still, no WebGL).

## Elevation and depth

Flat by default. Depth comes from line weight and surface steps, not shadows.

1. **Surface steps.** cream, then cream-alt, then cream-sunken; blueprint, then blueprint-raised, then logo-tile.
2. **Hairlines.** 1px `line` or `dark-line`. Cards have a hairline, no shadow.
3. **One shadow,** only on a lifted linked card on hover: `0 12px 30px -16px rgba(20,20,15,0.28)`.
4. **Glass.** Three surfaces only, specified below.
5. **The 3D hero.** The only real depth on the site.

### Glass (CSS only, liquid-glass-js used as a visual reference, not a dependency)

Used on: the nav bar, the package cards on the Packages section, and the hero float card. Nowhere else.

```css
.glass-dark {
  background: rgb(14 23 18 / 0.9);
  -webkit-backdrop-filter: blur(18px) saturate(140%);
  backdrop-filter: blur(18px) saturate(140%);
  border: 1px solid rgb(244 240 230 / 0.14);
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 0.10),   /* top highlight */
    inset 0 -1px 0 rgb(0 0 0 / 0.25);        /* bottom edge */
}
.glass-light {
  background:
    linear-gradient(155deg, rgb(255 255 255 / 0.55) 0%, rgb(255 255 255 / 0) 42%),
    rgb(247 243 236 / 0.88);
  -webkit-backdrop-filter: blur(18px) saturate(140%);
  backdrop-filter: blur(18px) saturate(140%);
  border: 1px solid rgb(20 20 15 / 0.08);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.65);
}
@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .glass-dark  { background: #0E1712; }
  .glass-light { background: #F7F3EC; }
}
```

Contrast rule: the fill alpha is set so text stays at AA with the lightest content that can pass underneath (0.9 dark gives `on-dark` 12.4:1 over cream; 0.88 light gives `ink` 13.1:1 and `ink-soft` 5.5:1 over blueprint). Never lower the alpha below these values. The nav is always dark glass: it stays at 12.4:1 over the lightest section, so it never needs to switch on scroll.

## Shapes

- Radius `soft`: sm 8, md 12, lg 20, buttons 8. Photographs and the hero frame use `lg`. Form fields `sm`.
- **Blueprint marks** (SVG, 1px strokes, `vector-effect: non-scaling-stroke`): a dimension line with 6px tick ends and a label set at its midpoint; a leader line ending in a 4px dot, with the label at its other end; a corner registration mark (two 12px strokes) on blueprint panels.
- **Timber edge:** a 4px lamination stripe (three bands: timber-300, timber-500, timber-700) on the top edge of the featured package card and of the sample report. Used twice on the site at most.

## Components

### Navigation (dealt: nav-split)

Page links on the left, the logo in the middle (`brand-mark.png` icon plus the wordmark "Cambi Growth" in Onest 500), the primary action on the right. 56px tall, glass. At 390: logo, a menu button that states its state (`aria-expanded`), and a full-screen menu. The skip link is the first focusable element.

### Buttons (dealt: solid)

- **Primary:** `accent` fill, `cream` text on light; `accent-on-dark` fill, `blueprint` text on dark. 44px tall (48px on phones), radius 8, 24px side padding, weight 500.
- **Secondary:** the ground's own colour, a `line-strong` border, `ink` text.
- Hover steps the fill toward the ink by 14%. Press scales to 0.98. Focus: a 2px ring in `accent` (light) or `accent-on-dark` (dark), 2px offset, visible at once.
- At most two actions in the hero. The primary action site-wide is **Get my free audit**.

### Cards

One card family. `cream-alt` fill on cream (`blueprint-raised` on blueprint), 1px hairline, radius `md`, 24px padding. A linked card lifts 2px on hover and its photo zooms to 1.03 inside the frame. No tilt.

### Package cards

Four cards: Free Audit, Agent-Ready Setup, Agent-Ready Monthly, Voice add-on. Light glass over a blueprint-grid section ground. Price in plain server-rendered text, written "from $X" until the owner fills it in. The featured card (Setup) carries the timber edge.

### Forms (the audit form)

Labels above fields, always visible. Fields 48px tall, `cream-sunken` fill, `line-strong` border, radius `sm`. Focus: border to `accent` plus the focus ring. Errors sit under their own field in `error` with an icon, announced with `aria-live="polite"`. Inputs use the right `type`, `autocomplete` and `inputmode` (tel, email, url). The submit button keeps its label and shows a spinner while sending; the success message appears only after a real send.

### Sample readiness report

A one-page "drawing sheet" on `cream-sunken`: a title block in the lower right corner like an architectural sheet (shop name, trade, borough, date, score), the score as a large figure, seven rubric rows with pass or fix marks, and teal leader lines pointing at the three fixes. Clearly marked as a sample.

### Footer (dealt: footer-dark)

Blueprint ground with the faint grid, logo, page links, contact email, the one-line photo credits, and the copyright.

### Close (dealt: close-type)

The last section before the footer: one large typeset line and the primary action. No photograph.

## Motion

- **Hero entrance:** once on load, text then picture, 600ms, `cubic-bezier(.2,.8,.2,1)`.
- **Hover layer:** buttons step and press, underlines draw, linked cards lift 2px, photos zoom 1.03. 180ms.
- **Dealt moments (two):** *word-highlight* on the problem statement, and *photo-chapters* on "How it works" (three steps, three photographs). Each moves only inside its own section.
- **The 3D hero:** a two-storey mass-timber duplex assembles on its blueprint plan (src/components/hero/duplex-model.ts). Foundations, glulam columns, CLT walls, beams and decks fall into place storey by storey; each storey's trades go in before the deck above closes it (HVAC ducts in on-dark-soft, plumbing in logo green, electrical conduit and panels in teal); heat pumps and solar panels land on the roof; the glazing slides in from the sides; warm interior lights come on. All motion ends at 4.6 seconds (WCAG 2.2.2), then the render loop stops; a replay button (top right, 44px) runs it again. **X-ray:** once built, hovering the building (or the "X-ray" toggle beside replay, for keyboards and touch) fades the walls, floors and roofs to outlines so the trades inside show; the loop runs only while it fades. Built with @react-three/fiber v9 and three; loaded client-only with `next/dynamic` and `ssr: false`; device pixel ratio capped at 1.5; paused when off screen or the tab is hidden. The still image (public/hero/duplex-*.webp, captured from the finished build by scripts/capture-hero-still.mjs) is the LCP image everywhere and the whole picture on phones, low-power devices (`navigator.hardwareConcurrency <= 4` or Save-Data) and under `prefers-reduced-motion`. If the live scene costs more than 5 Lighthouse mobile performance points, the still replaces it everywhere.
- **Reduced motion:** everything rests in its final state; nothing stays hidden.
- **Never:** fade-in on scroll for cards or sections, parallax on text, scroll-jacking, tilt, carousels, autoplaying tabs, any shader or WebGL besides the hero.

## Photography and imagery

- The owner's own photographs first. Until they arrive, each slot holds a clearly marked placeholder or a CC0 or public-domain stand-in, credited once in the footer line. No CC BY-SA. No AI-generated people.
- Subjects: trade work in NYC (a technician at a boiler, a van on a Queens street, a dispatcher's phone), timber construction for texture.
- No caption under any image.
- Client work section: the existing screenshots of AAFARMA Inc., African Green Manor and VitalCare Essential Supplies.

## Responsive behavior

| Width | Changes |
|---|---|
| 1440 | Full split hero with live 3D, 12 columns, 80px gutters, nav links visible. |
| 1024 | Split hero holds, 3D still live, gutters 48px, package cards 2 by 2. |
| 768 | Hero stacks: text first, then the still image. Package cards 2 by 2. Nav collapses to the menu button. |
| 390 | One column, 24px gutters, buttons full width, 48px touch targets, package cards stack, the still image in place of 3D, full-screen menu. |
| 320 | Nothing overflows sideways; nothing overlaps. |

Touch targets are 44px minimum everywhere, with 8px between neighbouring targets.

## Accessibility

- WCAG 2.2 AA contrast for all text, including text on glass (see Glass).
- Every control reachable by keyboard in reading order, visible focus ring, skip link first.
- One h1 per page, headings in order, landmarks (`header`, `nav`, `main`, `footer`).
- Every image has alt text; decorative linework is `aria-hidden`.
- The 3D canvas is `aria-hidden` with a text alternative beside it.

## Do's and don'ts

### Do

- Say what is sold on the first screen, in plain words: "AI assistants like ChatGPT and Google".
- Use linework to explain: point a leader line at a price, dimension a time slot.
- Keep amber for actions and timber; keep logo green for lines and status.
- Render every price and fact as server HTML text.
- Mark every placeholder plainly so the owner can find and replace it.

### Don't

- Don't redraw, recolor or crop the logo. Use the PNG files as they are.
- Don't add a hue that is not on this sheet, and never violet or blueprint blue.
- Don't use "MCP", "agents" or "schema" above the fold.
- Don't invent testimonials, client logos, stats or reviews.
- Don't put glass on more than the three surfaces named, and never put body paragraphs on glass.
- Don't use the blueprint grid on cream reading sections. It lives on blueprint surfaces only.
- Don't use em-dashes or en-dashes.

## Agent prompt guide

Paste this when asking an AI tool to build or extend a Cambi Growth page:

> Build in the Cambi Growth system (DESIGN.md). Next.js App Router, TypeScript, React 19, all content server-rendered. Font Onest 400 and 500 only. Light sections on cream #F7F3EC with ink #14140F; dark "blueprint" sections on #0E1712 with on-dark #F4F0E6 text and a faint 8px/64px grid. Primary buttons: #A6591C with cream text on light, #E8A75C with #0E1712 text on dark, 44px tall, radius 8. Cards: one hairline, radius 12, no shadow. Glass only on the nav, package cards and hero float card, using the .glass-dark and .glass-light recipes. Explain with blueprint linework (dimension lines, leader lines), not icons or illustrations. One section per screen, equal left and right edges, sentence case, a noun in every heading, a verb and object on every button. No em-dashes. No invented proof. Respect prefers-reduced-motion. Touch targets 44px.

Quick reference:

| Need | Use |
|---|---|
| Primary action, light | `#A6591C` / text `#F7F3EC` |
| Primary action, dark | `#E8A75C` / text `#0E1712` |
| Page ground | `#F7F3EC` |
| Dark sheet | `#0E1712` |
| Body text | `#14140F`, secondary `#55534A` |
| Highlight line on dark | `#6AAF65` |
| Timber accent | `#D9832E` |

## Known gaps

- **Logo is PNG only.** No SVG exists in the repo. The brand mark is used from `assets/favicons/brand-mark.png` and `cambi-icon-512.png`. An SVG from the original designer would replace them.
- **Photographs:** none of the owner's own yet. Slots are marked.
- **Package prices:** "from $X" placeholders until the owner sets them.
- **Case studies:** template and empty state only ("First NYC pilot underway").
