# Oakline — TODO

Two lists: the site itself, and the business behind it. Nothing here is urgent
by default — check things off as you get to them.

## Website

### Before showing this to a real prospect
- [x] Deploy — live at https://oakline-growth.netlify.app (real domain still pocketed; swap `canonical`/`og:url`/`og:image` in `index.html` once you have one)
- [ ] **Connect the GitHub repo for continuous deployment** — needs your direct action, CLI automation couldn't complete the GitHub App/webhook authorization. Go to https://app.netlify.com/projects/oakline-growth/settings/deploys → "Link repository" → GitHub → `Shiroyana/My-Website` → branch `main`, build command empty, publish dir `.`. After this, `git push` alone deploys — no more manual `netlify deploy`.
- [x] Working contact form — real Netlify Form (`audit-request`) on the contact section, redirects to `thank-you.html`. Hit a real bug getting this working: the site had `ignore_html_forms: true` in Netlify's processing settings, which silently skipped form detection entirely — form appeared to submit fine (redirected correctly) but nothing was ever captured. Fixed by flipping that setting; confirmed the form is now registered with all fields + honeypot.
- [ ] **Set up form-submission email notifications** — checked and there are currently no notification hooks configured, so real leads won't email-alert you yet. Netlify dashboard → Forms → Settings → add a notification (email is simplest).
- [ ] Point the contact CTA at something better than a personal Gmail `mailto:` — a form (Formspree/Netlify Forms) or a business inbox *(pocketed — business email; the form now exists, still submits toward your personal Netlify account until you have a business one)*
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
- [x] Explicit "Home" nav link + a fading back-to-top button (bottom-right,
  stacked above the chat widget) — added since the page is long and we
  may add standalone pages (FAQ, industry-specific landing pages) later

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

- [x] Chatbot trained on FAQs (Growth tier) — built and live: a real chat
  widget (bottom-right) backed by a Netlify Function
  (`netlify/functions/chat.js`) calling the Anthropic API, with Oakline's
  own pricing/services/process baked into the system prompt as the
  knowledge base. Simpler than full RAG (no vector DB) since the content
  is small enough to fit directly in context — upgrade to real embeddings
  only if/when a client's FAQ set gets large. **Needs your action:** add a
  real `ANTHROPIC_API_KEY` in Netlify site settings → Environment
  variables, or it just returns "not configured yet."
- [ ] CRM + lead routing (Growth Partner) — pick one (HubSpot free tier /
  Airtable), wire form submissions into it. You said you want to try
  HubSpot — that's a real account signup I can't do for you; once you
  have it, I can wire the form/chatbot leads into it.
- [ ] Email & SMS follow-ups, missed-call text-back (Growth Partner) —
  email tool = Resend or Postmark (transactional email API, not a
  newsletter tool); SMS/missed-call = Twilio. Both get triggered by
  whatever CRM/function is watching for the event (form submit, missed
  call, job marked done).
- [x] ~~Virtual/AI Phone Assistant (add-on)~~ — removed from the pricing
  page entirely rather than built; agreed it's the one add-on not worth
  shipping speculatively.
- [ ] Review Automation (add-on) — can start manual (client texts "job
  done," you send the request) before automating
- [ ] Monthly performance report template — mock one up using AAFARMA/AGM
  real data before the first one is due
- [x] Working contact/quote forms — Oakline's own site now has one (see
  above)
- [x] Local business schema (JSON-LD) — added to Oakline's own `index.html`
  (`ProfessionalService` type, includes the three package offers)
- [ ] Uptime monitoring — nothing is watching any site right now,
  including the client ones; UptimeRobot free tier, 10-minute setup —
  another real account signup, not something I can create for you

### Later
- [ ] Tax reserve — set aside a % of everything as it comes in, don't wait for year-end
- [ ] Revisit pricing after the first 2-3 real clients — you'll know fast whether $1,500/$2,750/$5,000 undersells the work
