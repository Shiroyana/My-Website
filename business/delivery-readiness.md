# Delivery Readiness — Can We Actually Build What We Sell?

Honest audit: if someone bought Growth Partner + every add-on today, what
could Oakline actually deliver, and what's still vaporware? Organized by
what's proven, what just needs setup, and what needs real building.

**Bottom line:** the *website* half of every tier is fully deliverable
today — that's proven by AAFARMA and AGM. The gap is almost entirely in
the *automation/AI* half: chatbot, CRM, SMS/email follow-ups, missed-call
text-back, and the phone assistant. None of that exists yet, and it's
exactly the stuff that makes Growth and Growth Partner worth more than
Foundation. That's the real priority list below.

---

## ✅ Fully proven — already built, demonstrated on a real site

- Multi-page responsive websites, fast-loading, hand-coded — AAFARMA (6
  pages) and AGM (multi-page catalog) both prove this at production
  quality, with real "under 1s load" numbers to back it up.
- SSL & hosting — Netlify, proven (this site + the deploy workflow).
- Landing pages, service-area pages, review showcases, FAQ sections,
  before/after galleries — all just page-building, no new capability
  needed, mechanically identical to what's already shipped.
- Minor content updates — direct code edits, no tooling gap.
- RAG / AI chat infrastructure — **you've already built this in Stash**
  (transcription → tagging → embeddings → chat-over-your-data). This is
  the single biggest asset for closing the chatbot/knowledge-base gap
  below — it's a productization problem, not a from-scratch build.

## ⚠️ Know-how exists, but not yet set up anywhere — quick wins

These don't need new skills, just an hour of setup each, and none are
blocked by the pocketed items (domain/LLC/etc.):

- **Working contact/quote-request forms** — currently even Oakline's own
  site is just `mailto:`. Wire up Netlify Forms (free, since we're
  already on Netlify) on Oakline's own site first as the proof, then
  it's the same pattern for every client site.
- **Local business schema markup (JSON-LD)** — Oakline's own site doesn't
  have this either. Cheap to add, and it's literally part of what Growth
  tier promises ("local schema optimization") — should eat your own
  cooking here first.
- **Uptime monitoring** — nothing is watching any of these sites right
  now, including the client ones. UptimeRobot's free tier covers this in
  10 minutes and is a real, checkable deliverable ("your site was up
  99.98% this month" is a genuinely good report line).
- **Google Business Profile optimization** — this is a checklist-driven
  service (claim, categories, photos, posts, Q&A, review-response
  cadence), not code. If you haven't done one before, do one dry run —
  on Oakline's own (eventual) local presence, or offer it free to
  AAFARMA/AGM as a portfolio deepener.

## ❌ Real gaps — need to actually build or set up before selling

Ranked by what's blocking the most expensive tier promises:

1. **Chatbot trained on client FAQs** (Growth tier — the most popular
   package). Path: adapt Stash's RAG pipeline into a small embeddable
   widget — ingest a client's FAQ/service pages instead of videos, same
   embed-and-retrieve pattern. This is the highest-leverage build since
   it unlocks Growth, Growth Partner, *and* the FAQ-assistant line in
   Growth Partner in one shot.
2. **CRM integration + lead routing**. No CRM is chosen yet. Cheapest
   path: HubSpot free tier or Airtable as the CRM, form submissions
   webhook straight into it. This one decision unblocks "CRM
   integration," "instant lead qualification & routing," and gives you
   something concrete to show in the monthly performance report.
3. **Email & SMS follow-ups, missed-call text-back**. Needs a
   transactional email tool (Resend/Postmark — cheap, simple) and an SMS
   provider (Twilio) wired to whatever CRM you pick in #2. Missed-call
   text-back specifically needs the client's business phone routed
   through a system that can trigger on a missed call — this is the
   most operationally involved piece since it touches the client's real
   phone line, not just their website.
4. **Virtual/AI Phone Assistant add-on**. The most technically
   substantial gap on the whole list — needs a voice AI layer (e.g.
   Bland.ai, Retell, or Twilio + a voice model) that can actually answer
   and triage calls. Don't sell this add-on until it's built and tested
   on a throwaway number — this is the one place where overselling would
   be genuinely embarrassing.
5. **Review Automation add-on**. Needs a post-job trigger (manual for
   now is fine — client texts you "job done," you fire the request) into
   an email/SMS review-request flow. Can start manual/semi-automated and
   automate later; don't need to block selling this one on full
   automation.
6. **Monthly performance report template**. Needs a defined format
   (traffic, leads, uptime, any SEO movement) — mock one up using
   AAFARMA or AGM's real data as the template before the first client
   report is due.
7. **"Business review" / monthly strategy session**. Just needs a
   recurring-meeting template (agenda: last month's numbers, what
   changed, what's next) — lowest-effort item on this list, do it last
   since it's cheap whenever you get to it.

## Suggested order

Given the Growth tier is "Most Popular" and is where most early clients
will land, the chatbot (#1) and CRM/lead-routing (#2) are the two things
worth building *before* actively selling, since they're core to Growth,
not just Growth Partner. Everything else can honestly be framed to an
early client as "rolling out over your first month" — the process
section already sets that expectation ("Monthly Growth: ongoing
optimization... this is where growth compounds").
