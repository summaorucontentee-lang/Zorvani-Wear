import { test, expect } from '@playwright/test';

test.describe('Shop Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/shop.html');
  });

  test('should load 24 products initially and show total matching count (60+)', async ({ page }) => {
    const productCountText = await page.locator('#product-count').textContent();
    expect(productCountText).toMatch(/Showing 24 of \d+ products/);

    const initialCards = page.locator('#product-grid .product-card');
    await expect(initialCards).toHaveCount(24);

    const loadMoreBtn = page.locator('#load-more-btn');
    await expect(loadMoreBtn).toBeVisible();

    // Click Load More to load next page (48 total)
    await loadMoreBtn.click();
    await expect(page.locator('#product-grid .product-card')).toHaveCount(48);

    // Click Load More again to load all remaining (60+ total)
    await loadMoreBtn.click();
    const totalCount = await page.locator('#product-grid .product-card').count();
    expect(totalCount).toBeGreaterThanOrEqual(60);
  });

  test('each category should have at least 20 products', async ({ page }) => {
    // 1. Shirts category
    await page.goto('/shop.html?category=shirts');
    const shirtsText = await page.locator('#product-count').textContent();
    const shirtsMatch = shirtsText?.match(/of (\d+) products/);
    const shirtsTotal = shirtsMatch ? parseInt(shirtsMatch[1], 10) : 0;
    expect(shirtsTotal).toBeGreaterThanOrEqual(20);

    // 2. Pants category
    await page.goto('/shop.html?category=pants');
    const pantsText = await page.locator('#product-count').textContent();
    const pantsMatch = pantsText?.match(/of (\d+) products/);
    const pantsTotal = pantsMatch ? parseInt(pantsMatch[1], 10) : 0;
    expect(pantsTotal).toBeGreaterThanOrEqual(20);

    // 3. Shoes category
    await page.goto('/shop.html?category=shoes');
    const shoesText = await page.locator('#product-count').textContent();
    const shoesMatch = shoesText?.match(/of (\d+) products/);
    const shoesTotal = shoesMatch ? parseInt(shoesMatch[1], 10) : 0;
    expect(shoesTotal).toBeGreaterThanOrEqual(20);
  });

  test('category radio filter switches products interactively', async ({ page }) => {
    const filterBtn = page.locator('#filter-toggle-btn');
    if (await filterBtn.isVisible()) {
      await filterBtn.click();
    }
    await page.locator('input[name="category-filter"][value="shirts"]').check();
    await expect(page.locator('#category-title')).toContainText('Shirts');

    const firstCardCategory = await page.locator('#product-grid .product-card-category').first().textContent();
    expect(firstCardCategory?.trim()).toBe('Shirts');
  });

  test('search box filters products by name', async ({ page }) => {
    await page.locator('#search-input').fill('Linen');
    // Wait for debounced search to trigger
    await page.waitForTimeout(400);

    const cards = page.locator('#product-grid .product-card');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);

    const firstTitle = await cards.first().locator('.product-card-name').textContent();
    expect(firstTitle?.toLowerCase()).toContain('linen');
  });

  test('sort by price low to high sorts prices in ascending order', async ({ page }) => {
    await page.locator('#sort-select').selectOption('price-asc');
    await page.waitForTimeout(200);

    const priceTexts = await page.locator('#product-grid .price-current').allTextContents();
    const prices = priceTexts.map(t => parseInt(t.replace(/[^0-9]/g, ''), 10));

    expect(prices.length).toBeGreaterThan(1);
    for (let i = 0; i < prices.length - 1; i++) {
      expect(prices[i]).toBeLessThanOrEqual(prices[i + 1]);
    }
  });

  test('sort by price high to low sorts prices in descending order', async ({ page }) => {
    await page.locator('#sort-select').selectOption('price-desc');
    await page.waitForTimeout(200);

    const priceTexts = await page.locator('#product-grid .price-current').allTextContents();
    const prices = priceTexts.map(t => parseInt(t.replace(/[^0-9]/g, ''), 10));

    expect(prices.length).toBeGreaterThan(1);
    for (let i = 0; i < prices.length - 1; i++) {
      expect(prices[i]).toBeGreaterThanOrEqual(prices[i + 1]);
    }
  });

  test('price range filter restricts product price boundaries', async ({ page }) => {
    const filterBtn = page.locator('#filter-toggle-btn');
    if (await filterBtn.isVisible()) {
      await filterBtn.click();
    }
    await page.locator('#price-min').fill('1500');
    await page.locator('#price-max').fill('2500');
    await page.waitForTimeout(200);

    const priceTexts = await page.locator('#product-grid .price-current').allTextContents();
    const prices = priceTexts.map(t => parseInt(t.replace(/[^0-9]/g, ''), 10));

    expect(prices.length).toBeGreaterThan(0);
    for (const p of prices) {
      expect(p).toBeGreaterThanOrEqual(1500);
      expect(p).toBeLessThanOrEqual(2500);
    }
  });

  test('shows empty state when no products match filters', async ({ page }) => {
    await page.locator('#search-input').fill('NonExistentProductZ999');
    await page.waitForTimeout(400);

    await expect(page.locator('#empty-state')).toBeVisible();
    await expect(page.locator('#product-grid .product-card')).toHaveCount(0);

    // Clicking clear filters restores products
    await page.locator('#empty-state button').click();
    await page.waitForTimeout(300);
    await expect(page.locator('#product-grid .product-card')).toHaveCount(24);
  });
});
