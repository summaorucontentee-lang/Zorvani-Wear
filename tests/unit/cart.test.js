import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';

// Mock localStorage
let storage = {};
globalThis.localStorage = {
  getItem: (key) => storage[key] || null,
  setItem: (key, val) => { storage[key] = String(val); },
  removeItem: (key) => { delete storage[key]; },
  clear: () => { storage = {}; },
};

import {
  addToCart,
  getCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  getCartTotal,
  saveCart,
  loadCart,
  CART_STORAGE_KEY,
} from '../../src/js/cart.js';

describe('Cart Module', () => {
  beforeEach(() => {
    storage = {};
  });

  const dummyProduct = {
    id: 10,
    slug: 'oxford-shirt-white',
    name: 'Oxford Shirt - White',
    price: 1299,
    category: 'Shirts',
    images: ['/images/shirts/oxford-shirt-white-front.svg'],
  };

  it('should start with an empty cart', () => {
    assert.deepStrictEqual(getCart(), []);
    assert.deepStrictEqual(getCartTotal(), { subtotal: 0, itemCount: 0 });
  });

  it('should throw an error when adding to cart without a size', () => {
    assert.throws(() => {
      addToCart(dummyProduct, '', 'White', 1);
    }, /size is required/i);
  });

  it('should add an item to the cart with size and color', () => {
    const updated = addToCart(dummyProduct, 'M', 'White', 1);
    assert.strictEqual(updated.length, 1);
    assert.strictEqual(updated[0].name, 'Oxford Shirt - White');
    assert.strictEqual(updated[0].size, 'M');
    assert.strictEqual(updated[0].color, 'White');
    assert.strictEqual(updated[0].quantity, 1);
    assert.strictEqual(updated[0].price, 1299);
  });

  it('should increment quantity if the same product, size, and color is added again', () => {
    addToCart(dummyProduct, 'M', 'White', 1);
    addToCart(dummyProduct, 'M', 'White', 2);
    const cart = getCart();
    assert.strictEqual(cart.length, 1);
    assert.strictEqual(cart[0].quantity, 3);
  });

  it('should create separate line items if sizes or colors differ', () => {
    addToCart(dummyProduct, 'M', 'White', 1);
    addToCart(dummyProduct, 'L', 'White', 1);
    addToCart(dummyProduct, 'M', 'Blue', 1);
    const cart = getCart();
    assert.strictEqual(cart.length, 3);
  });

  it('should calculate cart total and item count accurately', () => {
    addToCart(dummyProduct, 'M', 'White', 2); // 2 * 1299 = 2598
    const secondProduct = { id: 20, slug: 'chinos-navy', name: 'Chinos', price: 1999, images: [] };
    addToCart(secondProduct, '32', 'Navy', 1); // 1 * 1999 = 1999

    const { subtotal, itemCount } = getCartTotal();
    assert.strictEqual(subtotal, 2598 + 1999);
    assert.strictEqual(itemCount, 3);
  });

  it('should update item quantity', () => {
    addToCart(dummyProduct, 'M', 'White', 1);
    updateQuantity(0, 5);
    assert.strictEqual(getCart()[0].quantity, 5);
    assert.strictEqual(getCartTotal().itemCount, 5);

    // Quantity cannot be less than 1
    updateQuantity(0, 0);
    assert.strictEqual(getCart()[0].quantity, 1);
  });

  it('should remove an item from the cart', () => {
    addToCart(dummyProduct, 'M', 'White', 1);
    const secondProduct = { id: 20, slug: 'chinos', name: 'Chinos', price: 1999, images: [] };
    addToCart(secondProduct, '32', 'Khaki', 1);

    assert.strictEqual(getCart().length, 2);
    removeFromCart(0);
    const remaining = getCart();
    assert.strictEqual(remaining.length, 1);
    assert.strictEqual(remaining[0].name, 'Chinos');
  });

  it('should clear the entire cart', () => {
    addToCart(dummyProduct, 'M', 'White', 2);
    clearCart();
    assert.deepStrictEqual(getCart(), []);
    assert.strictEqual(getCartTotal().subtotal, 0);
  });

  it('should persist and load cart across localStorage writes', () => {
    addToCart(dummyProduct, 'XL', 'White', 2);
    const rawStored = storage[CART_STORAGE_KEY];
    assert.ok(rawStored);
    const parsed = JSON.parse(rawStored);
    assert.strictEqual(parsed.length, 1);
    assert.strictEqual(parsed[0].size, 'XL');
  });
});
