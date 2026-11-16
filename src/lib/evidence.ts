/**
 * Dated, sourced evidence that AI assistants are already calling and booking local services.
 * Every line here was checked against the linked page (Nov 2026). Quote, do not round up; add a new
 * entry only with a source you have opened.
 */
export type Evidence = {
  /** when it happened, as the source dates it */
  when: string;
  /** ISO date for <time>, as precise as the source allows */
  iso: string;
  fact: string;
  source: { name: string; url: string };
};

export const evidence: Evidence[] = [
  {
    when: "Jan 2025",
    iso: "2025-01",
    fact: "OpenAI’s Operator agent can “find, message and hire” pros on Thumbtack for a user, such as booking an emergency plumber to fix a leak.",
    source: {
      name: "Thumbtack",
      url: "https://press.thumbtack.com/announcements/thumbtack-launches-as-home-services-collaborator-for-openais-new-operator",
    },
  },
  {
    when: "Jan 2025",
    iso: "2025-01-30",
    fact: "Google starts testing “Ask for me”: its AI phones local businesses to ask about prices and availability for a customer.",
    source: { name: "9to5Google", url: "https://9to5google.com/2025/01/30/google-ask-for-me-lab" },
  },
  {
    when: "Nov 2025",
    iso: "2025-11",
    fact: "Price-check calls from Google’s AI rose over 300% in a month; plumbing averaged over 650% monthly growth. 26% of the calls went unanswered, and 48% of the answered ones got no price.",
    source: {
      name: "Invoca, Dec 2025",
      url: "https://www.invoca.com/press-release/new-invoca-study-finds-pricing-request-phone-calls-from-googles-ai-surged-over-300-in-november",
    },
  },
  {
    when: "May 2026",
    iso: "2026-05-19",
    fact: "Google: for home repair, “you can ask Google to call businesses on your behalf”, and agentic booking in Search expands, rolling out to everyone in the US this summer.",
    source: {
      name: "Google",
      url: "https://blog.google/products-and-platforms/products/search/search-io-2026/",
    },
  },
  {
    when: "Jul 2026",
    iso: "2026-07-13",
    fact: "Phone calls referred by ChatGPT turn into leads 49% of the time, the highest of any marketing channel.",
    source: {
      name: "Invoca, Jul 2026",
      url: "https://www.healthcaredive.com/press-release/20260710-new-invoca-data-finds-the-best-leads-now-start-in-chatgpt/",
    },
  },
];
