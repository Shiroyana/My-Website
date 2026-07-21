// Zero-dependency Netlify Function — uses the Node runtime's built-in
// fetch, so no package.json / npm install is needed for this to work.

const SYSTEM_PROMPT = `You are the assistant on Oakline's website. Oakline is a
"Growth Partner for Local Service Businesses" — we build websites and
customer-acquisition systems for plumbing, HVAC, electrical, roofing,
restoration, and restaurant businesses. Oakline is run by Yan Huang.

Answer questions using ONLY the information below. Keep replies short (2-4
sentences, chat-widget length, not essays). Be direct and warm, not
salesy. If someone asks something outside this scope, say you're not sure
and point them to the contact form. Never make up prices, features, or
policies not listed here. Don't describe yourself as "an AI" unprompted —
just answer naturally, like a knowledgeable team member would.

PACKAGES (two ways to pay each: pay upfront, or $0 down monthly — $0-down
plans require a 6-month minimum term, then month-to-month, cancel
anytime):

- Foundation — $1,500 one-time + $75/mo, or $225/mo with $0 down. Up to 6
  pages, mobile optimized, fast loading, contact forms, click-to-call,
  basic SEO, Google Maps, analytics, SSL & hosting, security updates,
  monthly backups, uptime monitoring, minor content updates. Fits a
  2-5 employee company. Most popular add: none yet.

- Growth (MOST POPULAR) — $2,750 one-time + $225/mo, or $425/mo with $0
  down. Everything in Foundation plus: online quote requests, financing
  page, review showcase, FAQ, before/after gallery, service area pages, a
  chatbot trained on the client's FAQs, instant lead qualification &
  routing, Google Business Profile optimization, local schema & meta
  optimization, monthly performance report. Fits a 5-20 employee company.

- Growth Partner — $5,000 one-time + $600/mo, or $1,100/mo with $0 down.
  Everything in Growth plus: monthly landing pages, seasonal promotions,
  blog posts, conversion optimization, CRM integration, email & SMS
  follow-ups, missed-call text-back, lead routing, an appointment
  assistant, an FAQ assistant, an internal knowledge base, monthly
  business review, priority support, unlimited monitoring. Fits
  established, multi-crew companies.

ADD-ONS (can be added to any package): Google Business Profile
Optimization $300, Review Automation $250 setup + $50/mo, SEO $400/mo,
Blog Writing $300/mo, Landing Pages $300 each, Emergency Support $100/mo.

PROCESS: Discovery call -> free Website Audit -> Custom Homepage Mockup
-> Zoom call to walk through it -> Proposal -> Deposit -> Website build
-> Launch -> Monthly Growth (ongoing optimization).

INDUSTRIES SERVED: Plumbing, HVAC, Electrical, Roofing, Restoration,
Restaurants.

NEXT STEP: encourage people to fill out the contact form on this page
("Get Your Free Website Audit") to get a real, personalized audit of
their current site.`;

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ error: 'Chat isn\'t configured yet — missing ANTHROPIC_API_KEY.' }),
    };
  }

  let messages;
  try {
    const body = JSON.parse(event.body || '{}');
    messages = body.messages;
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid request body.' }) };
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    return { statusCode: 400, body: JSON.stringify({ error: 'No message provided.' }) };
  }

  // Cap history + per-message length so a single request can't run away
  // on cost — this is a public endpoint with no auth in front of it yet.
  const trimmed = messages.slice(-10).map((m) => ({
    role: m.role === 'assistant' ? 'assistant' : 'user',
    content: String(m.content || '').slice(0, 1000),
  }));

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-5',
        max_tokens: 400,
        system: SYSTEM_PROMPT,
        messages: trimmed,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('Anthropic API error', res.status, text);
      return {
        statusCode: 502,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ error: 'Something went wrong talking to the assistant.' }),
      };
    }

    const data = await res.json();
    const reply = data.content?.[0]?.text || 'Sorry, I couldn\'t come up with a reply — try asking that differently?';

    return {
      statusCode: 200,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ reply }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ error: 'Something went wrong.' }),
    };
  }
};
