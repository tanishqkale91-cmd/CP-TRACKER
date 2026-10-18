# Mobile responsiveness baseline

Audit run before layout edits with Chromium, reduced motion, Playwright, and mobile emulation (`isMobile` and touch enabled with an iPhone user agent for phone and tablet sizes). Full-page screenshots and element-level measurements are in `mobile-audit/before/`; `measurements.json` contains the per-route/per-viewport details. All three routes were checked: `/`, `/Leetcode`, and `/Codeforce`.

| Viewport | Home `/` | LeetCode `/Leetcode` | Codeforces `/Codeforce` |
| --- | --- | --- | --- |
| 320x568 | No horizontal overflow or clipped content. Header wraps. Submit 12px, help 13px, terms link 33x44px. | No horizontal overflow or clipped content. Terms link 33x44px; primary link text 12px. | No horizontal overflow or clipped content. Terms link 33x44px; primary link text 12px. |
| 360x640 | No horizontal overflow or clipped content. Header wraps. Submit 12px, help 13px, terms link 33x44px. | No horizontal overflow or clipped content. Terms link 33x44px; primary link text 12px. | No horizontal overflow or clipped content. Terms link 33x44px; primary link text 12px. |
| 375x667 | No horizontal overflow or clipped content. Header wraps. Submit 12px, help 13px, terms link 33x44px. | No horizontal overflow or clipped content. Terms link 33x44px; primary link text 12px. | No horizontal overflow or clipped content. Terms link 33x44px; primary link text 12px. |
| 390x844 | No horizontal overflow or clipped content. Header wraps. Submit 12px, help 13px, terms link 33x44px. | No horizontal overflow or clipped content. Terms link 33x44px; primary link text 12px. | No horizontal overflow or clipped content. Terms link 33x44px; primary link text 12px. |
| 412x915 | No horizontal overflow or clipped content. Header wraps. Submit 12px, help 13px, terms link 33x44px. | No horizontal overflow or clipped content. Terms link 33x44px; primary link text 12px. | No horizontal overflow or clipped content. Terms link 33x44px; primary link text 12px. |
| 430x932 | No horizontal overflow or clipped content. Header wraps. Submit 12px, help 13px, terms link 33x44px. | No horizontal overflow or clipped content. Terms link 33x44px; primary link text 12px. | No horizontal overflow or clipped content. Terms link 33x44px; primary link text 12px. |
| 568x320 | No horizontal overflow or clipped content. Header wraps. Submit 12px, help 13px, terms link 33x44px. | No horizontal overflow or clipped content. Terms link 33x44px; primary link text 12px. | No horizontal overflow or clipped content. Terms link 33x44px; primary link text 12px. |
| 844x390 | No horizontal overflow or clipped content. Submit 12px, help 13px, terms link 33x44px. | No horizontal overflow or clipped content. Terms link 33x44px; primary link text 12px. | No horizontal overflow or clipped content. Terms link 33x44px; primary link text 12px. |
| 768x1024 | No horizontal overflow or clipped content. Submit 12px, help 13px, terms link 33x44px. | No horizontal overflow or clipped content. Terms link 33x44px; primary link text 12px. | No horizontal overflow or clipped content. Terms link 33x44px; primary link text 12px. |
| 1024x768 | No horizontal overflow or clipped content. Submit 12px, help 13px, terms link 33x44px. | No horizontal overflow or clipped content. Terms link 33x44px; primary link text 12px. | No horizontal overflow or clipped content. Terms link 33x44px; primary link text 12px. |
| 1280x800 | No horizontal overflow or clipped content. Submit 12px, help 13px, terms link 33x44px. | No horizontal overflow or clipped content. Terms link 33x44px; primary link text 12px. | No horizontal overflow or clipped content. Terms link 33x44px; primary link text 12px. |
| 1440x900 | No horizontal overflow or clipped content. Submit 12px, help 13px, terms link 33x44px. | No horizontal overflow or clipped content. Terms link 33x44px; primary link text 12px. | No horizontal overflow or clipped content. Terms link 33x44px; primary link text 12px. |

## Causes to address

- At widths up to 700px, the primary nav is a column: the brand occupies one row and the three route links a second. This makes the sticky header about twice as tall as needed and does not provide a mobile menu. On phone widths, individual route labels are 10px.
- The home route has a 12px submit label, 13px form status/help text, and 12px legal paragraphs. Platform pages have the same 12px legal paragraphs and 12px primary route link. These are body/action copy rather than metadata labels.
- Form inputs use 15px text, below the 16px mobile input target. Their rendered height and all detected interactive target dimensions were adequate.
- The Terms footer link is 33x44px, below the 44px target width. The original audit helper excluded fragment links from its undersized-control list; the after-audit now measures all links, including in-page anchors.
- No measured horizontal overflow or clipped content was found at the 12 requested viewport sizes on any route. The current viewport meta permits zoom and the global border-box rule is present; the viewport value can be normalized to the requested exact declaration.

No canvas, WebGL, 3D, smooth-scroll package, modal, or floating control was found in the app. The only animation is the CSS loading skeleton and the only scrolling behavior is native CSS smooth scrolling.

## After-fix audit

The same 36 route/viewport combinations now report `scrollWidth === innerWidth` at every size, with zero elements extending horizontally, zero clipped elements, zero non-micro text below 14px, zero controls below 44x44px, and no browser console errors. Exact per-page values and screenshot captures are in `mobile-audit/after/`.

- Mobile navigation was tested by touch: open, link navigation, Close, Escape, focus containment/return, `aria-expanded`, and body scroll lock/unlock all pass.
- The Terms and Privacy anchors both land 15px below the 65px sticky header at 390x844. The focused legal note gets temporary end spacing on small screens because the document’s normal end otherwise prevents the last anchor from scrolling to the requested offset.
- Form validation and mocked successful lookups pass at 360x400 and 390x400 with both fields at 16px and visible above the simulated keyboard area.
- Landscape sizes 568x320 and 844x390 are included in the full responsive matrix. Reduced-motion rendering and a WebGL-disabled environment were checked; no canvas/WebGL content exists.
- Production preview under 4x CPU throttling and slow 4G measured LCP at 1,228ms and CLS at 0.00037 on 390x844.

The responsive tokens use 20px phone gutters, 32px tablet gutters, and a fluid gutter capped at 48px on larger screens (content max-width 1200px). Breakpoints are 480px and 768px, with the tablet gutter rule ending at 1024px. Phone headings use `clamp(38px, 11vw, 52px)`; inputs and body copy are 16px, actions 14px, and mono metadata is at least 12px. Existing radii, colors, and type families are preserved.

Real iOS Safari/device keyboard behavior and actual OS-level 200% text-size settings were not available in Playwright. The project has no standalone type-check or unit-test script; the production build, Oxlint, and browser interaction audit were run instead.
