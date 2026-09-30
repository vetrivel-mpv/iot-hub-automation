const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  await page.goto('http://localhost:3030');
  await page.waitForTimeout(1000);
  
  // Click on the API Performance tab
  await page.click('button[data-tab="performance"]');
  await page.waitForTimeout(1500);
  
  const perfListHtml = await page.$eval('#perf-actions-list', el => el.innerHTML);
  console.log('perfActionsList HTML snippet:', perfListHtml.slice(0, 300));

  // Capture UI screenshot
  await page.screenshot({ path: 'reports/api_performance_dashboard_view.png', fullPage: true });
  console.log('API Performance Dashboard Screenshot captured successfully');
  
  await browser.close();
})();
