import { chromium } from '/tmp/node_modules/playwright/index.mjs';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto('http://localhost:3001', { waitUntil: 'networkidle', timeout: 20000 });

// Scroll somewhere into portfolio
const portfolioTop = await page.evaluate(() => {
  const el = document.querySelector('#portfolio');
  return el.getBoundingClientRect().top + window.scrollY;
});
await page.evaluate((pos) => window.scrollTo(0, pos + 300), portfolioTop);
await new Promise(r => setTimeout(r, 500));

// Check ALL ancestors of the sticky element for overflow issues
const debug = await page.evaluate(() => {
  const section = document.querySelector('#portfolio');
  const sticky = section?.querySelector('.sticky');
  if (!sticky) return { error: 'No sticky found' };

  const result = {
    stickyPosition: getComputedStyle(sticky).position,
    stickyTop: getComputedStyle(sticky).top,
    stickyHeight: getComputedStyle(sticky).height,
    stickyOverflow: getComputedStyle(sticky).overflow,
    stickyOverflowX: getComputedStyle(sticky).overflowX,
    stickyOverflowY: getComputedStyle(sticky).overflowY,
    ancestors: [],
  };

  // Walk up from sticky to body, checking for overflow issues
  let el = sticky.parentElement;
  while (el && el !== document.documentElement) {
    const style = getComputedStyle(el);
    const overflow = style.overflow;
    const overflowX = style.overflowX;
    const overflowY = style.overflowY;
    const overflowAny = overflow !== 'visible' && overflow !== 'clip';
    const overflowXAny = overflowX !== 'visible' && overflowX !== 'clip';
    const overflowYAny = overflowY !== 'visible' && overflowY !== 'clip';

    result.ancestors.push({
      tag: el.tagName,
      id: el.id || undefined,
      class: el.className?.substring?.(0, 100) || undefined,
      position: style.position,
      overflow,
      overflowX,
      overflowY,
      overflowIssue: overflowAny || overflowXAny || overflowYAny,
      rect: {
        top: Math.round(el.getBoundingClientRect().top),
        height: Math.round(el.getBoundingClientRect().height),
        scrollHeight: el.scrollHeight,
        clientHeight: el.clientHeight,
      },
    });

    el = el.parentElement;
  }

  return result;
});

console.log(JSON.stringify(debug, null, 2));
await browser.close();
