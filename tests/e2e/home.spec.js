import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the required demo store banner', async ({ page }) => {
    const banner = page.locator('.demo-banner');
    await expect(banner).toBeVisible();
    await expect(banner).toContainText('DEMO STORE: no real products, no real payments');
  });

  test('should display header with logo, navigation, and cart link', async ({ page }) => {
    await expect(page.locator('.logo')).toContainText('Zorvani');
    await expect(page.locator('.logo')).toContainText('Wear');
    const isMobile = await page.locator('.nav-toggle').isVisible();
    if (isMobile) {
      await expect(page.locator('.nav-toggle')).toBeVisible();
    } else {
      await expect(page.locator('.nav')).toBeVisible();
    }
    await expect(page.locator('.cart-link')).toBeVisible();
  });

  test('should display the hero section with call-to-action linking to shop', async ({ page }) => {
    const heroHeading = page.locator('.hero h1');
    await expect(heroHeading).toBeVisible();
    await expect(heroHeading).toContainText('Effortless Style');

    const shopCTA = page.locator('.hero a[href="/shop.html"]');
    await expect(shopCTA).toBeVisible();
  });

  test('should display 3 category tiles for Shirts, Pants, and Shoes', async ({ page }) => {
    const tiles = page.locator('.category-tile');
    await expect(tiles).toHaveCount(3);

    const shirtsTile = page.locator('a.category-tile[href="/shop.html?category=shirts"]');
    const pantsTile = page.locator('a.category-tile[href="/shop.html?category=pants"]');
    const shoesTile = page.locator('a.category-tile[href="/shop.html?category=shoes"]');

    await expect(shirtsTile).toBeVisible();
    await expect(pantsTile).toBeVisible();
    await expect(shoesTile).toBeVisible();
  });

  test('should display featured products in responsive grid', async ({ page }) => {
    const featuredCards = page.locator('#featured-products-grid .product-card');
    await expect(featuredCards).toHaveCount(8);

    // Each product card should have an SVG image, name, and INR price
    const firstCard = featuredCards.first();
    await expect(firstCard.locator('img')).toBeVisible();
    await expect(firstCard.locator('.price-current')).toContainText('₹');
  });

  test('should display "How Demo Ordering Works" with 3 steps', async ({ page }) => {
    const steps = page.locator('.step-card');
    await expect(steps).toHaveCount(3);
    await expect(steps.nth(0)).toContainText('Browse & Add to Cart');
    await expect(steps.nth(1)).toContainText('Fill Demo Checkout');
    await expect(steps.nth(2)).toContainText('Get WhatsApp Link');
  });

  test('should display footer with links to all info pages', async ({ page }) => {
    const footer = page.locator('.footer');
    await expect(footer).toBeVisible();
    await expect(footer.locator('a[href="/about.html"]')).toBeVisible();
    await expect(footer.locator('a[href="/shipping.html"]')).toBeVisible();
    await expect(footer.locator('a[href="/returns.html"]')).toBeVisible();
    await expect(footer.locator('a[href="/privacy.html"]')).toBeVisible();
    await expect(footer.locator('a[href="/contact.html"]')).toBeVisible();
  });
});
