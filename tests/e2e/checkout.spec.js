import { test, expect } from '@playwright/test';

test.describe('Checkout Page (Demo)', () => {
  test.beforeEach(async ({ page }) => {
    // Add an item to cart first so checkout has items
    await page.goto('/shop.html');
    await page.locator('#product-grid .product-card').first().click();
    await page.waitForURL(/product\.html/);

    await page.locator('.size-pill').first().click();
    await page.locator('#add-to-cart-btn').click();
    await expect(page.locator('#cart-feedback')).toBeVisible();

    await page.goto('/checkout.html');
  });

  test('should display demo checkout banner and warning notice', async ({ page }) => {
    await expect(page.locator('.demo-banner')).toBeVisible();
    const notice = page.locator('text=Demo checkout. No payment is collected.');
    await expect(notice).toBeVisible();
  });

  test('should block submission and show validation errors on invalid inputs', async ({ page }) => {
    // Submit empty form
    await page.locator('#place-order-btn').click();

    await expect(page.locator('#name-error')).toBeVisible();
    await expect(page.locator('#phone-error')).toBeVisible();
    await expect(page.locator('#address-error')).toBeVisible();
    await expect(page.locator('#city-error')).toBeVisible();
    await expect(page.locator('#pincode-error')).toBeVisible();

    // Fill invalid phone (e.g. 123) and invalid pincode (e.g. 12)
    await page.locator('#customer-phone').fill('12345');
    await page.locator('#customer-pincode').fill('12');
    await page.locator('#place-order-btn').click();

    await expect(page.locator('#phone-error')).toContainText(/valid 10-digit/i);
    await expect(page.locator('#pincode-error')).toContainText(/valid 6-digit/i);
  });

  test('should process valid checkout, intercept WhatsApp window.open, redirect to Thank You, and clear cart', async ({ page }) => {
    // Intercept window.open
    let openedURL = '';
    await page.exposeFunction('mockWindowOpen', (url) => {
      openedURL = url;
    });
    await page.evaluate(() => {
      window.open = (url) => {
        window.mockWindowOpen(url);
        return null;
      };
    });

    // Fill valid form fields
    await page.locator('#customer-name').fill('Aarav Mehta');
    await page.locator('#customer-phone').fill('9820012345');
    await page.locator('#customer-address').fill('Flat 402, Sunset Towers, Bandra');
    await page.locator('#customer-city').fill('Mumbai');
    await page.locator('#customer-pincode').fill('400050');

    // Submit form
    await page.locator('#place-order-btn').click();

    // Should redirect to Thank You page with orderId in URL
    await page.waitForURL(/thankyou\.html\?orderId=ZW-DEMO-/);

    // Verify WhatsApp URL was generated and contains order info
    expect(openedURL).toContain('https://wa.me/');
    expect(decodeURIComponent(openedURL)).toContain('Aarav Mehta');
    expect(decodeURIComponent(openedURL)).toContain('ZW-DEMO-');

    // Verify Thank You page details
    await expect(page.locator('#thankyou-success-card h1')).toContainText(/Thank You/i);
    await expect(page.locator('#thankyou-order-id')).toContainText('ZW-DEMO-');
    await expect(page.locator('#thankyou-order-total')).toContainText('₹');

    // Verify cart is cleared
    const cartCount = page.locator('#cart-count');
    await expect(cartCount).toBeHidden();
  });
});
