import { SITE_URL, faqs, packages, site, type Package } from "./site";

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
      itemListElement: packages.map((p) => ({
        "@type": "Offer",
        itemOffered: { "@id": serviceId(p) },
      })),
    },
  };
}

function serviceId(p: Package) {
  return `${SITE_URL}/packages#${p.id}`;
}

/** One Service + Offer per package. Prices the owner has not set are left out of the Offer. */
export function servicesJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": packages.map((p) => {
      const offer: Record<string, unknown> = {
        "@type": "Offer",
        url: p.id === "audit" ? `${SITE_URL}/audit` : serviceId(p),
        availability: "https://schema.org/InStock",
        areaServed,
      };
      if (p.price != null) {
        offer.priceCurrency = "USD";
        if (p.unit === "month") {
          offer.priceSpecification = {
            "@type": "UnitPriceSpecification",
            price: p.price,
            priceCurrency: "USD",
            unitText: "MONTH",
            referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "MON" },
          };
        } else {
          offer.price = p.price;
        }
      }
      return {
        "@type": "Service",
        "@id": serviceId(p),
        name: p.name,
        serviceType: p.name,
        description: p.summary,
        provider: { "@id": ORG_ID },
        areaServed,
        audience: {
          "@type": "BusinessAudience",
          audienceType: "HVAC, plumbing and electrical contractors",
        },
        offers: offer,
      };
    }),
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
