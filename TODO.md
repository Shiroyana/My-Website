# Cambi Growth — TODO

Two lists: the site itself, and the business behind it. Nothing here is urgent
by default — check things off as you get to them.

## Website

### Before showing this to a real prospect
- [x] Deploy — `getcambi.com` is registered and pointed at Netlify; `canonical`/`og:url`/`og:image`/JSON-LD in `index.html` already reference it, so nothing left to swap. `oakline-growth.netlify.app` is still the underlying Netlify site URL (fine to leave — it's infrastructure, not brand-facing).
- [x] Connect the GitHub repo for continuous deployment — confirmed live: Netlify now deploys straight from GitHub, `git push` to `main` alone triggers a deploy.
- [x] Working contact form — real Netlify Form (`audit-request`) on the contact section, redirects to `thank-you.html`. Hit a real bug getting this working: the site had `ignore_html_forms: true` in Netlify's processing settings, which silently skipped form detection entirely — form appeared to submit fine (redirected correctly) but nothing was ever captured. Fixed by flipping that setting; confirmed the form is now registered with all fields + honeypot.
- [ ] **Set up form-submission email notifications** — checked and there are currently no notification hooks configured, so real leads won't email-alert you yet. Netlify dashboard → Forms → Settings → add a notification (email is simplest).
- [ ] Point the contact CTA at something better than a personal Gmail `mailto:` — a form (Formspree/Netlify Forms) or a business inbox *(pocketed — business email; the form now exists, still submits toward your personal Netlify account until you have a business one)*
- [x] Add basic analytics — GA4 wired up (`G-5H09HD2RT3`) on `index.html`
  and `thank-you.html` (skipped `404.html` — no value tracking error
  visits). Thank-you page is the real signal here: it only loads after a
  successful form submit, so GA4 traffic there is your actual lead count,
  no cross-referencing Netlify Forms needed. Worth linking this GA4
  property to Search Console (Admin → Search Console Links) so query
  data and on-site behavior show up in one place.
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
- [x] robots.txt + sitemap.xml — domain's live now, so added `sitemap.xml`
  (just `index.html`; `thank-you.html` is `noindex` so it's excluded) and
  pointed `robots.txt` at it. **Needs your action:** submit the sitemap in
  Google Search Console (Sitemaps → enter `sitemap.xml`) and use URL
  Inspection → Request Indexing on the homepage to speed up first crawl,
  now that you've added `getcambi.com` as a property.
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
  (`netlify/functions/chat.js`) calling the Anthropic API, with Cambi Growth's
  own pricing/services/process baked into the system prompt as the
  knowledge base. Simpler than full RAG (no vector DB) since the content
  is small enough to fit directly in context — upgrade to real embeddings
  only if/when a client's FAQ set gets large. Runs on `claude-haiku-4-5`
  (switched from Sonnet 5 for cost). Because a smaller model is less
  rigorously instruction-tuned and this is a public endpoint with no
  auth, added a real guardrail rather than trusting the system prompt
  alone: replies are scanned for a dollar figure that isn't in the
  known price list (derived straight from the system prompt so it can't
  drift), and swapped for a safe "let's get you a real quote" message if
  one slips through — catches the worst failure mode (a fabricated
  price shown to a prospect) even if the model ignores the "never make
  up prices" instruction. Has a per-IP rate limit (15 msgs / 10 min,
  in-memory on the function — resets on cold start, and since Netlify
  can run multiple warm instances at once, the real ceiling under
  concurrent load is higher than 15; a shared store like Netlify Blobs
  would close that gap if abuse becomes real). Only trusts Netlify's own
  edge-injected IP header for rate-limiting, not the spoofable
  `client-ip` header some callers could set themselves — if that header
  is ever missing, the request fails open (skips the rate limit) rather
  than lumping every headerless caller into one shared bucket that could
  lock unrelated visitors out of each other. A retrying client can no
  longer inflate one IP's tracked request history past the 15 cap (fixed
  a real unbounded-growth bug from the first version). `ANTHROPIC_API_KEY`
  is now set in Netlify (production scope, marked as a secret value) — the
  chatbot is fully live. Still no prompt caching and no spend alert
  configured on the Anthropic account — worth adding once there's real
  traffic.
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
- [x] Working contact/quote forms — Cambi Growth's own site now has one (see
  above)
- [x] Local business schema (JSON-LD) — added to Cambi Growth's own `index.html`
  (`ProfessionalService` type, includes the three package offers)
- [ ] Uptime monitoring — nothing is watching any site right now,
  including the client ones; UptimeRobot free tier, 10-minute setup —
  another real account signup, not something I can create for you

### Later
- [ ] Tax reserve — set aside a % of everything as it comes in, don't wait for year-end
- [ ] Revisit pricing after the first 2-3 real clients — you'll know fast whether $1,500/$2,750/$5,000 undersells the work
