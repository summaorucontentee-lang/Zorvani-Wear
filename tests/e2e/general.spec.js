import { test, expect } from '@playwright/test';

const PAGES = [
  '/',
  '/shop.html',
  '/cart.html',
  '/checkout.html',
  '/orders.html',
  '/about.html',
  '/shipping.html',
  '/returns.html',
  '/privacy.html',
  '/contact.html',
  '/404.html',
];

test.describe('General Health, A11y, and Consistency', () => {
  for (const pagePath of PAGES) {
    test(`page ${pagePath} should load without console errors or broken images, and show demo banner`, async ({ page }) => {
      const consoleErrors = [];
      const failedRequests = [];

      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });

      page.on('requestfailed', req => {
        failedRequests.push(`${req.method()} ${req.url()}`);
      });

      const response = await page.goto(pagePath);
      expect(response?.status()).toBeLessThan(500);

      // Verify demo banner is on every page
      const banner = page.locator('.demo-banner');
      await expect(banner).toBeVisible();
      await expect(banner).toContainText('DEMO STORE: no real products, no real payments');

      // Verify header logo exists
      await expect(page.locator('.logo')).toBeVisible();

      // Check no console errors
      expect(consoleErrors).toEqual([]);

      // Check no failed image requests
      const failedImages = failedRequests.filter(url => url.includes('.svg') || url.includes('.png'));
      expect(failedImages).toEqual([]);
    });
  }

  test('prices everywhere must use INR symbol (₹) and never USD ($) or EUR (€)', async ({ page }) => {
    await page.goto('/shop.html');
    const bodyText = await page.locator('body').innerText();

    expect(bodyText).toContain('₹');
    expect(bodyText).not.toContain('$');
    expect(bodyText).not.toContain('€');
    expect(bodyText).not.toContain('USD');
  });

  test('404 page should respond with proper messaging', async ({ page }) => {
    await page.goto('/non-existent-page-demo.html');
    await expect(page.locator('h1')).toContainText(/404|Not Found/i);
    await expect(page.locator('.demo-banner')).toBeVisible();
  });
});
