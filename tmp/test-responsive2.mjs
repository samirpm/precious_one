import { chromium } from '/tmp/node_modules/playwright/index.mjs';

const browser = await chromium.launch();

const viewports = [
  { width: 1280, height: 800, name: '1280' },
  { width: 1024, height: 768, name: '1024' },
  { width: 430, height: 932, name: '430' },
  { width: 390, height: 844, name: '390' },
];

for (const vp of viewports) {
  const page = await browser.newPage();
  await page.setViewportSize({ width: vp.width, height: vp.height });
  await page.goto('http://localhost:3001', { waitUntil: 'networkidle', timeout: 20000 });

  // Wait for logo intro to finish
  await page.waitForTimeout(4500);

  // Screenshot hero
  await page.screenshot({ path: `/home/user/Desktop/precious_one/screenshots-responsive/hero-${vp.name}.png` });

  // Scroll to portfolio mid-point and check sticky
  const portfolioInfo = await page.evaluate(() => {
    const sections = document.querySelectorAll('section');
    let portfolioSection = null;
    for (const s of sections) {
      if (s.id === 'portfolio') { portfolioSection = s; break; }
    }
    if (!portfolioSection) return null;
    return {
      top: portfolioSection.getBoundingClientRect().top + window.scrollY,
      totalScroll: portfolioSection.scrollHeight - window.innerHeight,
    };
  });

  if (portfolioInfo) {
    const scrollTo = portfolioInfo.top + portfolioInfo.totalScroll * 0.4;
    await page.evaluate((pos) => window.scrollTo(0, pos), scrollTo);
    await page.waitForTimeout(600);
    await page.screenshot({ path: `/home/user/Desktop/precious_one/screenshots-responsive/portfolio-${vp.name}.png` });

    // Check sticky
    const stickyOk = await page.evaluate(() => {
      const section = document.getElementById('portfolio');
      const sticky = section?.querySelector('.sticky');
      if (!sticky) return false;
      const rect = sticky.getBoundingClientRect();
      return Math.abs(rect.top) < 5;
    });
    console.log(`${vp.name}px: portfolio sticky=${stickyOk ? 'OK' : 'BROKEN'}`);
  }

  // Scroll to services
  const servicesInfo = await page.evaluate(() => {
    const el = document.getElementById('services');
    return el ? el.getBoundingClientRect().top + window.scrollY : null;
  });
  if (servicesInfo) {
    await page.evaluate((pos) => window.scrollTo(0, pos + 100), servicesInfo);
    await page.waitForTimeout(400);
    await page.screenshot({ path: `/home/user/Desktop/precious_one/screenshots-responsive/services-${vp.name}.png` });
  }

  // Check for horizontal overflow
  const hasHOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth;
  });
  console.log(`${vp.name}px: horizontalOverflow=${hasHOverflow ? 'YES (BAD)' : 'none (good)'}`);

  await page.close();
}

await browser.close();
console.log('Done!');
