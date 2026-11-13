import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What Cambi Growth collects through this website, why, and how to have it deleted.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <section className="section legal" aria-labelledby="hero-h">
      <div className="wrap">
        <div className="measure stack-5">
          <h1 id="hero-h" className="t-h2">
            Privacy
          </h1>
          <p className="muted t-small">Last updated November 2026</p>

          <h2 className="t-h3">What we collect</h2>
          <p>
            When you request an audit we receive the business name, trade, borough, website, phone
            number and email you type in. We use them only to run your audit and to reply to you.
          </p>

          <h2 className="t-h3">Where it is kept</h2>
          <p>
            Form submissions are stored by our host, Netlify, in their forms service. To limit spam,
            we keep a one-way hash of your IP address for one hour; we never store the address
            itself.
          </p>

          <h2 className="t-h3">Analytics</h2>
          <p>
            We count visits with Umami, which uses no cookies and does not identify you or follow
            you to other sites.
          </p>

          <h2 className="t-h3">What we never do</h2>
          <p>
            We do not sell or share your details, and we never call or text you with automated
            systems.
          </p>

          <h2 className="t-h3">Deleting your details</h2>
          <p>
            Email{" "}
            <a className="link" href={`mailto:${site.email}`}>
              {site.email}
            </a>{" "}
            and we delete everything we hold about you within 30 days.
          </p>
        </div>
      </div>
    </section>
  );
}
