import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { setTimeout as delay } from 'node:timers/promises';
import { chromium, devices } from '@playwright/test';

const host = '127.0.0.1';
const port = 5177;
const baseUrl = `http://${host}:${port}`;
const routes = [
  { path: '/', name: 'home' },
  { path: '/Leetcode', name: 'leetcode' },
  { path: '/Codeforce', name: 'codeforce' },
];
const viewports = [
  [320, 568], [360, 640], [375, 667], [390, 844], [412, 915], [430, 932],
  [568, 320], [844, 390], [768, 1024], [1024, 768], [1280, 800], [1440, 900],
];
const output = process.env.MOBILE_AUDIT_DIR || 'mobile-audit/after';
const failures = [];
const results = [];
const interactionResults = [];
let performanceResults;
let server;

async function waitForServer() {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try { if ((await fetch(baseUrl)).ok) return; } catch {}
    await delay(250);
  }
  throw new Error(`Vite did not become ready on port ${port}.`);
}

function isMobileSize([width, height]) { return width <= 1024 || height <= 500; }

async function auditPage(page, route, size) {
  const [width, height] = size;
  const consoleErrors = [];
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', error => consoleErrors.push(error.message));
  await page.goto(`${baseUrl}${route.path}`, { waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { level: 1 }).waitFor({ state: 'visible', timeout: 12000 }).catch(() => {});
  await page.evaluate(() => document.fonts.ready);
  await delay(300);
  const measurements = await page.evaluate(() => {
    const rect = element => {
      const box = element.getBoundingClientRect();
      return { selector: `${element.tagName.toLowerCase()}${element.id ? `#${element.id}` : ''}${typeof element.className === 'string' && element.className.trim() ? `.${element.className.trim().split(/\\s+/).join('.')}` : ''}`,
        width: Math.round(box.width * 10) / 10, height: Math.round(box.height * 10) / 10,
        right: Math.round(box.right * 10) / 10, bottom: Math.round(box.bottom * 10) / 10,
        fontSize: getComputedStyle(element).fontSize };
    };
    const visible = element => {
      const box = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return box.width > 0 && box.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
    };
    const all = [...document.body.querySelectorAll('*')].filter(visible);
    const vw = document.documentElement.clientWidth;
    const vh = window.innerHeight;
    const overflow = all.filter(element => { const box = element.getBoundingClientRect(); return box.left < -1 || box.right > vw + 1; }).map(rect);
    const clipped = all.filter(element => {
      const box = element.getBoundingClientRect();
      return (box.top < -1 || box.bottom > vh + 1) && [...(function* (node) { while ((node = node.parentElement)) yield node; })(element)].some(parent => {
        const s = getComputedStyle(parent);
        return /(hidden|clip)/.test(`${s.overflow} ${s.overflowX} ${s.overflowY}`);
      });
    }).map(rect);
    const smallText = all.filter(element => {
      if (element.children.length && [...element.childNodes].every(node => node.nodeType !== Node.TEXT_NODE || !node.textContent.trim())) return false;
      const fs = parseFloat(getComputedStyle(element).fontSize);
      return fs < 14 && fs > 0 && !element.closest('.eyebrow,.lookup-label,.profile-platform,.profile-subtitle,.profile-stat-label,.metric-platform,.metric-table th,.topic-rank,.topic-count,.topic-group-title,.status-row,.footer-status,.legal-note h2,.legal-updated,.nav-link');
    }).map(rect);
    const smallControls = all.filter(element => element.matches('a,button,input,select,textarea,[role="button"]') && (() => { const box = element.getBoundingClientRect(); return box.width < 44 || box.height < 44; })()).map(rect);
    const controls = all.filter(element => element.matches('a,button,input,select,textarea,[role="button"]')).map(rect);
    return { viewport: { width: innerWidth, height: innerHeight }, scrollWidth: document.documentElement.scrollWidth,
      horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      extendingElements: overflow, clippedElements: clipped, smallText, smallControls, controls };
  });
  const result = { route: route.path, width, height, ...measurements, consoleErrors };
  results.push(result);
  if (process.env.MOBILE_AUDIT_SCREENSHOTS !== '0') {
    await page.screenshot({ path: `${output}/${route.name}-${width}x${height}.png`, fullPage: true, animations: 'disabled' });
  }
  return result;
}

try {
  await mkdir(output, { recursive: true });
  server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', host, '--port', String(port), '--strictPort'], { stdio: 'ignore' });
  await waitForServer();
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  for (const size of viewports) {
    for (const route of routes) {
      const mobile = isMobileSize(size);
      const contextOptions = {
        viewport: { width: size[0], height: size[1] },
        reducedMotion: 'reduce',
        ...(mobile ? { ...devices['iPhone 13'], viewport: { width: size[0], height: size[1] }, isMobile: true, hasTouch: true } : {}),
      };
      const context = await browser.newContext(contextOptions);
      const page = await context.newPage();
      const result = await auditPage(page, route, size);
      if (result.horizontalOverflow) failures.push(`${route.path} ${size.join('x')}: horizontal overflow (${result.scrollWidth}px > ${result.viewport.width}px)`);
      if (result.extendingElements.length) failures.push(`${route.path} ${size.join('x')}: ${result.extendingElements.length} elements extend beyond the viewport.`);
      if (result.clippedElements.length) failures.push(`${route.path} ${size.join('x')}: ${result.clippedElements.length} elements are clipped by an overflow ancestor.`);
      if (result.smallText.length) failures.push(`${route.path} ${size.join('x')}: ${result.smallText.length} text items are below 14px outside the 12px mono micro-label allowance.`);
      if (result.smallControls.length) failures.push(`${route.path} ${size.join('x')}: ${result.smallControls.length} interactive targets are smaller than 44x44 CSS pixels.`);
      if (result.consoleErrors.length) failures.push(`${route.path} ${size.join('x')}: console errors: ${result.consoleErrors.join('; ')}`);
      await context.close();
    }
  }

  if (process.env.MOBILE_AUDIT_CAPTURE_ONLY !== '1') {
  const mobileContext = await browser.newContext({ ...devices['iPhone 13'], viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const menuPage = await mobileContext.newPage();
  const menuErrors = [];
  menuPage.on('console', message => { if (message.type() === 'error') menuErrors.push(message.text()); });
  menuPage.on('pageerror', error => menuErrors.push(error.message));
  await menuPage.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' });
  const menuButton = menuPage.getByRole('button', { name: 'Menu' });
  const dialog = menuPage.getByRole('dialog', { name: 'Mobile navigation' });
  await menuButton.tap();
  await dialog.waitFor({ state: 'visible' });
  const firstOpen = await menuPage.evaluate(() => ({ expanded: document.querySelector('.menu-toggle').getAttribute('aria-expanded'), scrollLocked: getComputedStyle(document.body).overflow === 'hidden', focusInside: document.querySelector('#mobile-navigation').contains(document.activeElement) }));
  if (firstOpen.expanded !== 'true' || !firstOpen.scrollLocked || !firstOpen.focusInside) failures.push(`Mobile menu did not open modally with focus and scroll lock: ${JSON.stringify(firstOpen)}.`);
  const lastLink = dialog.getByRole('link', { name: 'Codeforces' });
  await lastLink.focus();
  await menuPage.keyboard.press('Tab');
  if (!(await menuPage.evaluate(() => document.querySelector('#mobile-navigation').contains(document.activeElement)))) failures.push('Mobile menu focus escaped the modal when tabbing past its last link.');
  await dialog.getByRole('link', { name: 'LeetCode' }).tap();
  await menuPage.waitForURL('**/Leetcode');
  const afterNavigation = await menuPage.evaluate(() => ({ open: document.querySelector('#mobile-navigation').open, expanded: document.querySelector('.menu-toggle').getAttribute('aria-expanded'), focusReturned: document.activeElement === document.querySelector('.menu-toggle'), bodyOverflow: document.body.style.overflow }));
  if (afterNavigation.open || afterNavigation.expanded !== 'false' || !afterNavigation.focusReturned || afterNavigation.bodyOverflow === 'hidden') failures.push(`Mobile menu did not close and restore focus after navigation: ${JSON.stringify(afterNavigation)}.`);
  await menuButton.tap();
  await dialog.waitFor({ state: 'visible' });
  await dialog.getByRole('button', { name: 'Close' }).tap();
  const afterCloseButton = await menuPage.evaluate(() => ({ open: document.querySelector('#mobile-navigation').open, expanded: document.querySelector('.menu-toggle').getAttribute('aria-expanded'), focusReturned: document.activeElement === document.querySelector('.menu-toggle'), bodyOverflow: document.body.style.overflow }));
  if (afterCloseButton.open || afterCloseButton.expanded !== 'false' || !afterCloseButton.focusReturned || afterCloseButton.bodyOverflow === 'hidden') failures.push(`Close button did not restore menu state, focus, and scrolling: ${JSON.stringify(afterCloseButton)}.`);
  await menuButton.tap();
  await dialog.waitFor({ state: 'visible' });
  await menuPage.keyboard.press('Escape');
  const afterEscape = await menuPage.evaluate(() => ({ open: document.querySelector('#mobile-navigation').open, expanded: document.querySelector('.menu-toggle').getAttribute('aria-expanded'), focusReturned: document.activeElement === document.querySelector('.menu-toggle'), bodyOverflow: document.body.style.overflow }));
  if (afterEscape.open || afterEscape.expanded !== 'false' || !afterEscape.focusReturned || afterEscape.bodyOverflow === 'hidden') failures.push(`Escape did not restore menu state, focus, and scrolling: ${JSON.stringify(afterEscape)}.`);
  interactionResults.push({ name: 'mobile navigation', open: firstOpen, navigate: afterNavigation, closeButton: afterCloseButton, escape: afterEscape });

  await menuPage.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' });
  for (const [label, id] of [['Terms', 'terms'], ['Privacy', 'privacy']]) {
    await menuPage.getByRole('link', { name: label, exact: true }).tap();
    await menuPage.waitForURL(`**/#${id}`);
    await delay(500);
    const anchor = await menuPage.evaluate((targetId) => {
      const target = document.getElementById(targetId).getBoundingClientRect();
      const header = document.querySelector('.site-header').getBoundingClientRect();
      return { targetTop: target.top, headerBottom: header.bottom, viewportHeight: innerHeight, scrollY, scrollHeight: document.documentElement.scrollHeight, scrollMarginTop: getComputedStyle(document.getElementById(targetId)).scrollMarginTop };
    }, id);
    if (anchor.targetTop < anchor.headerBottom + 14 || anchor.targetTop > anchor.headerBottom + 18 || anchor.targetTop > anchor.viewportHeight) failures.push(`${label} anchor does not land 16px below the sticky header: ${JSON.stringify(anchor)}.`);
    interactionResults.push({ name: `${label} anchor`, ...anchor });
  }
  await mobileContext.close();

  for (const width of [360, 390]) {
    const formContext = await browser.newContext({ ...devices['iPhone 13'], viewport: { width, height: 400 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
    await formContext.route('https://alfa-leetcode-api.onrender.com/**', async route => {
      const url = new URL(route.request().url());
      let body;
      if (url.pathname.endsWith('/contest/history')) body = { contestHistory: [] };
      else if (url.pathname.endsWith('/solved')) body = { easySolved: 1, mediumSolved: 1, hardSolved: 1 };
      else if (url.pathname.endsWith('/skill')) body = { fundamental: [{ tagName: 'Arrays', problemsSolved: 2 }], intermediate: [], advanced: [] };
      else body = { username: 'mobile-test', name: 'Mobile Test', ranking: 123, solvedProblem: 3 };
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(body) });
    });
    await formContext.route('https://codeforces.com/api/user.info**', route => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ status: 'OK', result: [{ handle: 'mobile-test', rank: 'newbie', rating: 900, maxRating: 900, contribution: 0, friendOfCount: 1 }] }) }));
    const formPage = await formContext.newPage();
    const formErrors = [];
    formPage.on('console', message => { if (message.type() === 'error') formErrors.push(message.text()); });
    formPage.on('pageerror', error => formErrors.push(error.message));
    await formPage.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' });
    const lcInput = formPage.getByLabel('LEETCODE USERNAME');
    const cfInput = formPage.getByLabel('CODEFORCES USERNAME');
    await formPage.getByRole('button', { name: 'Search profiles' }).tap();
    await formPage.getByRole('alert').filter({ hasText: 'Enter at least one username to search.' }).waitFor({ state: 'visible' });
    await lcInput.fill('mobile-test');
    await cfInput.fill('mobile-test');
    const inputCheck = await Promise.all([lcInput.evaluate(input => ({ fontSize: getComputedStyle(input).fontSize, top: input.getBoundingClientRect().top, bottom: input.getBoundingClientRect().bottom })), cfInput.evaluate(input => ({ fontSize: getComputedStyle(input).fontSize, top: input.getBoundingClientRect().top, bottom: input.getBoundingClientRect().bottom }))]);
    if (inputCheck.some(input => parseFloat(input.fontSize) < 16 || input.top < 0 || input.bottom > 400)) failures.push(`Form fields are too small or obscured in the ${width}x400 keyboard-height viewport: ${JSON.stringify(inputCheck)}.`);
    await formPage.getByRole('button', { name: 'Search profiles' }).tap();
    await formPage.getByText('LeetCode: LeetCode profile loaded.', { exact: true }).waitFor({ state: 'visible', timeout: 12000 });
    await formPage.getByText('Codeforces: Codeforces profile loaded.', { exact: true }).waitFor({ state: 'visible', timeout: 12000 });
    const result = await formPage.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth, successCount: document.querySelectorAll('.status-success').length }));
    if (result.scrollWidth > result.width) failures.push(`Form success state overflows horizontally at ${width}x400 (${result.scrollWidth}px).`);
    if (result.successCount !== 2) failures.push(`Form success state did not show both profile results at ${width}x400.`);
    if (formErrors.length) failures.push(`Form flow console errors at ${width}x400: ${formErrors.join('; ')}.`);
    interactionResults.push({ name: `form ${width}x400`, inputCheck, ...result, consoleErrors: formErrors });
    await formContext.close();
  }

  const perfContext = await browser.newContext({ ...devices['iPhone 13'], viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const cdp = await perfContext.newCDPSession(await perfContext.newPage());
  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8, connectionType: 'cellular4g' });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  const perfPage = perfContext.pages()[0];
  await perfPage.addInitScript(() => {
    window.__mobileVitals = { lcp: null, cls: 0 };
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (kind, ...args) {
      if (['webgl', 'webgl2', 'experimental-webgl'].includes(kind)) return null;
      return getContext.call(this, kind, ...args);
    };
    try {
      new PerformanceObserver(list => { for (const entry of list.getEntries()) window.__mobileVitals.lcp = entry.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
      new PerformanceObserver(list => { for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__mobileVitals.cls += entry.value; }).observe({ type: 'layout-shift', buffered: true });
    } catch {}
  });
  const perfErrors = [];
  perfPage.on('console', message => { if (message.type() === 'error') perfErrors.push(message.text()); });
  perfPage.on('pageerror', error => perfErrors.push(error.message));
  await perfPage.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' });
  await perfPage.getByRole('heading', { level: 1 }).waitFor({ state: 'visible' });
  await delay(3000);
  performanceResults = await perfPage.evaluate(() => ({ ...window.__mobileVitals, webglDisabled: document.createElement('canvas').getContext('webgl') === null, canvasCount: document.querySelectorAll('canvas').length, reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches, navigation: performance.getEntriesByType('navigation')[0]?.toJSON(), viewport: { width: innerWidth, height: innerHeight }, scrollWidth: document.documentElement.scrollWidth }));
  performanceResults.consoleErrors = perfErrors;
  if (performanceResults.scrollWidth > 390) failures.push(`Throttled mobile performance page overflows horizontally (${performanceResults.scrollWidth}px).`);
  if (perfErrors.length) failures.push(`Throttled mobile performance console errors: ${perfErrors.join('; ')}.`);
  await perfContext.close();
  }

  await browser.close();
} finally {
  if (server && server.exitCode === null) server.kill('SIGTERM');
}

await writeFile(`${output}/measurements.json`, `${JSON.stringify({ viewports, results, interactionResults, performance: performanceResults, failures }, null, 2)}\n`);
const summaries = results.map(({ route, width, height, scrollWidth, viewport, extendingElements, clippedElements, smallText, smallControls }) =>
  `${route} ${width}x${height}: scrollWidth ${scrollWidth}/${viewport.width}; overflow ${extendingElements.length}; clipped ${clippedElements.length}; text<14 ${smallText.length}; targets<44 ${smallControls.length}`);
console.log(summaries.join('\n'));
if (failures.length) {
  console.error(failures.map(failure => `FAIL: ${failure}`).join('\n'));
  process.exitCode = 1;
} else console.log(`Mobile audit completed: ${output}. LCP ${performanceResults?.lcp ?? 'unavailable'}ms; CLS ${performanceResults?.cls ?? 'unavailable'}.`);
