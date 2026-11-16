import { ZERO_DOWN_MONTHS, money, type Tier } from "@/lib/site";

/**
 * Both ways to pay, always in the HTML (crawlers and AI assistants read both). The PayToggle on the
 * section shows one at a time; without JavaScript both stay visible.
 */
export function TierPrice({ tier }: { tier: Tier }) {
  return (
    <div className="tier-price figures">
      <p className="tier-price__line" data-pay="zerodown">
        <span className="tier-price__mode">$0 down</span>
        <strong className="tier-price__main">{money(tier.zeroDownMonthly)}/mo</strong>
        <span className="tier-price__note">
          for {ZERO_DOWN_MONTHS} months, then {money(tier.monthly)}/mo
        </span>
      </p>
      <p className="tier-price__line" data-pay="upfront">
        <span className="tier-price__mode">Standard</span>
        <strong className="tier-price__main">{money(tier.monthly)}/mo</strong>
        <span className="tier-price__note">+ {money(tier.setup)} setup</span>
      </p>
    </div>
  );
}

/** The free audit's price block, the same shape as a tier's so the cards line up. */
export function FreePrice() {
  return (
    <div className="tier-price figures">
      <p className="tier-price__line">
        <span className="tier-price__mode">Start here</span>
        <strong className="tier-price__main">Free</strong>
        <span className="tier-price__note">No card, no contract</span>
      </p>
    </div>
  );
}
