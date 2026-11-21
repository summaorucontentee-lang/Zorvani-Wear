import { test, expect } from '@playwright/test';

test.describe('Cart Page', () => {
  test('should show empty cart state when no items added', async ({ page }) => {
    // Clear localStorage first
    await page.goto('/cart.html');
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    await expect(page.locator('#empty-cart-state')).toBeVisible();
    await expect(page.locator('#cart-content')).toBeHidden();

    // Link to shop works
    await page.locator('#empty-cart-state a[href="/shop.html"]').click();
    await expect(page).toHaveURL(/shop\.html/);
  });

  test('should display added product, change quantity, persist across reload, and remove', async ({ page }) => {
    // 1. Go to product page and add an item
    await page.goto('/shop.html');
    await page.locator('#product-grid .product-card').first().click();
    await page.waitForURL(/product\.html/);

    const productName = await page.locator('#product-name').textContent();

    // Select size and add to cart
    await page.locator('.size-pill').first().click();
    await page.locator('#add-to-cart-btn').click();
    await expect(page.locator('#cart-feedback')).toBeVisible();

    // 2. Navigate to cart page
    await page.goto('/cart.html');
    await expect(page.locator('#cart-content')).toBeVisible();

    const cartItem = page.locator('.cart-item-card').first();
    await expect(cartItem).toContainText(productName?.trim() || '');

    // Check price and totals formatted with INR ₹
    await expect(page.locator('#cart-total')).toContainText('₹');
    await expect(page.locator('#cart-subtotal')).toContainText('₹');

    // 3. Increment quantity
    const initialTotalText = await page.locator('#cart-total').textContent();
    await cartItem.locator('.qty-inc-btn').click();
    await page.waitForTimeout(100);

    const updatedTotalText = await page.locator('#cart-total').textContent();
    expect(updatedTotalText).not.toBe(initialTotalText);

    // 4. Persistence across page reload
    await page.reload();
    await expect(page.locator('#cart-content')).toBeVisible();
    const reloadedTotalText = await page.locator('#cart-total').textContent();
    expect(reloadedTotalText).toBe(updatedTotalText);

    // 5. Remove item
    await page.locator('.remove-item-btn').click();
    await page.waitForTimeout(200);

    // Should now show empty cart state
    await expect(page.locator('#empty-cart-state')).toBeVisible();
    await expect(page.locator('#cart-content')).toBeHidden();
    await expect(page.locator('#cart-count')).toBeHidden();
  });
});
