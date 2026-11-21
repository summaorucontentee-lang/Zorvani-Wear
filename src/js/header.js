// Zorvani Wear (DEMO) - Header & Footer Module
// Renders shared header and footer across all pages.

import { STORE_NAME } from './config.js';
import { getCartTotal } from './cart.js';

/**
 * Render the site header with demo banner, navigation, and cart icon.
 * @param {string} activePage - current page identifier (home, shop, about, contact, cart, checkout)
 */
export function renderHeader(activePage = '') {
  const headerContainer = document.getElementById('site-header');
  if (!headerContainer) return;

  const { itemCount } = getCartTotal();
  const active = activePage.toLowerCase();

  headerContainer.innerHTML = `
    <a href="#main-content" class="skip-to-content">Skip to content</a>
    <div class="demo-banner">
      DEMO STORE: no real products, no real payments
    </div>
    <header class="header">
      <div class="header-inner container">
        <a href="/" class="logo" aria-label="${STORE_NAME} - Home">
          <span class="logo-text">Zorvani</span>
          <span class="logo-accent">Wear</span>
        </a>
        <button class="nav-toggle" aria-label="Toggle navigation" aria-expanded="false">
          <span class="hamburger"></span>
        </button>
        <nav class="nav" aria-label="Main navigation">
          <ul class="nav-list">
            <li><a href="/" class="${active === 'home' ? 'active' : ''}">Home</a></li>
            <li><a href="/shop.html" class="${active === 'shop' ? 'active' : ''}">Shop</a></li>
            <li><a href="/shop.html?category=shirts" class="${active === 'shirts' ? 'active' : ''}">Shirts</a></li>
            <li><a href="/shop.html?category=pants" class="${active === 'pants' ? 'active' : ''}">Pants</a></li>
            <li><a href="/shop.html?category=shoes" class="${active === 'shoes' ? 'active' : ''}">Shoes</a></li>
            <li><a href="/about.html" class="${active === 'about' ? 'active' : ''}">About</a></li>
            <li><a href="/contact.html" class="${active === 'contact' ? 'active' : ''}">Contact</a></li>
          </ul>
        </nav>
        <a href="/cart.html" class="cart-link" aria-label="Shopping cart, ${itemCount} items">
          <svg class="cart-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="m1 1 4 0 2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <span class="cart-count" id="cart-count" ${itemCount === 0 ? 'style="display:none"' : ''}>${itemCount}</span>
        </a>
      </div>
    </header>
  `;

  // Mobile nav toggle
  const toggle = headerContainer.querySelector('.nav-toggle');
  const nav = headerContainer.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', !expanded);
      nav.classList.toggle('nav-open');
    });
  }
}

/**
 * Render the site footer with links and copyright.
 */
export function renderFooter() {
  const footerContainer = document.getElementById('site-footer');
  if (!footerContainer) return;

  const year = new Date().getFullYear();

  footerContainer.innerHTML = `
    <footer class="footer">
      <div class="container footer-grid">
        <div class="footer-section">
          <h3 class="footer-heading">
            <span class="logo-text">Zorvani</span>
            <span class="logo-accent">Wear</span>
          </h3>
          <p class="footer-desc">A demo fashion e-commerce site. All products, prices, and data are entirely fictional.</p>
        </div>
        <div class="footer-section">
          <h3 class="footer-heading">Shop</h3>
          <ul class="footer-links">
            <li><a href="/shop.html?category=shirts">Shirts</a></li>
            <li><a href="/shop.html?category=pants">Pants</a></li>
            <li><a href="/shop.html?category=shoes">Shoes</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h3 class="footer-heading">Company</h3>
          <ul class="footer-links">
            <li><a href="/about.html">About Us</a></li>
            <li><a href="/contact.html">Contact</a></li>
            <li><a href="/shipping.html">Shipping</a></li>
            <li><a href="/returns.html">Returns</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h3 class="footer-heading">Legal</h3>
          <ul class="footer-links">
            <li><a href="/privacy.html">Privacy Policy</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom container">
        <p>&copy; ${year} ${STORE_NAME}. This is a demo site. No real transactions.</p>
      </div>
    </footer>
  `;
}

/**
 * Initialize header interactions (nav toggle, cart count) for static or dynamic headers.
 */
export function initHeader() {
  updateCartCount();
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  if (toggle && nav && !toggle.dataset.initialized) {
    toggle.dataset.initialized = 'true';
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', !expanded);
      nav.classList.toggle('nav-open');
    });
  }
}
export function updateCartCount() {
  const badge = document.getElementById('cart-count');
  if (!badge) return;

  const { itemCount } = getCartTotal();
  badge.textContent = itemCount;
  badge.style.display = itemCount > 0 ? '' : 'none';

  // Update aria-label on cart link
  const cartLink = badge.closest('.cart-link');
  if (cartLink) {
    cartLink.setAttribute('aria-label', `Shopping cart, ${itemCount} items`);
  }
}

// Sync cart count across tabs via storage events
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'zorvani_cart') {
      updateCartCount();
    }
  });
}
