// Zorvani Wear (DEMO) - Cart Module
// Uses localStorage. All data is fictional.

export const CART_STORAGE_KEY = 'zorvani_cart';

/**
 * Load cart from localStorage.
 * @returns {Array} cart items
 */
export function loadCart() {
  try {
    const data = localStorage.getItem(CART_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * Save cart to localStorage.
 * @param {Array} cart
 */
export function saveCart(cart) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (e) {
    console.error('Failed to save cart:', e);
  }
}

/**
 * Get current cart items.
 * @returns {Array} cart items
 */
export function getCart() {
  return loadCart();
}

/**
 * Add a product to the cart. Size is required.
 * @param {Object} product - product object with id, slug, name, price, images
 * @param {string} size - selected size (required)
 * @param {string} color - selected color
 * @param {number} quantity - quantity to add (default 1)
 * @returns {Array} updated cart
 */
export function addToCart(product, size, color, quantity = 1) {
  if (!size) {
    throw new Error('Size is required to add item to cart');
  }
  if (quantity < 1) {
    throw new Error('Quantity must be at least 1');
  }

  const cart = loadCart();

  // Check if same product with same size and color already exists
  const existingIndex = cart.findIndex(
    (item) =>
      item.productId === product.id &&
      item.size === size &&
      item.color === color
  );

  if (existingIndex >= 0) {
    cart[existingIndex].quantity += quantity;
  } else {
    cart.push({
      productId: product.id,
      productSlug: product.slug,
      name: product.name,
      price: product.price,
      size,
      color,
      quantity,
      image: product.images && product.images.length > 0 ? product.images[0] : '',
    });
  }

  saveCart(cart);
  return cart;
}

/**
 * Remove an item from the cart by index.
 * @param {number} itemIndex
 * @returns {Array} updated cart
 */
export function removeFromCart(itemIndex) {
  const cart = loadCart();
  if (itemIndex >= 0 && itemIndex < cart.length) {
    cart.splice(itemIndex, 1);
    saveCart(cart);
  }
  return cart;
}

/**
 * Update the quantity of a cart item.
 * @param {number} itemIndex
 * @param {number} newQty - minimum 1
 * @returns {Array} updated cart
 */
export function updateQuantity(itemIndex, newQty) {
  const cart = loadCart();
  if (itemIndex >= 0 && itemIndex < cart.length) {
    cart[itemIndex].quantity = Math.max(1, newQty);
    saveCart(cart);
  }
  return cart;
}

/**
 * Clear the entire cart.
 * @returns {Array} empty cart
 */
export function clearCart() {
  saveCart([]);
  return [];
}

/**
 * Get cart totals.
 * @returns {{ subtotal: number, itemCount: number }}
 */
export function getCartTotal() {
  const cart = loadCart();
  let subtotal = 0;
  let itemCount = 0;

  for (const item of cart) {
    subtotal += item.price * item.quantity;
    itemCount += item.quantity;
  }

  return { subtotal, itemCount };
}
