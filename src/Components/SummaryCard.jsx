import { useCP } from "../context/useCP";

function display(value) {
  if (value == null || value === "") return "Unavailable";
  const number = Number(value);
  return Number.isFinite(number) ? number.toLocaleString() : String(value);
}

export default function SummaryCard() {
  const { lcdata, cfdata } = useCP();
  const metrics = [];
  if (lcdata) {
    metrics.push(
      { title: "Problems solved", platform: "LeetCode", value: display(lcdata.solvedProblem) },
      { title: "Global ranking", platform: "LeetCode", value: lcdata.ranking == null ? "Unavailable" : `#${display(lcdata.ranking)}` },
    );
  }
  const cf = cfdata?.status === "OK" ? cfdata.result?.[0] : null;
  if (cf) {
    metrics.push(
      { title: "Current rating", platform: "Codeforces", value: display(cf.rating) },
      { title: "Maximum rating", platform: "Codeforces", value: display(cf.maxRating) },
    );
  }
  if (!metrics.length) return null;

  return (
    <section className="section" aria-labelledby="summary-title">
      <div className="section-header">
        <div>
          <span className="eyebrow">// 03 PERFORMANCE SUMMARY</span>
          <h2 className="section-title" id="summary-title">Performance overview</h2>
          <p className="section-note">Your competitive programming statistics.</p>
        </div>
      </div>
      <table className="metric-table">
        <thead>
          <tr><th scope="col">Metric</th><th scope="col">Platform</th><th scope="col">Value</th></tr>
        </thead>
        <tbody>
          {metrics.map((metric) => (
            <tr key={`${metric.platform}-${metric.title}`}>
              <th scope="row">{metric.title}</th>
              <td className="metric-platform">{metric.platform}</td>
              <td>{metric.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
