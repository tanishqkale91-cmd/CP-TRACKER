import { Link } from "react-router-dom";
import { useCP } from "../../context/useCP";
import { ProfileSkeleton } from "../Skeletons";

function valueOrUnavailable(value) {
  return value == null || value === "" ? "Unavailable" : String(value);
}

export default function Codeforce() {
  const { cfdata, cfStatus, lcusername, cfusername, searchProfiles } = useCP();
  const cf = cfdata?.status === "OK" ? cfdata.result?.[0] : null;
  const rows = cf ? [
    ["Current rating", valueOrUnavailable(cf.rating)],
    ["Maximum rating", valueOrUnavailable(cf.maxRating)],
    ["Current rank", cf.rank || "Unrated"],
    ["Maximum rank", cf.maxRank || "Unavailable"],
    ["Contribution", cf.contribution == null ? "Unavailable" : `${cf.contribution >= 0 ? "+" : ""}${cf.contribution}`],
    ["Friend count", valueOrUnavailable(cf.friendOfCount)],
  ] : [];
  const details = cf ? [["Organization", cf.organization], ["City", cf.city], ["Country", cf.country]].filter(([, value]) => value) : [];

  return (
    <main className="page-shell">
      <section className="page-heading" aria-labelledby="codeforces-title">
        <span className="eyebrow">// 01 CODEFORCES PROFILE</span>
        <h1 className="page-title" id="codeforces-title">Codeforces performance</h1>
        <p className="lede">Your Codeforces profile and competitive programming statistics.</p>
      </section>

      {cf && (
        <>
          <section className="profile-list" aria-label="Codeforces profile summary">
            <article className="profile-row">
              {(cf.titlePhoto || cf.avatar) && <img className="profile-avatar" src={cf.titlePhoto || cf.avatar} alt={`${cf.handle || "Codeforces user"} avatar`} width="64" height="64" />}
              <div>
                <span className="profile-platform">CODEFORCES</span>
                <h2 className="profile-name">{cf.handle || "Codeforces user"}</h2>
                <p className="profile-subtitle">{cf.rank || "Unrated"}</p>
              </div>
              <div className="profile-stat">
                <span className="profile-stat-label">CURRENT RATING</span>
                <span className="profile-stat-value">{valueOrUnavailable(cf.rating)}</span>
              </div>
            </article>
          </section>

          <section className="section" aria-labelledby="cf-stats-title">
            <div className="section-header">
              <div>
                <span className="eyebrow">// 02 RATING AND CONTRIBUTION</span>
                <h2 className="section-title" id="cf-stats-title">Profile statistics</h2>
              </div>
            </div>
            <table className="metric-table">
              <thead><tr><th scope="col">Metric</th><th scope="col">Value</th></tr></thead>
              <tbody>{rows.map(([label, value]) => <tr key={label}><th scope="row">{label}</th><td>{value}</td></tr>)}</tbody>
            </table>
          </section>

          {details.length > 0 && (
            <section className="section" aria-labelledby="cf-details-title">
              <div className="section-header">
                <div>
                  <span className="eyebrow">// 03 PROFILE DETAILS</span>
                  <h2 className="section-title" id="cf-details-title">Public profile details</h2>
                </div>
              </div>
              <table className="metric-table">
                <tbody>{details.map(([label, value]) => <tr key={label}><th scope="row">{label}</th><td>{value}</td></tr>)}</tbody>
              </table>
            </section>
          )}
        </>
      )}

      {cfStatus.state === "loading" && <section className="section" aria-label="Loading Codeforces profile"><ProfileSkeleton label="Codeforces" /></section>}
      {cfStatus.state === "error" && (
        <section className="section empty-state" role="alert">
          <h2>Profile lookup failed</h2>
          <p>{cfStatus.message}</p>
          <button className="retry-button" type="button" onClick={() => searchProfiles(lcusername, cfusername)}>Retry Codeforces lookup</button>
        </section>
      )}
      {cfStatus.state === "idle" && (
        <section className="section empty-state">
          <h2>No Codeforces profile loaded</h2>
          <p>Search for a Codeforces username on the home page to view its rating and profile details.</p>
          <Link className="button" to="/">Go to profile search</Link>
        </section>
      )}
    </main>
  );
}
