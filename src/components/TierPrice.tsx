/**
 * Price blocks for the plan cards. Paid plans show "Coming soon": the plans are being piloted with
 * founding shops and prices are published once the pilots have results (roadmap.md, Pricing plans,
 * holds the working numbers).
 */
export function ComingSoonPrice() {
  return (
    <div className="tier-price">
      <p className="tier-price__line">
        <span className="tier-price__mode">Pricing</span>
        <strong className="tier-price__main">Coming soon</strong>
        <span className="tier-price__note">Being piloted with founding shops</span>
      </p>
    </div>
  );
}

/** The free audit's price block, the same shape so the cards line up. */
export function FreePrice() {
  return (
    <div className="tier-price">
      <p className="tier-price__line">
        <span className="tier-price__mode">Start here</span>
        <strong className="tier-price__main">Free</strong>
        <span className="tier-price__note">No card, no contract</span>
      </p>
    </div>
  );
}
