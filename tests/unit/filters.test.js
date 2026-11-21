import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  filterProducts,
  sortProducts,
  getUniqueColors,
  getUniqueSizes,
  searchProducts,
} from '../../src/js/filters.js';

describe('Filters Module', () => {
  const sampleProducts = [
    { id: 1, name: 'Oxford Cotton Shirt', category: 'Shirts', price: 999, sizes: ['M', 'L'], colors: ['White', 'Navy'] },
    { id: 2, name: 'Linen Casual Shirt', category: 'Shirts', price: 1799, sizes: ['S', 'M'], colors: ['Sage Green'] },
    { id: 3, name: 'Slim Fit Chinos', category: 'Pants', price: 1499, sizes: ['30', '32'], colors: ['Khaki', 'Navy'] },
    { id: 4, name: 'Relaxed Joggers', category: 'Pants', price: 899, sizes: ['32', '34'], colors: ['Black'] },
    { id: 5, name: 'Canvas Sneakers', category: 'Shoes', price: 2499, sizes: ['UK7', 'UK8'], colors: ['White'] },
    { id: 6, name: 'Leather Derby Shoes', category: 'Shoes', price: 4999, sizes: ['UK8', 'UK9'], colors: ['Burgundy'] },
  ];

  describe('filterProducts()', () => {
    it('should filter by category (case-insensitive)', () => {
      const shirts = filterProducts(sampleProducts, { category: 'shirts' });
      assert.strictEqual(shirts.length, 2);
      assert.ok(shirts.every(p => p.category === 'Shirts'));

      const shoes = filterProducts(sampleProducts, { category: 'Shoes' });
      assert.strictEqual(shoes.length, 2);
    });

    it('should filter by size', () => {
      const sizeM = filterProducts(sampleProducts, { sizes: ['M'] });
      assert.strictEqual(sizeM.length, 2); // Oxford and Linen shirts
      assert.ok(sizeM.every(p => p.sizes.includes('M')));
    });

    it('should filter by color (case-insensitive)', () => {
      const navy = filterProducts(sampleProducts, { colors: ['navy'] });
      assert.strictEqual(navy.length, 2); // Oxford shirt and Chinos
    });

    it('should filter by price range', () => {
      const midRange = filterProducts(sampleProducts, { priceMin: 1000, priceMax: 2000 });
      assert.strictEqual(midRange.length, 2); // Linen Shirt (1799) and Chinos (1499)
      assert.ok(midRange.every(p => p.price >= 1000 && p.price <= 2000));
    });

    it('should combine multiple filters simultaneously', () => {
      const combined = filterProducts(sampleProducts, {
        category: 'pants',
        colors: ['navy'],
        priceMax: 1600,
      });
      assert.strictEqual(combined.length, 1);
      assert.strictEqual(combined[0].name, 'Slim Fit Chinos');
    });

    it('should return empty array when no products match filters', () => {
      const none = filterProducts(sampleProducts, { category: 'Shirts', priceMin: 5000 });
      assert.strictEqual(none.length, 0);
    });
  });

  describe('sortProducts()', () => {
    it('should sort products by price ascending (low to high)', () => {
      const sorted = sortProducts(sampleProducts, 'price-asc');
      assert.strictEqual(sorted[0].price, 899);
      assert.strictEqual(sorted[sorted.length - 1].price, 4999);
    });

    it('should sort products by price descending (high to low)', () => {
      const sorted = sortProducts(sampleProducts, 'price-desc');
      assert.strictEqual(sorted[0].price, 4999);
      assert.strictEqual(sorted[sorted.length - 1].price, 899);
    });

    it('should sort products by newest (highest id first)', () => {
      const sorted = sortProducts(sampleProducts, 'newest');
      assert.strictEqual(sorted[0].id, 6);
      assert.strictEqual(sorted[sorted.length - 1].id, 1);
    });
  });

  describe('searchProducts()', () => {
    it('should search products by name case-insensitively and partially', () => {
      const result = searchProducts(sampleProducts, 'shirt');
      assert.strictEqual(result.length, 2);

      const chinos = searchProducts(sampleProducts, 'CHINOS');
      assert.strictEqual(chinos.length, 1);
      assert.strictEqual(chinos[0].name, 'Slim Fit Chinos');
    });

    it('should return all products if search query is empty', () => {
      const all = searchProducts(sampleProducts, '   ');
      assert.strictEqual(all.length, sampleProducts.length);
    });
  });

  describe('getUniqueColors() and getUniqueSizes()', () => {
    it('should extract sorted unique colors across products', () => {
      const colors = getUniqueColors(sampleProducts);
      assert.ok(colors.includes('Navy'));
      assert.ok(colors.includes('White'));
      assert.strictEqual(new Set(colors).size, colors.length);
    });

    it('should extract sorted unique sizes', () => {
      const sizes = getUniqueSizes(sampleProducts);
      assert.ok(sizes.includes('M'));
      assert.ok(sizes.includes('UK8'));
    });
  });
});
