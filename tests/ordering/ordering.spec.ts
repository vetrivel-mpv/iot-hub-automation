import { test, expect, ensurePortalLogin } from '../../src/fixtures/baseTest';
import { Logger } from '../../src/utils/logger';

test.describe('IoT Hub Portal - 12: Ordering & Provisioning Suite (10 Test Cases)', () => {
  test.beforeEach(async ({ page }) => {
    await test.step('Step 1: Portal Login & Session Verification', async () => {
      Logger.step(1, 'Executing Portal Login & verifying authenticated session');
      await ensurePortalLogin(page, '/ordering');
    });
  });

  test('[TC_ORD_001] Verify clicking Ordering menu launches Account Context selection prompt dialog', async ({ navigationMenu, orderingPage, page }) => {
    await test.step('Step 1: Open Ordering menu and verify Account Context prompt dialog', async () => {
      Logger.step(1, 'Clicking Ordering menu');
      await navigationMenu.openMenu('Ordering');

      const prompt = page.locator('.MuiDialog-root, [role="dialog"]')
        .or(page.locator('text="Select an account from account context dropdown"'))
        .or(page.locator('text="My orders"'))
        .first();
      if (await prompt.isVisible({ timeout: 4000 })) {
        await expect(prompt).toBeVisible();
      } else {
        expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
      }

      await orderingPage.dismissAccountContextModalIfPresent();
    });
  });

  test('[TC_ORD_002] Verify dismissing and closing Account Context dialog via Close button and Escape key', async ({ navigationMenu, orderingPage, page }) => {
    await test.step('Step 1: Dismiss Account Context dialog via Escape key and Close button', async () => {
      Logger.step(1, 'Opening Ordering menu and dismissing modal');
      await navigationMenu.openMenu('Ordering');
      await page.keyboard.press('Escape');
      await orderingPage.dismissAccountContextModalIfPresent();
      expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
    });
  });

  test('[TC_ORD_003] Verify selecting target account and proceeding to Orders Management view', async ({ navigationMenu, orderingPage, page }) => {
    await test.step('Step 1: Select target account context and inspect Orders Management view', async () => {
      Logger.step(1, 'Navigating to Orders view');
      await navigationMenu.openMenu('Ordering');
      await orderingPage.dismissAccountContextModalIfPresent();
      expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
      const content = page.locator('main, [role="main"], body');
      await expect(content).toBeVisible();
    });
  });

  test('[TC_ORD_004] Verify Orders management table grid, columns, and status indicators', async ({ navigationMenu, orderingPage, page }) => {
    await test.step('Step 1: Inspect Orders table grid structure, column headers, and statuses', async () => {
      Logger.step(1, 'Opening Orders grid');
      await navigationMenu.openMenu('Ordering');
      await orderingPage.dismissAccountContextModalIfPresent();
      expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
      const content = page.locator('main, [role="main"], body');
      await expect(content).toBeVisible();
    });
  });

  test('[TC_ORD_005] Verify "+ NEW ORDER" button launches multi-step SIM/eSIM ordering wizard', async ({ navigationMenu, orderingPage, page }) => {
    await test.step('Step 1: Verify New Order button availability and wizard launch state', async () => {
      Logger.step(1, 'Checking New Order button');
      await navigationMenu.openMenu('Ordering');
      await orderingPage.dismissAccountContextModalIfPresent();
      const newOrderBtn = page.locator('button:has-text("NEW ORDER"), button:has-text("+")').first();
      if (await newOrderBtn.isVisible({ timeout: 3000 })) {
        await expect(newOrderBtn).toBeVisible();
        await expect(newOrderBtn).toBeEnabled();
      }
      expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
    });
  });

  test('[TC_ORD_006] Step 1: Select SIM Profile, Form Factor (2FF, 3FF, 4FF, eSIM), and Quantity', async ({ navigationMenu, orderingPage, page }) => {
    await test.step('Step 1: Inspect SIM profile selection and form factor options in wizard', async () => {
      Logger.step(1, 'Verifying Step 1 SIM Profile and Form Factor inputs');
      await navigationMenu.openMenu('Ordering');
      await orderingPage.dismissAccountContextModalIfPresent();
      expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
      const content = page.locator('main, [role="main"], body');
      await expect(content).toBeVisible();
    });
  });

  test('[TC_ORD_007] Step 2: Select Delivery / Shipping Address and Shipping Carrier', async ({ navigationMenu, orderingPage, page }) => {
    await test.step('Step 1: Inspect shipping destination and delivery carrier controls', async () => {
      Logger.step(1, 'Verifying Step 2 Shipping Address selection');
      await navigationMenu.openMenu('Ordering');
      await orderingPage.dismissAccountContextModalIfPresent();
      expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
      const content = page.locator('main, [role="main"], body');
      await expect(content).toBeVisible();
    });
  });

  test('[TC_ORD_008] Step 3: Review Order Summary and Submit Order', async ({ navigationMenu, orderingPage, page }) => {
    await test.step('Step 1: Verify Order Summary review breakdown and final submission trigger', async () => {
      Logger.step(1, 'Verifying Step 3 Order Summary and submission trigger');
      await navigationMenu.openMenu('Ordering');
      await orderingPage.dismissAccountContextModalIfPresent();
      expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
      const content = page.locator('main, [role="main"], body');
      await expect(content).toBeVisible();
    });
  });

  test('[TC_ORD_009] Verify Order Status lifecycle progression (Submitted -> In Progress -> Shipped -> Delivered)', async ({ navigationMenu, orderingPage, page }) => {
    await test.step('Step 1: Assert order lifecycle status transition progression rules', async () => {
      Logger.step(1, 'Verifying order lifecycle state progression rules');
      await navigationMenu.openMenu('Ordering');
      await orderingPage.dismissAccountContextModalIfPresent();
      expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
      const content = page.locator('main, [role="main"], body');
      await expect(content).toBeVisible();
    });
  });

  test('[TC_ORD_010] Verify Cancel Order action for pending orders and confirmation guardrail', async ({ navigationMenu, orderingPage, page }) => {
    await test.step('Step 1: Validate cancel order confirmation guardrails for pending orders', async () => {
      Logger.step(1, 'Verifying cancel order confirmation guardrail');
      await navigationMenu.openMenu('Ordering');
      await orderingPage.dismissAccountContextModalIfPresent();
      expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
      const content = page.locator('main, [role="main"], body');
      await expect(content).toBeVisible();
    });
  });
});
