// Zorvani Wear (DEMO) - Orders Module
// Demo order management. All data is fictional.

import { WHATSAPP_NUMBER, STORE_NAME } from './config.js';
import { formatPrice } from './config.js';

export const ORDERS_STORAGE_KEY = 'zorvani_orders';

/**
 * Generate a unique demo order ID.
 * @returns {string}
 */
export function generateOrderId() {
  const timestamp = Date.now().toString(36).toUpperCase();
  return `ZW-DEMO-${timestamp}`;
}

/**
 * Create an order object from cart and customer info.
 * @param {Array} cart - cart items
 * @param {Object} customerInfo - { name, phone, address, city, pincode }
 * @returns {Object} order object
 */
export function createOrder(cart, customerInfo) {
  let total = 0;
  const items = cart.map((item) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    return { ...item };
  });

  return {
    orderId: generateOrderId(),
    date: new Date().toISOString(),
    customer: { ...customerInfo },
    items,
    total,
    itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
    status: 'demo-placed',
    demo: true,
  };
}

/**
 * Save an order to localStorage.
 * @param {Object} order
 */
export function saveOrder(order) {
  try {
    const orders = getOrders();
    orders.push(order);
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error('Failed to save order:', e);
  }
}

/**
 * Get all saved orders.
 * @returns {Array}
 */
export function getOrders() {
  try {
    const data = localStorage.getItem(ORDERS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * Clear all order history.
 */
export function clearOrders() {
  try {
    localStorage.removeItem(ORDERS_STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear orders:', e);
  }
}

/**
 * Build an encoded WhatsApp message string for an order.
 * @param {Object} order
 * @returns {string} encoded message
 */
export function buildWhatsAppMessage(order) {
  let msg = `🛍️ *New Order - ${STORE_NAME}*\n`;
  msg += `📋 Order ID: ${order.orderId}\n`;
  msg += `📅 Date: ${new Date(order.date).toLocaleDateString('en-IN')}\n\n`;
  msg += `👤 *Customer Details*\n`;
  msg += `Name: ${order.customer.name}\n`;
  msg += `Phone: ${order.customer.phone}\n`;
  msg += `Address: ${order.customer.address}\n`;
  msg += `City: ${order.customer.city}\n`;
  msg += `Pincode: ${order.customer.pincode}\n\n`;
  msg += `📦 *Items*\n`;

  for (const item of order.items) {
    msg += `• ${item.name} (${item.size}`;
    if (item.color) msg += `, ${item.color}`;
    msg += `) x${item.quantity} - ${formatPrice(item.price * item.quantity)}\n`;
  }

  msg += `\n💰 *Total: ${formatPrice(order.total)}*\n`;
  msg += `\n⚠️ This is a DEMO order. No real transaction.`;

  return encodeURIComponent(msg);
}

/**
 * Get the full WhatsApp URL for an order.
 * @param {Object} order
 * @returns {string}
 */
export function getWhatsAppURL(order) {
  const message = buildWhatsAppMessage(order);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
}
