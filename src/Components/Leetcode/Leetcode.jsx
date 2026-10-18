import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { useCP } from "../../context/useCP";
import { ChartSkeleton, ProfileSkeleton } from "../Skeletons";

const DifficultyChart = lazy(() => import("../DifficultyChart"));
const RatingChart = lazy(() => import("../RatingChart"));
const SkillStats = lazy(() => import("../SkillStats"));

function Leetcode() {
  const { lcdata, lcusername, cfusername, search, lcStatus, searchProfiles } = useCP();
  const lookupStarted = Boolean(lcusername && search > 0);

  return (
    <main className="page-shell">
      <section className="page-heading" aria-labelledby="leetcode-title">
        <span className="eyebrow">// 01 LEETCODE PROFILE</span>
        <h1 className="page-title" id="leetcode-title">LeetCode performance</h1>
        <p className="lede">Your difficulty breakdown and topic level analysis from LeetCode.</p>
      </section>

      {lcStatus.state === "loading" && <section className="profile-list" aria-label="Loading LeetCode profile"><ProfileSkeleton label="LeetCode" /></section>}
      {lcdata && (
        <section className="profile-list" aria-label="LeetCode profile summary">
          <article className={`profile-row${lcdata.avatar ? "" : " profile-row--no-avatar"}`}>
            {lcdata.avatar && <img className="profile-avatar" src={lcdata.avatar} alt={`${lcdata.name || lcdata.username || "LeetCode user"} avatar`} width="64" height="64" />}
            <div>
              <span className="profile-platform">LEETCODE</span>
              <h2 className="profile-name">{lcdata.name || lcdata.username || "LeetCode user"}</h2>
              <p className="profile-subtitle">@{lcdata.username || lcusername}</p>
            </div>
            <div className="profile-stat">
              <span className="profile-stat-label">GLOBAL RANK</span>
              <span className="profile-stat-value">{lcdata.ranking != null && Number.isFinite(Number(lcdata.ranking)) ? `#${Number(lcdata.ranking).toLocaleString()}` : "Unavailable"}</span>
            </div>
          </article>
        </section>
      )}

      {lcdata && (
        <section className="section" aria-labelledby="lc-summary-title">
          <div className="section-header"><div><span className="eyebrow">// 02 SOLVING SUMMARY</span><h2 className="section-title" id="lc-summary-title">Problems solved</h2></div></div>
          <table className="metric-table">
            <tbody><tr><th scope="row">Total problems solved</th><td>{lcdata.solvedProblem ?? "Unavailable"}</td></tr><tr><th scope="row">Global ranking</th><td>{lcdata.ranking == null || !Number.isFinite(Number(lcdata.ranking)) ? "Unavailable" : `#${Number(lcdata.ranking).toLocaleString()}`}</td></tr></tbody>
          </table>
        </section>
      )}

      {lcStatus.state === "error" && (
        <section className="section empty-state" role="alert">
          <h2>Profile lookup failed</h2>
          <p>{lcStatus.message}</p>
          <button className="retry-button" type="button" onClick={() => searchProfiles(lcusername, cfusername)}>Retry LeetCode lookup</button>
        </section>
      )}

      {(lcdata || lookupStarted) && (
        <section className="section" aria-labelledby="lc-analytics-title">
          <div className="section-header"><div><span className="eyebrow">// 03 ANALYTICS</span><h2 className="section-title" id="lc-analytics-title">Performance analysis</h2></div></div>
          <div className="analytics-layout">
            <section className="chart-panel" aria-labelledby="lc-difficulty-title">
              <h3 className="chart-title" id="lc-difficulty-title">Difficulty breakdown</h3>
              <p className="chart-note">Problems solved by difficulty</p>
              <Suspense fallback={<ChartSkeleton label="difficulty totals" />}><DifficultyChart /></Suspense>
            </section>
            <section className="chart-panel" aria-labelledby="lc-topics-title">
              <h3 className="chart-title" id="lc-topics-title">Topic analysis</h3>
              <p className="chart-note">Your strongest and weakest areas</p>
              <Suspense fallback={<ChartSkeleton label="topic statistics" />}><SkillStats /></Suspense>
            </section>
          </div>
          <section className="chart-panel section" aria-labelledby="lc-rating-title">
            <h3 className="chart-title" id="lc-rating-title">Contest rating history</h3>
            <Suspense fallback={<ChartSkeleton label="contest rating history" />}><RatingChart /></Suspense>
          </section>
        </section>
      )}

      {!lcdata && lcStatus.state === "idle" && (
        <section className="section empty-state">
          <h2>No LeetCode profile loaded</h2>
          <p>Search for a LeetCode username on the home page to see profile and solving analytics.</p>
          <Link className="button" to="/">Go to profile search</Link>
        </section>
      )}
    </main>
  );
}

export default Leetcode;
