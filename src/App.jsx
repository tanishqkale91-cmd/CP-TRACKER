import { Suspense, lazy, useState } from "react";
import SummaryCard from "./Components/SummaryCard";
import { ChartSkeleton, ProfileSkeleton } from "./Components/Skeletons";
import { useCP } from "./context/useCP";

const DifficultyChart = lazy(() => import("./Components/DifficultyChart"));
const RatingChart = lazy(() => import("./Components/RatingChart"));
const SkillStats = lazy(() => import("./Components/SkillStats"));

function App() {
  const [searchMessage, setSearchMessage] = useState("");
  const {
    lcusername, setLCusername,
    cfusername, setCFusername,
    lcdata, cfdata, lcStatus, cfStatus, searchProfiles,
  } = useCP();
  const isLoading = lcStatus.state === "loading" || cfStatus.state === "loading";
  const cfProfile = cfdata?.status === "OK" ? cfdata.result?.[0] : null;

  async function handleSearch(event) {
    event.preventDefault();
    const searched = await searchProfiles(lcusername, cfusername);
    setSearchMessage(searched ? "" : "Enter at least one username to search.");
  }

  async function retrySearch() {
    setSearchMessage("");
    await searchProfiles(lcusername, cfusername);
  }

  return (
    <main className="page-shell">
      <section className="page-heading" aria-labelledby="home-title">
        <span className="eyebrow">// 01 PROFILE LOOKUP</span>
        <h1 className="hero-title" id="home-title">Your CP journey, all in one place.</h1>
        <p className="lede">Track your LeetCode and Codeforces performance, understand your strengths, and find the topics that need more practice.</p>
      </section>

      <section aria-labelledby="lookup-title">
        <h2 className="visually-hidden" id="lookup-title">Search profiles</h2>
        <div className="lookup-panel" aria-busy={isLoading}>
          <form className="lookup-form" onSubmit={handleSearch}>
            <div>
              <label className="lookup-label" htmlFor="lc-username">LEETCODE USERNAME</label>
              <input className="lookup-input" type="text" inputMode="text" id="lc-username" name="leetcodeUsername" autoComplete="username" placeholder="Enter a username" aria-describedby="search-message" aria-invalid={Boolean(searchMessage)} value={lcusername} onChange={(event) => { setLCusername(event.target.value); setSearchMessage(""); }} />
            </div>
            <div>
              <label className="lookup-label" htmlFor="cf-username">CODEFORCES USERNAME</label>
              <input className="lookup-input" type="text" inputMode="text" id="cf-username" name="codeforcesUsername" autoComplete="username" placeholder="Enter a username" aria-describedby="search-message" aria-invalid={Boolean(searchMessage)} value={cfusername} onChange={(event) => { setCFusername(event.target.value); setSearchMessage(""); }} />
            </div>
            <button className="button button-primary" type="submit">Search profiles</button>
          </form>
          <p className="form-help" id="search-message" role={searchMessage ? "alert" : "status"}>{searchMessage}</p>
          {(lcStatus.state !== "idle" || cfStatus.state !== "idle") && (
            <div className="status-row" role="status" aria-live="polite">
              {[["LeetCode", lcStatus], ["Codeforces", cfStatus]].map(([platform, status]) => status.state !== "idle" && (
                <div className={`status-item status-${status.state}`} key={platform}>
                  <span>{platform}: {status.message}</span>
                  {status.state === "error" && <button className="retry-button" type="button" onClick={retrySearch}>Retry {platform}</button>}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {(lcdata || cfProfile || lcStatus.state === "loading" || cfStatus.state === "loading") && (
        <section className="section" aria-labelledby="profiles-title">
          <div className="section-header">
            <div>
              <span className="eyebrow">// 02 CONNECTED PROFILES</span>
              <h2 className="section-title" id="profiles-title">Profile summary</h2>
            </div>
          </div>
          <div className="profile-list">
            {lcStatus.state === "loading" && <ProfileSkeleton label="LeetCode" />}
            {lcdata && (
              <article className={`profile-row${lcdata.avatar ? "" : " profile-row--no-avatar"}`} aria-label="LeetCode profile">
                {lcdata.avatar && <img className="profile-avatar" src={lcdata.avatar} alt={`${lcdata.name || lcdata.username || "LeetCode user"} avatar`} width="64" height="64" />}
                <div>
                  <span className="profile-platform">LEETCODE</span>
                  <h3 className="profile-name">{lcdata.name || lcdata.username || "LeetCode user"}</h3>
                  <p className="profile-subtitle">@{lcdata.username || lcusername}</p>
                </div>
                <div className="profile-stat">
                  <span className="profile-stat-label">GLOBAL RANK</span>
                  <span className="profile-stat-value">{lcdata.ranking != null && Number.isFinite(Number(lcdata.ranking)) ? `#${Number(lcdata.ranking).toLocaleString()}` : "Unavailable"}</span>
                </div>
              </article>
            )}
            {cfStatus.state === "loading" && <ProfileSkeleton label="Codeforces" />}
            {cfProfile && (
              <article className={`profile-row${cfProfile.titlePhoto || cfProfile.avatar ? "" : " profile-row--no-avatar"}`} aria-label="Codeforces profile">
                {(cfProfile.titlePhoto || cfProfile.avatar) && <img className="profile-avatar" src={cfProfile.titlePhoto || cfProfile.avatar} alt={`${cfProfile.handle || "Codeforces user"} avatar`} width="64" height="64" />}
                <div>
                  <span className="profile-platform">CODEFORCES</span>
                  <h3 className="profile-name">{cfProfile.handle || "Codeforces user"}</h3>
                  <p className="profile-subtitle">{cfProfile.rank || "Unrated"}</p>
                </div>
                <div className="profile-stat">
                  <span className="profile-stat-label">CURRENT RATING</span>
                  <span className="profile-stat-value">{cfProfile.rating ?? "Unrated"}</span>
                </div>
              </article>
            )}
          </div>
        </section>
      )}

      {(lcdata || cfProfile) && <SummaryCard />}

      {lcdata && (
        <section className="section" aria-labelledby="analytics-title">
          <div className="section-header">
            <div>
              <span className="eyebrow">// 04 LEETCODE ANALYTICS</span>
              <h2 className="section-title" id="analytics-title">Performance breakdown</h2>
              <p className="section-note">Solving patterns, difficulty, topics, and contest rating.</p>
            </div>
          </div>
          <div className="analytics-layout">
            <section className="chart-panel" aria-labelledby="difficulty-title">
              <h3 className="chart-title" id="difficulty-title">Difficulty breakdown</h3>
              <p className="chart-note">Problems solved by difficulty</p>
              <Suspense fallback={<ChartSkeleton label="difficulty totals" />}><DifficultyChart /></Suspense>
            </section>
            <section className="chart-panel" aria-labelledby="topics-title">
              <h3 className="chart-title" id="topics-title">Topic analysis</h3>
              <p className="chart-note">Your strongest and weakest areas</p>
              <Suspense fallback={<ChartSkeleton label="topic statistics" />}><SkillStats /></Suspense>
            </section>
          </div>
          <section className="chart-panel section" aria-labelledby="rating-title">
            <h3 className="chart-title" id="rating-title">Contest rating history</h3>
            <Suspense fallback={<ChartSkeleton label="contest rating history" />}><RatingChart /></Suspense>
          </section>
        </section>
      )}
    </main>
  );
}

export default App;
