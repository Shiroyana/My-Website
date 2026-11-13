import type { Metadata } from "next";
import Image from "next/image";
import { Arrow } from "@/components/Arrow";
import { HeroVisual } from "@/components/hero/HeroVisual";
import { JsonLd } from "@/components/JsonLd";
import { ShopRecord } from "@/components/ShopRecord";
import { faqJsonLd, servicesJsonLd } from "@/lib/jsonld";
import { photos } from "@/lib/photos";
import { MAIN_ACTION, clients, faqs, packages, priceLabel, site } from "@/lib/site";

/*
  type: service Â· site-kind other
  deal: hero split, nav nav-split, close close-type, footer footer-dark, rhythm surface-pairs
        (plus the blueprint hero and band, DESIGN.md), buttons solid, mark: the client's logo
  moments: word-highlight (#problem), photo-chapters (#how)
  effect: the one 3D hero (brief override of Taste's service rule, logged in .taste-skill/waivers.json)
  splits: every right column starts on column 7 (k = 6), as the hero's does
*/

export const metadata: Metadata = {
  title: { absolute: `${site.name}: ${site.brandLine}` },
  description:
    "AI booking setup for NYC HVAC, plumbing and electrical shops. We publish your prices, hours and open slots so ChatGPT and Google can find, price and book you. Free audit.",
  alternates: { canonical: "/" },
};

const chapters = [
  {
    photo: photos.street,
    title: "Step 1: the free audit",
    text: "We ask ChatGPT, Gemini and Google to find and price a job at your shop, then score it out of 100. You get a one-page report with the three fixes that matter most.",
  },
  {
    photo: photos.gauges,
    title: "Step 2: the setup",
    text: "A 90-minute price workshop with you. Then we fix your Google profile, publish your price ranges on your site and connect a booking link.",
  },
  {
    photo: photos.hands,
    title: "Step 3: jobs in your schedule",
    text: "When an assistant asks for a price and a time, it gets yours. Booking requests land in your schedule or on your phone, and you confirm each one.",
  },
];

export default function Home() {
  return (
    <>
      <JsonLd data={servicesJsonLd()} />
      <JsonLd data={faqJsonLd()} />

      {/* 1 HERO: split, blueprint sheet, the 3D frame on the right */}
      <section
        className="hero hero--split ground-inverse bp-sheet"
        data-enter
        aria-labelledby="hero-h"
      >
        <div className="wrap">
          <div className="hero-text grid hero__grid">
            <div className="hero__text span-5">
              <p className="hero__kicker">
                <span className="dot" aria-hidden="true" />
                HVAC, plumbing and electrical in all five boroughs
              </p>
              <h1 id="hero-h">AI booking setup for NYC trade shops</h1>
              <p className="hero__lead">
                When customers ask ChatGPT or Google for a plumber, the AI needs your prices, hours
                and open slots. We publish them so the job lands in your schedule.
              </p>
              <div className="btn-row">
                <a className="btn btn--primary" href={MAIN_ACTION.href}>
                  {MAIN_ACTION.label}
                  <Arrow />
                </a>
                <a className="btn btn--secondary" href="/packages">
                  See packages
                </a>
              </div>
            </div>
            <div className="hero__media span-6 start-7 hero-visual">
              <HeroVisual>
                {/* eslint-disable-next-line @next/next/no-img-element -- a generated SVG, the LCP image */}
                <img
                  className="hero-visual__still"
                  src="/hero-still.svg"
                  alt="Drawing of a three-storey mass timber frame: glulam columns and beams on a six-metre grid, with cross-laminated timber floors and the top floor still going in."
                  width={756}
                  height={630}
                  fetchPriority="high"
                  decoding="async"
                />
              </HeroVisual>
              <div className="ly-float glass-dark">
                <div className="ly-float__row">
                  <span className="ly-live">Free audit</span>
                  <span className="figures">7 checks</span>
                </div>
                <div className="ly-float__title">
                  Your shop scored out of 100, with the top 3 fixes
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2 PROBLEM: the word-highlight moment's own statement section */}
      <section
        className="section statement"
        id="problem"
        data-moment="word-highlight"
        aria-label="The problem"
      >
        <div className="wrap">
          <p className="t-label">The problem</p>
          {/* a labelled group, not a <p>: the moment splits the words and names the element with
              aria-label, which a paragraph may not carry */}
          <div className="mo-wh__text" role="group">
            AI assistants now search and even phone shops on a customer&rsquo;s behalf. When your
            prices, hours and open slots are missing, the assistant moves on and books{" "}
            <strong>the next shop</strong> it can read.
          </div>
        </div>
      </section>

      {/* 3 WHAT AI READS: the blueprint band, one record fanned out to three channels */}
      <section
        className="section ground-inverse"
        id="record"
        aria-labelledby="record-h"
        style={{ ["--h" as string]: 1 }}
      >
        <div className="wrap">
          <div className="grid">
            <div className="span-6 split-col">
              <div className="section-head">
                <h2 id="record-h">Your shop record, written so AI can read it</h2>
                <p>
                  One record of your prices, hours, service area and open slots, published on your
                  website, your Google profile and a booking link. When you change a price, we
                  change it everywhere.
                </p>
              </div>
              <p className="split-col__end muted">
                You approve every number in writing before it goes live.
              </p>
            </div>
            <div className="span-6 start-7">
              <ShopRecord />
            </div>
          </div>
        </div>
      </section>

      {/* 4 HOW IT WORKS: the photo-chapters moment, three steps */}
      <section className="section" id="how" data-moment="photo-chapters" aria-labelledby="how-h">
        <div className="wrap mo-ph">
          <div className="mo-ph__head">
            <h2 id="how-h">Three steps from audit to booked jobs</h2>
            <p>
              You approve every price before anything goes live, and you keep everything we build.
            </p>
          </div>
          <ol className="mo-ph__list">
            {chapters.map((c) => (
              <li className="mo-ph__ch" key={c.title}>
                <figure className="mo-ph__pic">
                  <Image
                    src={c.photo.src}
                    alt={c.photo.alt}
                    width={c.photo.width}
                    height={c.photo.height}
                    sizes="(max-width: 639px) 200vw, (max-width: 1279px) 100vw, 1280px"
                    style={{ objectPosition: c.photo.pos }}
                    data-source="stand-in"
                    data-subject="stand-in"
                  />
                </figure>
                <h3>{c.title}</h3>
                <p>{c.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 5 PACKAGES: glass cards on the blueprint grid */}
      <section
        className="section ground-inverse bp-sheet"
        id="packages"
        aria-labelledby="packages-h"
        style={{ ["--h" as string]: 1 }}
      >
        <div className="wrap">
          <div className="section-head">
            <h2 id="packages-h">Packages and prices</h2>
            <p>
              Start with the free audit. The setup price depends on how many jobs go in your price
              book.
            </p>
          </div>
          <div className="grid">
            {packages.map((p) => (
              <a
                key={p.id}
                href={p.id === "audit" ? "/audit" : `/packages#${p.id}`}
                className={`card card--plan ground-base glass-light span-3${p.featured ? " is-featured timber-edge" : ""}`}
              >
                <h3>{p.name}</h3>
                <p className="figures">
                  <strong>{priceLabel(p)}</strong>
                </p>
                <ul className="plan-list">
                  {p.includes.slice(0, 3).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <span className="link card__action">
                  {p.id === "audit"
                    ? "Request the audit"
                    : `See the ${p.name.toLowerCase()} details`}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 6 QUESTIONS (calm, before the last visual section) */}
      <section className="section" id="faq" aria-labelledby="faq-h">
        <div className="wrap">
          <div className="grid">
            <div className="span-6 section-head">
              <h2 id="faq-h">Questions owners ask first</h2>
              <p>
                Anything else:{" "}
                <a className="link" href={`mailto:${site.email}`}>
                  Email us
                </a>
              </p>
            </div>
            <div className="span-6 start-7 faq">
              {faqs.map((f) => (
                <details key={f.q} open>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7 WORK: the three client sites, real and live */}
      <section
        className="section ground-surface"
        id="work"
        aria-labelledby="work-h"
        style={{ ["--h" as string]: 1 }}
      >
        <div className="wrap">
          <div className="section-head">
            <h2 id="work-h">Client websites we built and run</h2>
            <p>
              Before AI booking, we built and still run these three sites. Our first NYC trade pilot
              is underway:{" "}
              <a className="link" href="/case-studies">
                See case studies
              </a>
            </p>
          </div>
          <div className="grid work-grid">
            {clients.map((c) => (
              <a
                key={c.name}
                className="card card--open span-4"
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="frame frame--photo" style={{ ["--ratio" as string]: "62.5%" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- static screenshots, already 640x400 */}
                  <img
                    className="frame__img"
                    src={c.image}
                    alt={`Home page of the ${c.name} website`}
                    width={640}
                    height={400}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <p className="t-card">{c.name}</p>
                <p>{c.line}</p>
                <span className="visually-hidden">(opens in a new tab)</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
