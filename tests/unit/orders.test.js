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
  generateOrderId,
  createOrder,
  saveOrder,
  getOrders,
  clearOrders,
  buildWhatsAppMessage,
  getWhatsAppURL,
  ORDERS_STORAGE_KEY,
} from '../../src/js/orders.js';

describe('Orders Module', () => {
  beforeEach(() => {
    storage = {};
  });

  const sampleCart = [
    { productId: 1, name: 'Oxford Shirt', price: 999, quantity: 2, size: 'M', color: 'White' },
    { productId: 2, name: 'Slim Chinos', price: 1499, quantity: 1, size: '32', color: 'Navy' },
  ];

  const sampleCustomer = {
    name: 'Rohan Gupta',
    phone: '9876543210',
    address: '42 MG Road',
    city: 'Bengaluru',
    pincode: '560001',
  };

  it('generateOrderId() should return a string prefixed with ZW-DEMO-', () => {
    const id = generateOrderId();
    assert.ok(id.startsWith('ZW-DEMO-'));
    assert.ok(id.length > 10);
  });

  it('createOrder() should compute totals, items, customer info and demo status', () => {
    const order = createOrder(sampleCart, sampleCustomer);
    assert.ok(order.orderId.startsWith('ZW-DEMO-'));
    assert.strictEqual(order.total, 999 * 2 + 1499);
    assert.strictEqual(order.itemCount, 3);
    assert.strictEqual(order.demo, true);
    assert.strictEqual(order.customer.name, 'Rohan Gupta');
    assert.strictEqual(order.items.length, 2);
  });

  it('saveOrder() and getOrders() should store and retrieve orders from localStorage', () => {
    const order1 = createOrder(sampleCart, sampleCustomer);
    saveOrder(order1);

    const retrieved = getOrders();
    assert.strictEqual(retrieved.length, 1);
    assert.strictEqual(retrieved[0].orderId, order1.orderId);

    const order2 = createOrder(sampleCart, sampleCustomer);
    saveOrder(order2);
    assert.strictEqual(getOrders().length, 2);
  });

  it('clearOrders() should remove all orders from localStorage', () => {
    const order = createOrder(sampleCart, sampleCustomer);
    saveOrder(order);
    assert.strictEqual(getOrders().length, 1);

    clearOrders();
    assert.deepStrictEqual(getOrders(), []);
    assert.strictEqual(storage[ORDERS_STORAGE_KEY], undefined);
  });

  it('buildWhatsAppMessage() and getWhatsAppURL() should produce a valid WhatsApp URL', () => {
    const order = createOrder(sampleCart, sampleCustomer);
    const msg = buildWhatsAppMessage(order);
    assert.strictEqual(typeof msg, 'string');
    assert.ok(msg.length > 0);

    const url = getWhatsAppURL(order);
    assert.ok(url.startsWith('https://wa.me/'));
    assert.ok(url.includes('text='));
    // Decode message to verify key fields are present
    const decoded = decodeURIComponent(url);
    assert.ok(decoded.includes(order.orderId));
    assert.ok(decoded.includes('Rohan Gupta'));
    assert.ok(decoded.includes('Oxford Shirt'));
    assert.ok(decoded.includes('DEMO'));
  });
});
