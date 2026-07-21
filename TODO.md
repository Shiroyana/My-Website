# Oakline — TODO

Two lists: the site itself, and the business behind it. Nothing here is urgent
by default — check things off as you get to them.

## Website

### Before showing this to a real prospect
- [ ] Buy a domain and deploy (Netlify/Vercel/Cloudflare Pages all have a free tier for a static site like this)
- [ ] Point the contact CTA at something better than a personal Gmail `mailto:` — a form (Formspree/Netlify Forms) or a business inbox
- [ ] Add basic analytics (Plausible or GA4) so you know if anyone's actually visiting
- [ ] Replace `alphavires@gmail.com` in the code with a business email once you have one

### Content
- [ ] Real testimonials/reviews once you have them (AAFARMA/AGM owner quotes would be strong social proof if they're willing)
- [x] Real screenshots of AAFARMA and AGM in the Results section
- [x] A 404 page
- [ ] Decide if you want a blog (SEO value, but only worth it if you'll actually write in it)

### Polish
- [x] Cross-browser check — verified in Firefox and WebKit in addition to Chromium (marquee, count-up, toggle, diagram all match)
- [x] Accessibility pass — fixed real WCAG AA contrast failures (kicker labels were 2.6:1, meta text was ~3.3:1) and a real keyboard-trap bug in the mobile nav (closed menu was still tabbable; opening it via keyboard skipped past the links). See git log for details.
- [ ] OG image for link previews (currently only text meta tags, no image)
- [x] robots.txt (sitemap.xml still held until there's a real domain)

## Business (you)

### Foundational
- [ ] Decide on business structure (LLC vs. sole prop) — matters once money starts moving
- [ ] Separate business bank account
- [ ] A real contract template — should cover the $0-down 6-month minimum term, code/design ownership, and a code-reuse clause (don't let a client take your build and resell it as their own template)
- [ ] A way to actually collect payment — Stripe/Square for one-time deposits and recurring monthly billing

### Sales motion
- [ ] Build a target list: search Google Maps/Yelp for plumbing, HVAC, electrical, roofing, restoration, and restaurant businesses with outdated sites (GoDaddy/Wix/no site at all are good signals)
- [ ] Decide what a "free website audit" actually contains — a real deliverable (PageSpeed score, mobile check, missing SEO basics) makes the offer credible instead of vague
- [ ] Draft the cold outreach script/email (the site's own sales-story copy — "your reputation is excellent, your website doesn't reflect that" — is a good starting point for outreach too)

### Later
- [ ] Tax reserve — set aside a % of everything as it comes in, don't wait for year-end
- [ ] Revisit pricing after the first 2-3 real clients — you'll know fast whether $1,500/$2,750/$5,000 undersells the work
