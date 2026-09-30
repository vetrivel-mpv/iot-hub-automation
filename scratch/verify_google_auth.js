const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto('http://localhost:3030');
  await page.waitForTimeout(1000);

  // Click on user chip to open Google Auth dropdown
  await page.click('#user-chip-btn');
  await page.waitForTimeout(500);

  // Capture screenshot of Google Auth Dropdown
  await page.screenshot({ path: 'reports/google_auth_dropdown_view.png' });
  console.log('Google Auth Dropdown Screenshot captured successfully');

  // Trigger Google Login API mock
  await page.evaluate(async () => {
    await fetch('/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        profile: {
          name: 'Vetrivel Murugan',
          email: 'vetrivel.murugan@nokia.com',
          picture: 'https://lh3.googleusercontent.com/a/ACg8ocISampleGoogleAvatar',
          sub: 'google-10928392183129'
        }
      })
    });
  });

  await page.reload();
  await page.waitForTimeout(1000);

  // Click user chip again to view authenticated state
  await page.click('#user-chip-btn');
  await page.waitForTimeout(500);

  // Capture screenshot of authenticated Google user state
  await page.screenshot({ path: 'reports/google_auth_authenticated_view.png' });
  console.log('Google Auth Authenticated Screenshot captured successfully');

  await browser.close();
})();
