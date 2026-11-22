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
  renderFloatingWhatsApp();
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

/**
 * Render floating WhatsApp chat/order button on every page.
 */
export function renderFloatingWhatsApp() {
  if (document.getElementById('whatsapp-float-btn')) return;
  const floatBtn = document.createElement('a');
  floatBtn.id = 'whatsapp-float-btn';
  floatBtn.className = 'whatsapp-float';
  floatBtn.href = 'https://wa.me/919876543210?text=Hello%20Zorvani%20Wear,%20I%20have%20an%20inquiry%20about%20your%20collection';
  floatBtn.target = '_blank';
  floatBtn.rel = 'noopener noreferrer';
  floatBtn.setAttribute('aria-label', 'Chat with Zorvani Wear on WhatsApp');
  floatBtn.innerHTML = `
    <svg class="whatsapp-icon" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
    </svg>
    <span class="whatsapp-text">Order on WhatsApp</span>
  `;
  document.body.appendChild(floatBtn);
}

// Sync cart count across tabs via storage events
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'zorvani_cart') {
      updateCartCount();
    }
  });
}
