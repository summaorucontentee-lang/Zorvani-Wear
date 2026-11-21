import { describe, it } from 'node:test';
import assert from 'node:assert';
import { formatPrice, STORE_NAME, CURRENCY, WHATSAPP_NUMBER, PRODUCTS_PER_PAGE, IMAGES_PER_PRODUCT } from '../../src/js/config.js';

describe('Config Module', () => {
  it('should define expected store constants', () => {
    assert.strictEqual(STORE_NAME, 'Zorvani Wear (DEMO)');
    assert.strictEqual(CURRENCY, 'INR');
    assert.strictEqual(typeof WHATSAPP_NUMBER, 'string');
    assert.strictEqual(PRODUCTS_PER_PAGE, 24);
    assert.strictEqual(IMAGES_PER_PRODUCT, 4);
  });

  describe('formatPrice()', () => {
    it('should format standard prices with INR currency symbol and commas', () => {
      const formatted = formatPrice(1499);
      // Clean non-breaking spaces if any
      assert.ok(formatted.includes('1,499') || formatted.includes('₹1,499'));
      assert.ok(formatted.includes('₹'));
    });

    it('should format zero correctly', () => {
      const formatted = formatPrice(0);
      assert.ok(formatted.includes('₹'));
      assert.ok(formatted.includes('0'));
    });

    it('should format large amounts using Indian grouping system', () => {
      const formatted = formatPrice(150000); // 1.5 Lakhs -> 1,50,000
      assert.ok(formatted.includes('1,50,000'));
    });

    it('should not contain decimal cents (maximumFractionDigits: 0)', () => {
      const formatted = formatPrice(1999.99);
      assert.ok(!formatted.includes('.99'));
    });
  });
});
