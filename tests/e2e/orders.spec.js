import { test, expect } from '@playwright/test';

test.describe('Order History Page (Demo)', () => {
  test('should display placed demo orders and allow clearing history', async ({ page }) => {
    // 1. Place an order first
    await page.goto('/shop.html');
    await page.locator('#product-grid .product-card').first().click();
    await page.waitForURL(/product\.html/);

    await page.locator('.size-pill').first().click();
    await page.locator('#add-to-cart-btn').click();
    await expect(page.locator('#cart-feedback')).toBeVisible();

    await page.goto('/checkout.html');
    await page.locator('#customer-name').fill('Test User');
    await page.locator('#customer-phone').fill('9876543210');
    await page.locator('#customer-address').fill('123 Sample Street');
    await page.locator('#customer-city').fill('Delhi');
    await page.locator('#customer-pincode').fill('110001');

    // Intercept window.open
    await page.evaluate(() => { window.open = () => null; });
    await page.locator('#place-order-btn').click();
    await page.waitForURL(/thankyou\.html/);

    // 2. Navigate to Order History
    await page.goto('/orders.html');

    const orders = page.locator('.order-card');
    await expect(orders).toHaveCount(1);
    await expect(orders.first()).toContainText('ZW-DEMO-');
    await expect(orders.first()).toContainText('₹');

    // 3. Clear demo orders
    page.on('dialog', dialog => dialog.accept());
    await page.locator('#clear-orders-btn').click();

    // Empty state should now appear
    await expect(page.locator('#empty-orders-state')).toBeVisible();
    await expect(page.locator('.order-card')).toHaveCount(0);
  });
});
