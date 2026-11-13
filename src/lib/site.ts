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

export type Package = {
  id: string;
  name: string;
  /** null = the owner has not set the price yet; shown as "from $X". */
  price: number | null;
  unit: "one-time" | "month" | "free";
  summary: string;
  includes: string[];
  suits: string;
  featured?: boolean;
};

export const packages: Package[] = [
  {
    id: "audit",
    name: "Free audit",
    price: 0,
    unit: "free",
    summary:
      "Your shop scored out of 100 across seven checks, a one-page report and the three fixes that matter most.",
    includes: [
      "Google Business Profile, website and phone checked against each other",
      "ChatGPT, Gemini and Google asked to find and price a job at your shop",
      "Score out of 100 with a one-page report",
      "The top three fixes, in plain words",
    ],
    suits: "Every shop, before anything else",
  },
  {
    id: "setup",
    name: "Agent-ready setup",
    price: null,
    unit: "one-time",
    summary:
      "A price workshop with you, a cleaned-up Google profile, a services page AI can read and a booking link.",
    includes: [
      "90-minute price workshop: ranges for your 10 to 15 most common jobs",
      "Google Business Profile fixed: hours, services, area, prices, booking link",
      "A services page with your price ranges, readable by AI assistants",
      "Online booking or a request form connected to how you schedule today",
      "Before and after tests in ChatGPT, Gemini, Claude and Google",
    ],
    suits: "Shops with 1 to 10 trucks that want booked jobs from AI search",
    featured: true,
  },
  {
    id: "monthly",
    name: "Agent-ready monthly",
    price: null,
    unit: "month",
    summary:
      "Weekly checks of your hours, prices and listings, price updates when you change them, and a monthly report.",
    includes: [
      "Weekly checks that hours, prices and listings still match",
      "Price book updates whenever you change a price",
      "Monthly report: assistant test results and booking requests",
    ],
    suits: "Shops after setup that want it kept right",
  },
  {
    id: "voice",
    name: "Voice add-on",
    price: null,
    unit: "month",
    summary:
      "An AI answering service for after-hours and overflow calls that quotes from your price book and says it is an AI.",
    includes: [
      "Answers only after hours or when your line is busy, to start",
      "Quotes your ranges and takes the job details",
      "Says it is an AI at the start of every call",
      "You hear test calls before it goes live",
    ],
    suits: "Shops that miss calls on the job or after hours",
  },
];

export function priceLabel(p: Package): string {
  if (p.unit === "free") return "Free";
  const amount = p.price == null ? "$X" : `$${p.price.toLocaleString("en-US")}`;
  return p.unit === "month" ? `from ${amount} a month` : `from ${amount}`;
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
    a: "Only if you add the voice option, and only after hours or when your line is busy. It says it is an AI, and you hear test calls before it goes live.",
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
