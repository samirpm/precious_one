import { chromium } from '/tmp/node_modules/playwright/index.mjs';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto('http://localhost:3001', { waitUntil: 'networkidle', timeout: 20000 });

// Get portfolio absolute position first
const portfolioTop = await page.evaluate(() => {
  const el = document.querySelector('#portfolio');
  return el.getBoundingClientRect().top + window.scrollY;
});
console.log('Portfolio absolute top:', portfolioTop);

// Scroll to 40% through portfolio
const scrollTo = portfolioTop + 612; // 1530 * 0.4
await page.evaluate((pos) => window.scrollTo(0, pos), scrollTo);
await new Promise(r => setTimeout(r, 1000));

// Debug the portfolio internals
const debug = await page.evaluate(() => {
  const section = document.querySelector('#portfolio');
  const sticky = section?.querySelector('.sticky');
  const track = section?.querySelector('[class*="flex"][class*="items-center"]');

  // Find the image container div (the one with ref=trackRef)
  const allDivs = section?.querySelectorAll('div');
  let trackContainer = null;
  let imageContainers = [];

  allDivs?.forEach(div => {
    // Check for images inside
    const imgs = div.querySelectorAll('img, [class*="next-image"], span[style*="background"]');
    if (imgs.length > 3) {
      trackContainer = {
        class: div.className,
        scrollWidth: div.scrollWidth,
        clientWidth: div.clientWidth,
        childCount: div.children.length,
        rect: div.getBoundingClientRect(),
      };
    }
  });

  // Check all images
  const allImgs = section?.querySelectorAll('img');
  const imgInfo = [];
  allImgs?.forEach((img, i) => {
    const rect = img.getBoundingClientRect();
    imgInfo.push({
      index: i,
      src: img.src?.substring(0, 80),
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      display: getComputedStyle(img).display,
      visibility: getComputedStyle(img).visibility,
      opacity: getComputedStyle(img).opacity,
      rect: { x: Math.round(rect.x), y: Math.round(rect.y), w: Math.round(rect.width), h: Math.round(rect.height) },
    });
  });

  // Check the sticky container
  const stickyRect = sticky?.getBoundingClientRect();
  const stickyStyle = sticky ? {
    position: getComputedStyle(sticky).position,
    top: getComputedStyle(sticky).top,
    height: getComputedStyle(sticky).height,
    overflow: getComputedStyle(sticky).overflow,
  } : null;

  return {
    sectionHeight: section?.offsetHeight,
    stickyRect: stickyRect ? { x: Math.round(stickyRect.x), y: Math.round(stickyRect.y), w: Math.round(stickyRect.width), h: Math.round(stickyRect.height) } : null,
    stickyStyle,
    trackContainer,
    imageCount: imgInfo.length,
    images: imgInfo.slice(0, 5), // First 5
  };
});

console.log('Debug info:', JSON.stringify(debug, null, 2));

await page.screenshot({ path: '/home/user/Desktop/precious_one/screenshots-portfolio/debug-portfolio.png' });
await browser.close();
