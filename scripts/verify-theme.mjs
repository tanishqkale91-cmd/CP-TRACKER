import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import { setTimeout as delay } from "node:timers/promises";
import { chromium } from "@playwright/test";

const host = "127.0.0.1";
const port = 5176;
const baseUrl = `http://${host}:${port}`;
const routes = [
  { path: "/", name: "home" },
  { path: "/Leetcode", name: "leetcode" },
  { path: "/Codeforce", name: "codeforce" },
];
const screenshotSizes = [[1440, 900], [768, 1024], [390, 844]];
const responsiveSizes = [[390, 844], [768, 1024], [1024, 900], [1440, 900], [1920, 1080]];
const failures = [];
const consoleErrors = [];
let server;

async function waitForServer() {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
    } catch {}
    await delay(250);
  }
  throw new Error("Vite did not become ready on port 5176.");
}

function attachConsoleChecks(page, context) {
  page.on("console", (message) => {
    if (message.type() === "error" && !(context.includes("network and keyboard checks") && message.text().includes("Failed to load resource"))) consoleErrors.push(`${context}: ${message.text()}`);
  });
  page.on("pageerror", (error) => consoleErrors.push(`${context}: ${error.message}`));
}

async function capturePages(browser) {
  await mkdir("theme-audit/after", { recursive: true });
  for (const [width, height] of screenshotSizes) {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: "reduce" });
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const route of routes) {
      attachConsoleChecks(page, `${route.name} ${width}x${height}`);
      await page.goto(`${baseUrl}${route.path}`, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({ path: `theme-audit/after/${route.name}-${width}x${height}.png` });
    }
    await page.close();
  }
}

async function checkResponsive(browser) {
  for (const [width, height] of responsiveSizes) {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: "reduce" });
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const route of routes) {
      attachConsoleChecks(page, `responsive ${route.name} ${width}x${height}`);
      await page.goto(`${baseUrl}${route.path}`, { waitUntil: "domcontentloaded" });
      await page.getByRole("heading", { level: 1 }).waitFor({ state: "visible", timeoutMs: 5000 });
      const dimensions = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, content: document.documentElement.scrollWidth }));
      if (dimensions.content > dimensions.viewport) failures.push(`${route.name} at ${width}px overflows horizontally (${dimensions.content}px content).`);
    }
    await page.close();
  }
}

async function checkStatesAndKeyboard(browser) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  await page.emulateMedia({ reducedMotion: "reduce" });
  attachConsoleChecks(page, "network and keyboard checks");
  await page.goto(`${baseUrl}/`, { waitUntil: "domcontentloaded" });
  if (!(await page.getByRole("heading", { name: "Your CP journey, all in one place." }).isVisible())) failures.push("Home heading did not render.");

  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  const focusCheck = await page.evaluate(() => ({ id: document.activeElement?.id, outline: getComputedStyle(document.activeElement).outlineStyle, width: getComputedStyle(document.activeElement).outlineWidth }));
  if (focusCheck.id !== "lc-username" || focusCheck.outline === "none" || focusCheck.width === "0px") failures.push(`Keyboard focus did not reach the first username field with a visible outline: ${JSON.stringify(focusCheck)}.`);
  await page.keyboard.press("Tab");
  if (await page.evaluate(() => document.activeElement?.id) !== "cf-username") failures.push("Tab order did not move from LeetCode to Codeforces username.");
  await page.keyboard.press("Tab");
  if ((await page.getByRole("button", { name: "Search profiles" }).evaluate((button) => document.activeElement === button)) !== true) failures.push("Tab order did not move from the second username to Search.");

  await page.getByLabel("LEETCODE USERNAME").fill("theme-check-lc");
  await page.getByLabel("CODEFORCES USERNAME").fill("theme-check-cf");
  await page.route("**/alfa-leetcode-api.onrender.com/**", async (route) => { await delay(900); await route.abort(); });
  await page.route("**/codeforces.com/api/user.info**", async (route) => { await delay(900); await route.abort(); });
  await page.getByLabel("CODEFORCES USERNAME").press("Enter");
  try { await page.getByRole("status", { name: "Loading LeetCode profile" }).waitFor({ state: "visible", timeoutMs: 1000 }); }
  catch { failures.push("LeetCode loading skeleton did not appear during a delayed lookup."); }
  try { await page.getByRole("status", { name: "Loading Codeforces profile" }).waitFor({ state: "visible", timeoutMs: 1000 }); }
  catch { failures.push("Codeforces loading skeleton did not appear during a delayed lookup."); }
  await page.getByRole("button", { name: "Retry LeetCode" }).waitFor({ state: "visible", timeout: 8000 });
  if (!(await page.getByRole("button", { name: "Retry Codeforces" }).isVisible())) failures.push("Codeforces lookup error did not provide a retry action.");
  await page.getByRole("button", { name: "Retry LeetCode" }).click();
  try { await page.getByRole("status", { name: "Loading LeetCode profile" }).waitFor({ state: "visible", timeoutMs: 1000 }); }
  catch { failures.push("Retry did not return to the loading state."); }
  await page.close();

  for (const [path, heading] of [["/Leetcode", "No LeetCode profile loaded"], ["/Codeforce", "No Codeforces profile loaded"]]) {
    const emptyPage = await browser.newPage({ viewport: { width: 768, height: 1024 }, reducedMotion: "reduce" });
    await emptyPage.goto(`${baseUrl}${path}`, { waitUntil: "domcontentloaded" });
    try { await emptyPage.getByRole("heading", { name: heading }).waitFor({ state: "visible", timeoutMs: 5000 }); }
    catch { failures.push(`Empty state missing from ${path}.`); }
    await emptyPage.close();
  }
}

try {
  server = spawn(process.execPath, ["node_modules/vite/bin/vite.js", "--host", host, "--port", String(port), "--strictPort"], { stdio: "ignore" });
  await waitForServer();
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  await capturePages(browser);
  await checkResponsive(browser);
  await checkStatesAndKeyboard(browser);
  await browser.close();
} finally {
  if (server && server.exitCode === null) server.kill("SIGTERM");
}

if (consoleErrors.length) failures.push(...consoleErrors.map((error) => `Browser console error: ${error}`));
if (failures.length) {
  console.error(failures.map((failure) => `FAIL: ${failure}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log("Theme verification passed. Captures: theme-audit/after. Responsive sizes: 390, 768, 1024, 1440, 1920.");
}
