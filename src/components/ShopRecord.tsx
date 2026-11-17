import styles from "./ShopRecord.module.css";

/**
 * Home section 3's picture: one shop record drawn as a blueprint sheet, its leader lines running to
 * the three places it is published. Live text (never baked into an image), so it reads at 390.
 * The figures are an example and say so.
 */
const rows = [
  { k: "Water heater repair", v: "$250 to $450" },
  { k: "Drain cleaning", v: "$150 to $300" },
  { k: "Diagnostic fee", v: "$89" },
  { k: "Hours", v: "Mon to Sat, 7:00 to 19:00" },
  { k: "Service area", v: "Queens, Brooklyn" },
  { k: "Next open slot", v: "Thursday, 9:00" },
] as const;

const channels = [
  { name: "Your website", note: "Services page with price ranges" },
  { name: "Google Business Profile", note: "Hours, services, prices, booking link" },
  { name: "Booking link", note: "Customers request a time; you confirm" },
] as const;

export function ShopRecord() {
  return (
    <figure className={`${styles.sheet} bp-sheet`} aria-labelledby="record-title">
      <div className={styles.record}>
        <p className={styles.head} id="record-title">
          <span>Shop record</span>
          <span className={styles.example}>Example</span>
        </p>
        <dl className={styles.rows}>
          {rows.map((r) => (
            <div key={r.k} className={styles.row}>
              <dt>{r.k}</dt>
              <dd className="figures">{r.v}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* leader lines: one record fans out to three channels */}
      <svg
        className={styles.wires}
        viewBox="0 0 100 300"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          className="bp-line bp-line--hi"
          d="M0 150 H40 M40 150 V50 H100 M40 150 H100 M40 150 V250 H100"
        />
        <circle cx="0" cy="150" r="3" fill="var(--c-logo-green)" />
      </svg>
      <svg
        className={styles.wiresDown}
        viewBox="0 0 300 40"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          className="bp-line bp-line--hi"
          d="M150 0 V20 M50 20 H250 M50 20 V40 M150 20 V40 M250 20 V40"
        />
      </svg>

      <ul className={styles.channels}>
        {channels.map((c) => (
          <li key={c.name} className={styles.channel}>
            <span className={styles.channelName}>{c.name}</span>
            <span className={styles.channelNote}>{c.note}</span>
          </li>
        ))}
      </ul>
    </figure>
  );
}
