// Zorvani Wear (DEMO) - Configuration
// All data is fictional. No real products, payments, or brands.

export const STORE_NAME = 'Zorvani Wear (DEMO)';
export const CURRENCY = 'INR';
export const WHATSAPP_NUMBER = '919876543210';
export const DEBUG = true;
export const PRODUCTS_PER_PAGE = 24;
export const IMAGES_PER_PRODUCT = 4;
export const DATA_LAYER_DEBUG = true;

const priceFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

/**
 * Format an amount in INR using Indian locale.
 * @param {number} amount
 * @returns {string}
 */
export function formatPrice(amount) {
  return priceFormatter.format(amount);
}
