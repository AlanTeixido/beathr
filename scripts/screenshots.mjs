import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const DIR = 'screenshots';
mkdirSync(DIR, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
  colorScheme: 'dark',
});
const page = await ctx.newPage();

await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);

// 1. Full page
await page.screenshot({ path: `${DIR}/01-full-page.png`, fullPage: true });
console.log('01-full-page.png');

// 2. Hero (viewport)
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(500);
await page.screenshot({ path: `${DIR}/02-hero.png` });
console.log('02-hero.png');

// 3. Problem section
await page.evaluate(() => {
  const el = document.querySelectorAll('section')[1];
  if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
});
await page.waitForTimeout(800);
await page.screenshot({ path: `${DIR}/03-problem.png` });
console.log('03-problem.png');

// 4. How it works
await page.evaluate(() => {
  const el = document.querySelectorAll('section')[2];
  if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
});
await page.waitForTimeout(800);
await page.screenshot({ path: `${DIR}/04-how-it-works.png` });
console.log('04-how-it-works.png');

// 5. Semaphore demo
await page.evaluate(() => {
  const el = document.querySelectorAll('section')[3];
  if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
});
await page.waitForTimeout(800);
await page.screenshot({ path: `${DIR}/05-semaphore-demo.png` });
console.log('05-semaphore-demo.png');

// 6. Pricing
await page.evaluate(() => {
  const el = document.querySelector('#pricing');
  if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
});
await page.waitForTimeout(800);
await page.screenshot({ path: `${DIR}/06-pricing.png` });
console.log('06-pricing.png');

// 7. Footer
await page.evaluate(() => {
  const el = document.querySelector('footer');
  if (el) el.scrollIntoView({ behavior: 'instant', block: 'end' });
});
await page.waitForTimeout(500);
await page.screenshot({ path: `${DIR}/07-footer.png` });
console.log('07-footer.png');

// 8. Mobile view
await page.setViewportSize({ width: 390, height: 844 });
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(1000);
await page.screenshot({ path: `${DIR}/08-mobile-hero.png` });
console.log('08-mobile-hero.png');

await page.evaluate(() => {
  const el = document.querySelectorAll('section')[3];
  if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
});
await page.waitForTimeout(800);
await page.screenshot({ path: `${DIR}/09-mobile-semaphore.png` });
console.log('09-mobile-semaphore.png');

await browser.close();
console.log('\nDone! All screenshots saved to screenshots/');
