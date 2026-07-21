# Oakline — TODO

Two lists: the site itself, and the business behind it. Nothing here is urgent
by default — check things off as you get to them.

## Website

### Before showing this to a real prospect
- [x] Deploy — live at https://oakline-growth.netlify.app (real domain still pocketed; swap `canonical`/`og:url`/`og:image` in `index.html` once you have one)
- [ ] Point the contact CTA at something better than a personal Gmail `mailto:` — a form (Formspree/Netlify Forms) or a business inbox *(pocketed — business email)*
- [ ] Add basic analytics (Plausible or GA4) so you know if anyone's actually visiting *(pocketed)*
- [ ] Replace `alphavires@gmail.com` in the code with a business email once you have one *(pocketed)*

### Content
- [ ] Real testimonials/reviews once you have them (AAFARMA/AGM owner quotes would be strong social proof if they're willing)
- [x] Real screenshots of AAFARMA and AGM in the Results section
- [x] A 404 page
- [ ] Decide if you want a blog (SEO value, but only worth it if you'll actually write in it)

### Polish
- [x] Cross-browser check — verified in Firefox and WebKit in addition to Chromium (marquee, count-up, toggle, diagram all match)
- [x] Accessibility pass — fixed real WCAG AA contrast failures (kicker labels were 2.6:1, meta text was ~3.3:1) and a real keyboard-trap bug in the mobile nav (closed menu was still tabbable; opening it via keyboard skipped past the links). See git log for details.
- [x] OG image for link previews
- [x] robots.txt (sitemap.xml still held until there's a real domain)

## Business (you)

### Foundational
- [ ] Decide on business structure (LLC vs. sole prop) — matters once money starts moving
- [ ] Separate business bank account
- [x] A real contract template — `business/contract-template.md`. **Not legal advice** — get it reviewed by an actual attorney before sending to a real client.
- [ ] A way to actually collect payment — Stripe/Square for one-time deposits and recurring monthly billing

### Sales motion
- [x] Target list methodology — `business/cold-outreach-script.md`
- [x] "Free website audit" deliverable — `business/website-audit-template.md`
- [x] Cold outreach script/email — `business/cold-outreach-script.md`

### Product capability — can we actually deliver what we sell?

Full audit: `business/delivery-readiness.md`. Short version: the *website*
half of every tier is proven (AAFARMA, AGM). The *automation/AI* half is
mostly not built yet, and it's what makes Growth/Growth Partner worth more
than Foundation:

- [ ] Chatbot trained on client FAQs (Growth tier) — adapt Stash's RAG
  pipeline; highest-leverage build, unblocks Growth, Growth Partner, and
  the Growth Partner FAQ-assistant line at once
- [ ] CRM + lead routing (Growth Partner) — pick one (HubSpot free tier /
  Airtable), wire form submissions into it
- [ ] Email & SMS follow-ups, missed-call text-back (Growth Partner) —
  needs an email tool (Resend/Postmark) + Twilio, on top of the CRM above
- [ ] Virtual/AI Phone Assistant (add-on) — the most technically
  substantial gap; don't sell this one until it's built and tested on a
  throwaway number
- [ ] Review Automation (add-on) — can start manual (client texts "job
  done," you send the request) before automating
- [ ] Monthly performance report template — mock one up using AAFARMA/AGM
  real data before the first one is due
- [ ] Working contact/quote forms — even Oakline's own site is still
  `mailto:`; wire Netlify Forms here first as the proof
- [ ] Local business schema (JSON-LD) — Oakline's own site doesn't have
  this either; add it here first
- [ ] Uptime monitoring — nothing is watching any site right now,
  including the client ones; UptimeRobot free tier, 10-minute setup

### Later
- [ ] Tax reserve — set aside a % of everything as it comes in, don't wait for year-end
- [ ] Revisit pricing after the first 2-3 real clients — you'll know fast whether $1,500/$2,750/$5,000 undersells the work
