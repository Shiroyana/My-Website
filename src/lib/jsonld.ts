import { SITE_URL, aiLine, audit, faqs, site, tiers } from "./site";

const ORG_ID = `${SITE_URL}/#business`;

const areaServed = site.boroughs.map((b) => ({
  "@type": "AdministrativeArea",
  name: `${b}, New York City, NY`,
}));

/** Site-wide: the business itself (rendered in the root layout on every page). */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": ORG_ID,
    name: site.name,
    slogan: site.brandLine,
    description: site.description,
    url: SITE_URL,
    logo: `${SITE_URL}/brand/cambi-icon-512.png`,
    image: `${SITE_URL}/opengraph-image`,
    email: site.email,
    founder: { "@type": "Person", name: site.founder },
    address: {
      "@type": "PostalAddress",
      addressLocality: "New York",
      addressRegion: "NY",
      addressCountry: "US",
    },
    areaServed,
    knowsAbout: [
      "AI search visibility for home service businesses",
      "Google Business Profile",
      "schema.org structured data",
      "Online booking for HVAC, plumbing and electrical contractors",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Packages",
      itemListElement: [audit.id, ...tiers.map((t) => t.id), aiLine.id].map((id) => ({
        "@type": "Offer",
        itemOffered: { "@id": serviceId(id) },
      })),
    },
  };
}

function serviceId(id: string) {
  return `${SITE_URL}/packages#${id}`;
}

const audience = {
  "@type": "BusinessAudience",
  audienceType: "HVAC, plumbing and electrical contractors",
};

/**
 * One Service per offer. Only the free audit carries an Offer and a price (0). The paid plans and the
 * AI-to-AI line are described without prices: they are being piloted, and prices are published once
 * the pilots have results.
 */
export function servicesJsonLd() {
  const service = (id: string, name: string, description: string, offers: unknown) => ({
    "@type": "Service",
    "@id": serviceId(id),
    name,
    serviceType: name,
    description,
    provider: { "@id": ORG_ID },
    areaServed,
    audience,
    ...(offers ? { offers } : {}),
  });

  return {
    "@context": "https://schema.org",
    "@graph": [
      service(audit.id, audit.name, audit.summary, {
        "@type": "Offer",
        url: `${SITE_URL}/audit`,
        price: 0,
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      }),
      ...tiers.map((t) => service(t.id, t.name, t.summary, null)),
      service(aiLine.id, aiLine.name, aiLine.summary, null),
    ],
  };
}

export function faqJsonLd(list: readonly { q: string; a: string }[] = faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: list.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function breadcrumbJsonLd(name: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name, item: `${SITE_URL}${path}` },
    ],
  };
}
