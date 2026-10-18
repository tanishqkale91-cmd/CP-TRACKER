const updated = "19 October 2026";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-shell">
        <div className="footer-top">
          <span className="footer-status">CP TRACKER / USER PROFILE DATA IS LOADED ON REQUEST</span>
          <nav className="footer-links" aria-label="Legal information">
            <a className="footer-link" href="#terms">Terms</a>
            <a className="footer-link" href="#privacy">Privacy</a>
          </nav>
        </div>
        <div className="legal-notes">
          <section className="legal-note" id="terms" aria-labelledby="terms-title">
            <h2 id="terms-title">TERMS</h2>
            <p>CP Tracker displays profile and analytics information returned by LeetCode and Codeforces data services. Results can be incomplete or unavailable. Use the information for reference. This note is not legal advice.</p>
            <span className="legal-updated">Last updated: {updated}</span>
          </section>
          <section className="legal-note" id="privacy" aria-labelledby="privacy-title">
            <h2 id="privacy-title">PRIVACY</h2>
            <p>When you search, the usernames you enter are sent to alfa-leetcode-api.onrender.com and codeforces.com for the selected profile lookups. This app source has no account, analytics, cookie, or persistence code. Results remain in page memory. Each service handles the request under its own practices.</p>
            <span className="legal-updated">Last updated: {updated}</span>
          </section>
        </div>
      </div>
    </footer>
  );
}
