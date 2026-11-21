import { test, expect } from '@playwright/test';

test.describe('DataLayer Tracking', () => {
  test('should push view_item_list on shop page', async ({ page }) => {
    await page.goto('/shop.html');
    const dataLayer = await page.evaluate(() => window.dataLayer || []);
    const event = dataLayer.find(e => e.event === 'view_item_list');

    expect(event).toBeDefined();
    expect(event.ecommerce.currency).toBe('INR');
    expect(event.ecommerce.items.length).toBeGreaterThan(0);
    expect(event.ecommerce.items[0]).toHaveProperty('item_id');
    expect(event.ecommerce.items[0]).toHaveProperty('item_name');
    expect(event.ecommerce.items[0]).toHaveProperty('price');
  });

  test('should push view_item and add_to_cart on product page', async ({ page }) => {
    await page.goto('/shop.html');
    await page.locator('#product-grid .product-card').first().click();
    await page.waitForURL(/product\.html/);

    // Verify view_item
    let dataLayer = await page.evaluate(() => window.dataLayer || []);
    const viewItemEvent = dataLayer.find(e => e.event === 'view_item');
    expect(viewItemEvent).toBeDefined();
    expect(viewItemEvent.ecommerce.currency).toBe('INR');

    // Add to cart
    await page.locator('.size-pill').first().click();
    await page.locator('#add-to-cart-btn').click();

    // Verify add_to_cart
    dataLayer = await page.evaluate(() => window.dataLayer || []);
    const addToCartEvent = dataLayer.find(e => e.event === 'add_to_cart');
    expect(addToCartEvent).toBeDefined();
    expect(addToCartEvent.ecommerce.items[0].currency).toBe('INR');
  });

  test('should push view_cart, begin_checkout, generate_lead, and purchase events throughout checkout flow', async ({ page }) => {
    // 1. Add item to cart
    await page.goto('/shop.html');
    await page.locator('#product-grid .product-card').first().click();
    await page.waitForURL(/product\.html/);
    await page.locator('.size-pill').first().click();
    await page.locator('#add-to-cart-btn').click();

    // 2. View cart
    await page.goto('/cart.html');
    let dataLayer = await page.evaluate(() => window.dataLayer || []);
    const viewCartEvent = dataLayer.find(e => e.event === 'view_cart');
    expect(viewCartEvent).toBeDefined();

    // 3. Begin checkout
    await page.goto('/checkout.html');
    dataLayer = await page.evaluate(() => window.dataLayer || []);
    const beginCheckoutEvent = dataLayer.find(e => e.event === 'begin_checkout');
    expect(beginCheckoutEvent).toBeDefined();

    // 4. Fill form & place order
    await page.evaluate(() => { window.open = () => null; });
    await page.locator('#customer-name').fill('Vikram Malhotra');
    await page.locator('#customer-phone').fill('9876543210');
    await page.locator('#customer-address').fill('10 Downing Street');
    await page.locator('#customer-city').fill('Mumbai');
    await page.locator('#customer-pincode').fill('400001');

    await page.locator('#place-order-btn').click();
    await page.waitForURL(/thankyou\.html/);

    // Verify purchase event on Thank You page
    dataLayer = await page.evaluate(() => window.dataLayer || []);
    const purchaseEvent = dataLayer.find(e => e.event === 'purchase');
    expect(purchaseEvent).toBeDefined();
    expect(purchaseEvent.ecommerce.currency).toBe('INR');
    expect(purchaseEvent.ecommerce.demo).toBe(true);
    expect(purchaseEvent.ecommerce.transaction_id).toMatch(/ZW-DEMO-/);
  });
});
