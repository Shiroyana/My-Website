/**
 * One source of truth for the facts the site states. Pages, JSON-LD and llms.txt all read from here,
 * so a price or an email changes in one place.
 */

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://getcambi.com").replace(
  /\/$/,
  "",
);

export const site = {
  name: "Cambi Growth",
  brandLine: "Get booked by AI, not just found",
  description:
    "Cambi Growth sets up NYC HVAC, plumbing and electrical shops so AI assistants like ChatGPT and Google can find their prices, hours and open slots, and book jobs into their schedule.",
  email: "getcambi@gmail.com",
  founder: "Yan",
  city: "New York City",
  boroughs: ["Manhattan", "Brooklyn", "Queens", "The Bronx", "Staten Island"],
  trades: ["HVAC", "Plumbing", "Electrical"],
} as const;

/** Main action, word for word everywhere it appears (Taste copy rule 5). */
export const MAIN_ACTION = { label: "Get my free audit", href: "/audit" } as const;

/**
 * The plans. Every shop starts with the free audit. The paid tiers are being piloted, so the site
 * shows "Coming soon" in place of prices; the working numbers below (and in roadmap.md, Pricing
 * plans) are hypotheses and are not rendered anywhere until the pilots have results.
 */
export const audit = {
  id: "audit",
  name: "Free audit",
  summary:
    "Your shop scored out of 100 across seven checks, a one-page report and the three fixes that matter most.",
  includes: [
    "ChatGPT, Gemini and Google asked to find and price a job at your shop",
    "Google Business Profile, website and phone checked against each other",
    "Score out of 100 with a one-page report and the top three fixes",
  ],
  fits: "Every shop, before anything else",
} as const;

export type Tier = {
  id: "starter" | "booked" | "partner";
  name: string;
  fits: string;
  setup: number;
  monthly: number;
  /** $0 down: this monthly for ZERO_DOWN_MONTHS, then `monthly` */
  zeroDownMonthly: number;
  summary: string;
  includes: string[];
  featured?: boolean;
};

export const ZERO_DOWN_MONTHS = 12;

export const tiers: Tier[] = [
  {
    id: "starter",
    name: "Starter",
    fits: "1 to 3 trucks",
    setup: 2250,
    monthly: 375,
    zeroDownMonthly: 600,
    summary:
      "Your prices, hours and area published where AI assistants can read them, with a request form you confirm.",
    includes: [
      "AI-readable pages added to your website (a full new website is available as an add-on)",
      "Price book for your 10 most common jobs",
      "A direct connection for AI assistants (MCP), in testing with pilot shops",
      "Google Business Profile cleaned up, with prices and a request link",
      "Request form you confirm within 15 minutes",
      "Monthly checks, up to 2 price updates a month, and a report of every AI agent that asked",
    ],
  },
  {
    id: "booked",
    name: "Booked",
    fits: "4 to 10 trucks, on Jobber, Housecall Pro, ServiceTitan or a calendar",
    setup: 3750,
    monthly: 600,
    zeroDownMonthly: 940,
    summary:
      "Live open slots from your schedule, so AI assistants can request real bookings that you confirm.",
    includes: [
      "Everything in Starter, plus live open slots from your scheduling tool or calendar",
      "Booking requests from verified AI agents, which you confirm (coming with the pilots)",
      "Price book for your top 20 jobs, plus diagnostic and emergency fees",
      "A page for each service and each borough you cover",
      "Weekly checks and unlimited price updates",
      "New AI booking channels added as they launch, at a standard setup fee",
    ],
    featured: true,
  },
  {
    id: "partner",
    name: "Growth Partner",
    fits: "Multi-crew shops that want to be first on every new AI channel",
    setup: 6000,
    monthly: 1125,
    zeroDownMonthly: 1650,
    summary: "Everything in Booked, first in line for every new AI channel, and a say in what we build.",
    includes: [
      "Everything in Booked, for every trade you run",
      "New AI channels first, with no setup fee",
      "Your own allow and block rules for each AI agent",
      "Quarterly strategy review",
      "Quarterly roadmap call with other partner shops",
    ],
  },
];

/** The AI-to-AI line: an opt-in add-on, priced on request while it is tested (roadmap H9). */
export const aiLine = {
  id: "ai-line",
  name: "AI-to-AI line",
  summary:
    "An optional line that only talks to other AIs, like Google’s assistant calling to check your prices. People who call always reach you.",
  includes: [
    "Answers calls placed by AI assistants only, never people",
    "Gives your price ranges, hours and area from your price book",
    "Never takes a booking by phone: bookings go through you",
    "Off by default; you turn it on",
  ],
} as const;

export const money = (n: number) => `$${n.toLocaleString("en-US")}`;

/** "$2,250 setup + $375/mo" */
export function upfrontLabel(t: Tier) {
  return `${money(t.setup)} setup + ${money(t.monthly)}/mo`;
}

/** "$600/mo for 12 months, then $375/mo" */
export function zeroDownLabel(t: Tier) {
  return `${money(t.zeroDownMonthly)}/mo for ${ZERO_DOWN_MONTHS} months, then ${money(t.monthly)}/mo`;
}

/** The seven checks of the Agent Readiness Score (from the pivot plan's rubric). */
export const rubric = [
  { check: "Google Business Profile complete and accurate", points: 20 },
  { check: "Prices or ranges published for common jobs", points: 20 },
  { check: "Online booking or a request form with real availability", points: 15 },
  { check: "Phone answered within business hours", points: 15 },
  { check: "Structured data on the website", points: 10 },
  { check: "Gives a price or range on the phone", points: 10 },
  { check: "License and insurance visible and verifiable", points: 10 },
] as const;

export const faqs = [
  {
    q: "Do I have to publish exact prices?",
    a: "No. You publish ranges for your common jobs, plus your diagnostic and emergency fees. You set every number and approve it in writing before it goes live.",
  },
  {
    q: "Will a robot answer my phone?",
    a: "No. People who call always reach you or your team. The only voice option is an add-on that talks to other AIs, like Google’s assistant calling to check your prices, and it stays off unless you turn it on.",
  },
  {
    q: "Who are these AI agents booking my jobs?",
    a: "We check which AI assistant is asking and who it acts for before it can see your open slots or request a booking. Your monthly report lists every one, and you confirm each booking yourself.",
  },
  {
    q: "Do I need new scheduling software?",
    a: "No. We work with the booking tool you already use, such as Jobber, Housecall Pro or ServiceTitan, or a shared calendar if you use none.",
  },
  {
    q: "Who owns my prices and data?",
    a: "You do. If you stop, you keep everything we built, and we remove our access the same week.",
  },
  {
    q: "What is in the free audit?",
    a: "We check your Google profile, website, prices, booking, phone answer and licenses, ask ChatGPT, Gemini and Google to price a job at your shop, and send you a score out of 100 with the top three fixes.",
  },
] as const;

/** Existing web design clients (real, with screenshots in /public/work). */
export const clients = [
  {
    name: "AAFARMA Inc.",
    url: "https://aafarmainc.com/",
    image: "/work/aafarma.jpg",
    line: "A neighborhood pharmacy: refills, vaccinations, notary and passport photos, built to turn a search into a call.",
  },
  {
    name: "African Green Manor",
    url: "https://agmgolfcarts.co.za/home.html",
    image: "/work/agm.jpg",
    line: "A five-model golf cart dealership: an online catalog built for browsing and lead capture.",
  },
  {
    name: "VitalCare Essential Supplies Corp.",
    url: "https://vitalcaredmesupplies.com/",
    image: "/work/vitalcare.jpg",
    line: "A Lynbrook, NY medical equipment supplier: a 139-product catalog, a referral path for provider offices and appointment booking.",
  },
] as const;

export const nav = [
  { label: "Process", href: "/#how" },
  { label: "Packages", href: "/packages" },
  { label: "Case studies", href: "/case-studies" },
  { label: "About", href: "/about" },
] as const;
