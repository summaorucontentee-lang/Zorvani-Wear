// Zorvani Wear (DEMO) - Data Layer Module
// Pushes e-commerce events to window.dataLayer for analytics.
// All data is fictional.

import { DEBUG, DATA_LAYER_DEBUG } from './config.js';

// Initialize dataLayer
if (typeof window !== 'undefined') {
  window.dataLayer = window.dataLayer || [];
}

function pushEvent(event) {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(event);
  }
  if (DEBUG && DATA_LAYER_DEBUG) {
    console.log('[DataLayer]', event.event, event);
  }
}

function mapItem(product, quantity = 1, size = '', color = '') {
  return {
    item_id: product.id || product.productId,
    item_name: product.name,
    price: product.price,
    quantity,
    item_category: product.category || '',
    currency: 'INR',
    ...(size && { item_variant_size: size }),
    ...(color && { item_variant_color: color }),
  };
}

/**
 * Track view of a product list / category page.
 * @param {Array} items - array of products
 * @param {string} category - category name
 */
export function trackViewItemList(items, category) {
  pushEvent({
    event: 'view_item_list',
    ecommerce: {
      currency: 'INR',
      item_list_name: category || 'All Products',
      items: items.map((item, index) => ({
        ...mapItem(item),
        index,
      })),
    },
  });
}

/**
 * Track view of a single product detail page.
 * @param {Object} product
 */
export function trackViewItem(product) {
  pushEvent({
    event: 'view_item',
    ecommerce: {
      currency: 'INR',
      value: product.price,
      items: [mapItem(product)],
    },
  });
}

/**
 * Track add to cart.
 * @param {Object} product
 * @param {string} size
 * @param {string} color
 * @param {number} quantity
 */
export function trackAddToCart(product, size, color, quantity) {
  pushEvent({
    event: 'add_to_cart',
    ecommerce: {
      currency: 'INR',
      value: product.price * quantity,
      items: [mapItem(product, quantity, size, color)],
    },
  });
}

/**
 * Track remove from cart.
 * @param {Object} product
 * @param {string} size
 * @param {string} color
 * @param {number} quantity
 */
export function trackRemoveFromCart(product, size, color, quantity) {
  pushEvent({
    event: 'remove_from_cart',
    ecommerce: {
      currency: 'INR',
      value: product.price * quantity,
      items: [mapItem(product, quantity, size, color)],
    },
  });
}

/**
 * Track view cart.
 * @param {Array} cart - array of cart items
 */
export function trackViewCart(cart) {
  let value = 0;
  const items = cart.map((item) => {
    value += item.price * item.quantity;
    return mapItem(item, item.quantity, item.size, item.color);
  });

  pushEvent({
    event: 'view_cart',
    ecommerce: {
      currency: 'INR',
      value,
      items,
    },
  });
}

/**
 * Track begin checkout.
 * @param {Array} cart - array of cart items
 */
export function trackBeginCheckout(cart) {
  let value = 0;
  const items = cart.map((item) => {
    value += item.price * item.quantity;
    return mapItem(item, item.quantity, item.size, item.color);
  });

  pushEvent({
    event: 'begin_checkout',
    ecommerce: {
      currency: 'INR',
      value,
      items,
    },
  });
}

/**
 * Track lead generation (contact form etc.).
 * @param {Object} orderData
 */
export function trackGenerateLead(orderData) {
  const items = (orderData.items || []).map((item) =>
    mapItem(item, item.quantity, item.size, item.color)
  );
  pushEvent({
    event: 'generate_lead',
    ecommerce: {
      currency: 'INR',
      value: orderData.total || 0,
      transaction_id: orderData.orderId || '',
      items,
    },
  });
}

/**
 * Track purchase (demo only).
 * @param {Object} orderData
 */
export function trackPurchase(orderData) {
  const items = (orderData.items || []).map((item) =>
    mapItem(item, item.quantity, item.size, item.color)
  );

  pushEvent({
    event: 'purchase',
    ecommerce: {
      currency: 'INR',
      transaction_id: orderData.orderId || '',
      value: orderData.total || 0,
      items,
      demo: true,
    },
  });
}
