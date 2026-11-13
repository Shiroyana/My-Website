import { rubric } from "@/lib/site";
import styles from "./SampleReport.module.css";

/**
 * The one-page readiness report drawn as an architect's sheet: title block in the lower right, the
 * score large, the seven checks with points, and teal leader lines to the three fixes.
 * Every figure here is an example for a made-up shop, and the sheet says so in its title block.
 */
const example = [
  { got: 14, note: "Hours on Google differ from the website" },
  { got: 0, note: "No prices anywhere", fix: 1 },
  { got: 0, note: "No booking or request form", fix: 2 },
  { got: 15, note: "Answered on the second ring" },
  { got: 0, note: "No structured data", fix: 3 },
  { got: 10, note: "Gave a range for a drain job" },
  { got: 5, note: "License shown, insurance not" },
] as const;

const total = example.reduce((s, r) => s + r.got, 0);

export function SampleReport() {
  return (
    <figure className={`${styles.sheet} timber-edge`} aria-labelledby="sample-title">
      <div className={styles.top}>
        <div>
          <p className={styles.kicker}>AI readiness report</p>
          <p className={styles.score}>
            <span className="figures">{total}</span>
            <span className={styles.outOf}>/ 100</span>
          </p>
        </div>
        <ol className={styles.fixes} aria-label="Top three fixes">
          <li>Publish price ranges for your 10 most common jobs</li>
          <li>Add a booking link to your Google profile</li>
          <li>Add structured data to your services page</li>
        </ol>
      </div>

      <table className={styles.table}>
        <caption className="visually-hidden">Seven checks with points scored</caption>
        <thead>
          <tr>
            <th scope="col">Check</th>
            <th scope="col">What we found</th>
            <th scope="col" className={styles.num}>
              Points
            </th>
          </tr>
        </thead>
        <tbody>
          {rubric.map((r, i) => {
            const e = example[i];
            const fix = "fix" in e ? e.fix : undefined;
            return (
              <tr key={r.check}>
                <th scope="row">{r.check}</th>
                <td>
                  {fix ? <span className={styles.fixMark}>Fix {fix}</span> : null}
                  {e.note}
                </td>
                <td className={`${styles.num} figures`}>
                  {e.got} / {r.points}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <dl className={styles.titleBlock} id="sample-title">
        <div>
          <dt>Shop</dt>
          <dd>Example plumbing shop</dd>
        </div>
        <div>
          <dt>Borough</dt>
          <dd>Queens</dd>
        </div>
        <div>
          <dt>Sheet</dt>
          <dd>Sample report</dd>
        </div>
      </dl>
    </figure>
  );
}
