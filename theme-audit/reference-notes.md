# Reference and baseline audit

## Reference inspected in browser

URL: https://www.varadraut.dev/ (visited 2026-10-19). Computed values below were read from the loaded page in Chromium. The browser viewport could not be expanded past 828 x 904 in this session, so responsive reference measurements are not claimed.

### Computed design values

| Token or element | Observed value |
| --- | --- |
| Page background | `#131313` / `rgb(19, 19, 19)` |
| Surface | `#1c1b1b` |
| Border | `#3a413c` / `rgb(58, 65, 60)` |
| Primary text | `#e5e2e1` / `rgb(229, 226, 225)` |
| Muted text | `#a7afae` / `rgb(167, 175, 174)` |
| Accent | `#3fb950` / `rgb(63, 185, 80)` |
| Dark accent text | `#04170a` |
| Body face | Inter, 16px, weight 400, 24px line height |
| Display face | Sora; hero heading 74.52px, weight 800, 70.794px line height, -3.726px tracking; section heading 40px, weight 700, 48px line height |
| Mono face | JetBrains Mono; nav and labels 14px, weight 500, 19.6px line height, 0.7px tracking |
| Radius | `0px` on body, headings, nav, and sampled links |
| Border | `1px solid` on sampled nav and section dividers |
| Main section spacing | `100px` top padding on the hero and `100px` section rhythm in the captured view |
| Navigation | Sticky, compact bordered bar with active section treatment |

The loaded page uses the `$ whoami` terminal prompt, numbered `// 01 ...` mono section labels, a git-log presentation for experience, compact technology labels, project header strips and live/source links, a contact form and direct email link, and a minimal status footer. The first-load indicator was not present once the page content was accessible, so its duration and transition were not measurable. The page includes green pixel decoration and translucent nav styling; those effects were not reproduced because the attached anti-slop rules explicitly prohibit decorative grids and glass effects. The body face is also intentionally substituted because Inter is banned by the same spec.

## Existing project audit before edits

Stack: React 19 and Vite 8, React Router, Recharts, Tailwind CSS 4 utilities/global CSS, and Motion installed but unused in application imports. The re-theme consolidates presentation into shared CSS tokens and removes the unused styling/animation dependencies while keeping the routes and Recharts behavior.

Pages captured before the changes are in `theme-audit/before/` at 1440x900, 768x1024, and 390x844.

### Existing banned-pattern inventory

| Location | Observed patterns |
| --- | --- |
| `src/App.jsx` | Purple/blue radial blobs; gradient headline and panel; emoji; glass blur and shadow; 2xl/rounded controls; colored platform profile panels; multi-column equal analytics cards; hover lift; spinner-only progress; em-dash-era numeric fallback in profile rendering. |
| `src/Components/Header/Header.jsx` | Purple/cyan gradient wordmark, backdrop blur, colored active links. |
| `src/Components/SummaryCard.jsx` | Equal metric-card grid; colored gradient surfaces; checkmark/star glyphs; arrow glyph; fixed half-width decorative progress bars; rounded/glass/shadow/hover-lift treatment. |
| `src/Components/DifficultyChart.jsx` | Neon green/yellow/red palette; spinner-only loading; chart styling in component literals. |
| `src/Components/SkillStats.jsx` | Paired rounded topic cards, saturated green/red treatments, index badges, spinner-only loading. |
| `src/Components/RatingChart.jsx` | Purple chart line; rounded tooltip; hard-coded colors and chart values. |
| `src/Components/Leetcode/Leetcode.jsx` | Orange/amber gradient, flame emoji, radial glows, rounded profile/chart cards, blur, spinner, emoji empty state. |
| `src/Components/Codeforce/Codeforce.jsx` | Blue/cyan and purple gradients, sword/trophy/medal emoji, radial glows, equal metric cards, decorative half-width bars, blur, spinner, emoji empty state. |
| `src/index.css` | Inter font import, violet dot grid, gradient mask. |
| `src/assets/vite.svg` | Unused starter asset with purple gradients and blur filters. |

No testimonial section or testimonial data was found. The Codeforces display values and LeetCode profile/analytics are backed by API results; decorative fixed-half progress bars are not data-driven and will be removed. The repo-count view uses repository API results rather than fabricated totals. The incomplete RandomProblem file is staged in the index but deleted in the working tree and references a missing data module; it is not part of the rendered baseline.

## Palette and implementation choices

The interface follows the observed neutral near-black, warm off-white, muted gray, thin gray borders, and restrained green accent. Final token values are declared in one stylesheet.

| Token | Final value |
| --- | --- |
| Background | `#131313` |
| Surface | `#1c1b1b` |
| Raised surface | `#232423` |
| Border | `#3a413c` |
| Primary text | `#e5e2e1` |
| Muted text | `#a7afae` |
| Subtle text | `#868d89` |
| Accent | `#3fb950` |
| Accent hover | `#55ce68` |
| Accent foreground | `#04170a` |
| Error text | `#ff8177` |
| Display face | Sora, 42px to 76px fluid, weight 700 or 800 |
| Body face | DM Sans, 16px base, weight 400 |
| Mono face | JetBrains Mono, 10px to 12px for labels and metadata |
| Radius | 2px controls and fields, 0px panels |
| Spacing | 4px half-step, then 8px increments through 72px |
| Page gutter | 24px to 48px fluid |
| Content width | 1200px |

Display headings use Sora; body copy uses DM Sans instead of the reference's banned Inter; labels and data use JetBrains Mono. The 14px small mono text is reserved for readable navigation and text values. The calculated `#868d89` muted-subtle token reaches a 5.47:1 contrast ratio on `#131313`; primary, muted, accent, and error text all exceed 7:1 on the page background.

The reference is a developer portfolio, while this repository is a coding analytics tool. Portfolio-only sections, project links, contact forms, and experience content are not copied. A real app capture is not embedded as a fake product demo; the actual tracker remains the product, and the before/after captures are retained only for this audit. The app is a dashboard, so no first-load intro animation is added.
