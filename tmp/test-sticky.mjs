import { chromium } from '/tmp/node_modules/playwright/index.mjs';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto('http://localhost:3001', { waitUntil: 'networkidle', timeout: 20000 });

// Get portfolio position
const portfolioTop = await page.evaluate(() => {
  const el = document.querySelector('#portfolio');
  return el.getBoundingClientRect().top + window.scrollY;
});
console.log('Portfolio top:', portfolioTop);

// Test sticky at different scroll positions
const testPositions = [0, 0.1, 0.2, 0.3, 0.5, 0.7, 0.9, 1.0];
const totalScroll = 1530; // 270vh - 100vh

for (const frac of testPositions) {
  const scrollTo = portfolioTop + frac * totalScroll;
  await page.evaluate((pos) => window.scrollTo(0, pos), scrollTo);
  await new Promise(r => setTimeout(r, 500));

  const info = await page.evaluate(() => {
    const section = document.querySelector('#portfolio');
    const sticky = section?.querySelector('.sticky');
    const sectionRect = section?.getBoundingClientRect();
    const stickyRect = sticky?.getBoundingClientRect();
    return {
      sectionTop: Math.round(sectionRect?.top),
      stickyTop: Math.round(stickyRect?.top),
      stickyHeight: Math.round(stickyRect?.height),
      isStickyWorking: stickyRect?.top === 0 || (stickyRect?.top > -5 && stickyRect?.top < 5),
    };
  });

  console.log(`frac=${frac.toFixed(1)}: section.top=${info.sectionTop} sticky.top=${info.stickyTop} sticky.h=${info.stickyHeight} stickyWorking=${info.isStickyWorking}`);
  await page.screenshot({ path: `/home/user/Desktop/precious_one/screenshots-portfolio/sticky-${String(frac).replace('.', '_')}.png` });
}

await browser.close();
