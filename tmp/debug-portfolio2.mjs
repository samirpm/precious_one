import { chromium } from '/tmp/node_modules/playwright/index.mjs';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto('http://localhost:3001', { waitUntil: 'networkidle', timeout: 20000 });

// Get absolute position of portfolio
const portfolioTop = await page.evaluate(() => {
  const el = document.querySelector('#portfolio');
  return el.getBoundingClientRect().top + window.scrollY;
});

// Scroll to 30% through portfolio
const scrollTo = portfolioTop + 459; // 1530 * 0.30
await page.evaluate((pos) => window.scrollTo(0, pos), scrollTo);
await new Promise(r => setTimeout(r, 1500));

// Detailed debug: get all child elements of the sticky container
const debug = await page.evaluate(() => {
  const section = document.querySelector('#portfolio');
  const sticky = section?.querySelector('.sticky');
  if (!sticky) return { error: 'No sticky found' };

  const stickyRect = sticky.getBoundingClientRect();
  const result = {
    stickyRect: { x: stickyRect.x, y: stickyRect.y, w: stickyRect.width, h: stickyRect.height },
    stickyOverflow: getComputedStyle(sticky).overflow,
    children: [],
  };

  // Check each direct child of sticky
  for (let i = 0; i < sticky.children.length; i++) {
    const child = sticky.children[i];
    const rect = child.getBoundingClientRect();
    const style = getComputedStyle(child);
    result.children.push({
      index: i,
      tag: child.tagName,
      class: child.className.substring(0, 100),
      position: style.position,
      inset: style.inset,
      zIndex: style.zIndex,
      display: style.display,
      flexDirection: style.flexDirection,
      alignItems: style.alignItems,
      opacity: style.opacity,
      rect: { x: Math.round(rect.x), y: Math.round(rect.y), w: Math.round(rect.width), h: Math.round(rect.height) },
    });

    // Check grandchildren (images)
    if (child.querySelector('img') || child.querySelector('[style*="translateX"]')) {
      const imgs = child.querySelectorAll('img');
      result.children[i].imgCount = imgs.length;
      if (imgs.length > 0) {
        const imgRect = imgs[0].getBoundingClientRect();
        result.children[i].firstImg = {
          src: imgs[0].src?.substring(0, 80),
          rect: { x: Math.round(imgRect.x), y: Math.round(imgRect.y), w: Math.round(imgRect.width), h: Math.round(imgRect.height) },
          naturalWidth: imgs[0].naturalWidth,
          naturalHeight: imgs[0].naturalHeight,
        };
      }

      // Check the translateX container
      const txContainer = child.querySelector('[style*="translateX"]');
      if (txContainer) {
        const txRect = txContainer.getBoundingClientRect();
        const txStyle = getComputedStyle(txContainer);
        result.children[i].trackContainer = {
          rect: { x: Math.round(txRect.x), y: Math.round(txRect.y), w: Math.round(txRect.width), h: Math.round(txRect.height) },
          transform: txStyle.transform,
          display: txStyle.display,
          flexWrap: txStyle.flexWrap,
          gap: txStyle.gap,
          childCount: txContainer.children.length,
        };
      }
    }
  }

  return result;
});

console.log('Debug:', JSON.stringify(debug, null, 2));

// Also take a screenshot at this position
await page.screenshot({ path: '/home/user/Desktop/precious_one/screenshots-portfolio/debug2.png' });

await browser.close();
