// Zorvani Wear (DEMO) - Cart Page Controller
import { getCart, updateQuantity, removeFromCart, getCartTotal, clearCart } from './cart.js';
import { formatPrice } from './config.js';
import { trackViewCart, trackRemoveFromCart } from './dataLayer.js';
import { initHeader, updateCartCount } from './header.js';

initHeader();

const cartItemsListEl = document.getElementById('cart-items-list');
const emptyCartEl = document.getElementById('empty-cart-state');
const cartContentEl = document.getElementById('cart-content');
const subtotalEl = document.getElementById('cart-subtotal');
const totalEl = document.getElementById('cart-total');
const itemCountEl = document.getElementById('cart-item-count');

function renderCart() {
  const cart = getCart();

  if (cart.length === 0) {
    if (cartContentEl) cartContentEl.style.display = 'none';
    if (emptyCartEl) emptyCartEl.style.display = 'block';
    updateCartCount();
    return;
  }

  if (emptyCartEl) emptyCartEl.style.display = 'none';
  if (cartContentEl) cartContentEl.style.display = 'grid';

  const { subtotal, itemCount } = getCartTotal();

  if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
  if (totalEl) totalEl.textContent = formatPrice(subtotal);
  if (itemCountEl) itemCountEl.textContent = `${itemCount} item${itemCount === 1 ? '' : 's'}`;

  if (cartItemsListEl) {
    cartItemsListEl.innerHTML = cart.map((item, index) => {
      const lineTotal = item.price * item.quantity;
      return `
        <article class="cart-item cart-item-card" data-index="${index}">
          <div class="cart-item-image">
            <img src="${item.image}" alt="${item.name}" width="80" height="80">
          </div>
          <div class="cart-item-details">
            <a href="/product.html?slug=${item.productSlug}" class="cart-item-name">${item.name}</a>
            <div class="cart-item-variant">Size: <strong>${item.size}</strong>${item.color ? ` • Color: <strong>${item.color}</strong>` : ''}</div>
            <div class="cart-item-price">${formatPrice(item.price)} each • Total: ${formatPrice(lineTotal)}</div>
            <div class="cart-item-actions">
              <div style="display: flex; align-items: center; gap: 0.25rem;">
                <button type="button" class="btn-outline qty-dec-btn" style="padding: 0.25rem 0.6rem;" data-index="${index}" aria-label="Decrease quantity for ${item.name}">-</button>
                <span style="min-width: 24px; text-align: center; font-weight: 700;">${item.quantity}</span>
                <button type="button" class="btn-outline qty-inc-btn" style="padding: 0.25rem 0.6rem;" data-index="${index}" aria-label="Increase quantity for ${item.name}">+</button>
              </div>
              <button type="button" class="cart-item-remove remove-item-btn" data-index="${index}" aria-label="Remove ${item.name} from cart">
                Remove
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Attach quantity increment listeners
    cartItemsListEl.querySelectorAll('.qty-inc-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.getAttribute('data-index'), 10);
        const currentQty = cart[idx].quantity;
        updateQuantity(idx, currentQty + 1);
        renderCart();
      });
    });

    // Attach quantity decrement listeners
    cartItemsListEl.querySelectorAll('.qty-dec-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.getAttribute('data-index'), 10);
        const currentQty = cart[idx].quantity;
        if (currentQty > 1) {
          updateQuantity(idx, currentQty - 1);
          renderCart();
        } else {
          // If decreasing from 1, remove item
          const item = cart[idx];
          removeFromCart(idx);
          trackRemoveFromCart(item, item.size, item.color, item.quantity);
          renderCart();
        }
      });
    });

    // Attach remove listeners
    cartItemsListEl.querySelectorAll('.remove-item-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.getAttribute('data-index'), 10);
        const item = cart[idx];
        removeFromCart(idx);
        trackRemoveFromCart(item, item.size, item.color, item.quantity);
        renderCart();
      });
    });
  }

  updateCartCount();
}

// Initial render
renderCart();

// Track view_cart
trackViewCart(getCart());
