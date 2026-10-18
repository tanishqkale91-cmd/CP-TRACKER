CP Tracker

**CP Tracker** brings your competitive programming profiles and progress together in one place. Look up your LeetCode and Codeforces usernames to review profile stats, track performance, and see your LeetCode problem-solving analytics.

## Live application

[Open CP Tracker](https://cptracker-pi.vercel.app/Leetcode)

## Features

- Search for LeetCode and Codeforces profiles independently or together.
- View profile summaries, including LeetCode global rank and solved problems, and Codeforces rating and rank.
- Review LeetCode difficulty breakdown, topic analysis, and contest rating history.
- Use the responsive interface on desktop and mobile.

## Run locally

### Requirements

- Node.js (current LTS recommended)
- npm

### Setup

```bash
git clone https://github.com/tanishqkale91-cmd/CP-TRACKER.git
cd CP-TRACKER
npm install
npm run dev
```

Vite prints the local development URL in the terminal after the server starts.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local development server. |
| `npm run build` | Build the production app. |
| `npm run preview` | Preview the production build locally. |
| `npm run lint` | Run Oxlint. |
| `npm run verify:mobile` | Build the app and run the mobile layout verification. |

## Data sources

Profile information is retrieved from the LeetCode API service and the Codeforces API. Availability and freshness depend on those services.

## Built with

React, Vite, React Router, and Recharts.
