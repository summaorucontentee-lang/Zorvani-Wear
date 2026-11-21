import { test, expect } from '@playwright/test';

test.describe('Product Detail Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to shop and click the first product
    await page.goto('/shop.html');
    await page.locator('#product-grid .product-card').first().click();
    await page.waitForURL(/product\.html/);
  });

  test('should display product info, price in INR, and demo banner', async ({ page }) => {
    await expect(page.locator('.demo-banner')).toBeVisible();
    await expect(page.locator('#product-name')).not.toBeEmpty();
    await expect(page.locator('#product-price')).toContainText('₹');
    await expect(page.locator('#product-description')).not.toBeEmpty();
    await expect(page.locator('#product-material')).not.toBeEmpty();
    await expect(page.locator('#product-care')).not.toBeEmpty();
  });

  test('gallery switches main image when thumbnails are clicked and via arrow keys', async ({ page }) => {
    const mainImg = page.locator('#gallery-main-img');
    const initialSrc = await mainImg.getAttribute('src');

    // Click 2nd thumbnail
    const thumbs = page.locator('.gallery-thumb');
    await expect(thumbs).toHaveCount(4);

    await thumbs.nth(1).click();
    const secondSrc = await mainImg.getAttribute('src');
    expect(secondSrc).not.toBe(initialSrc);

    // Arrow keys
    await page.keyboard.press('ArrowRight');
    const thirdSrc = await mainImg.getAttribute('src');
    expect(thirdSrc).not.toBe(secondSrc);

    await page.keyboard.press('ArrowLeft');
    const backSrc = await mainImg.getAttribute('src');
    expect(backSrc).toBe(secondSrc);
  });

  test('Add to Cart requires a size and displays clear error when none selected', async ({ page }) => {
    const errorEl = page.locator('#size-error');
    await expect(errorEl).toBeHidden();

    // Click Add to Cart without selecting size
    await page.locator('#add-to-cart-btn').click();

    await expect(errorEl).toBeVisible();
    await expect(errorEl).toContainText(/select a size/i);
  });

  test('Add to Cart succeeds when size is selected and updates header cart count', async ({ page }) => {
    // Select first size
    const firstSizePill = page.locator('.size-pill').first();
    await firstSizePill.click();
    await expect(firstSizePill).toHaveClass(/selected/);

    // Error should disappear
    await expect(page.locator('#size-error')).toBeHidden();

    // Click Add to Cart
    await page.locator('#add-to-cart-btn').click();

    // Feedback message should display
    await expect(page.locator('#cart-feedback')).toBeVisible();
    await expect(page.locator('#cart-feedback')).toContainText(/added/i);

    // Header cart badge should update to at least 1
    const cartBadge = page.locator('#cart-count');
    await expect(cartBadge).toBeVisible();
    const count = await cartBadge.textContent();
    expect(parseInt(count || '0', 10)).toBeGreaterThanOrEqual(1);
  });

  test('quantity selector allows incrementing and decrementing before adding', async ({ page }) => {
    const qtyInput = page.locator('#qty-input');
    await expect(qtyInput).toHaveValue('1');

    await page.locator('#qty-plus').click();
    await expect(qtyInput).toHaveValue('2');

    await page.locator('#qty-minus').click();
    await expect(qtyInput).toHaveValue('1');
  });

  test('should display size guide table', async ({ page }) => {
    await expect(page.locator('#size-guide-container table')).toBeVisible();
  });

  test('should display clearly labeled empty reviews section', async ({ page }) => {
    const reviewsText = await page.locator('text=Reviews: no reviews yet (demo)').textContent();
    expect(reviewsText).toContain('Reviews: no reviews yet (demo)');
  });

  test('should display "You May Also Like" with 4 products from same category', async ({ page }) => {
    const relatedCards = page.locator('#related-products-grid .product-card');
    await expect(relatedCards).toHaveCount(4);
  });
});
