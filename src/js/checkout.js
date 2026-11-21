// Zorvani Wear (DEMO) - Checkout Controller
import { getCart, clearCart, getCartTotal } from './cart.js';
import { formatPrice } from './config.js';
import { createOrder, saveOrder, getWhatsAppURL } from './orders.js';
import { validateCheckoutForm, validateName, validatePhone, validatePincode, validateAddress, validateCity } from './validation.js';
import { trackBeginCheckout, trackGenerateLead } from './dataLayer.js';
import { initHeader, updateCartCount } from './header.js';

initHeader();

const form = document.getElementById('checkout-form');
const checkoutItemsEl = document.getElementById('checkout-items');
const checkoutTotalEl = document.getElementById('checkout-total');
const checkoutSubtotalEl = document.getElementById('checkout-subtotal');
const submitBtn = document.getElementById('place-order-btn');

// Input fields
const nameInput = document.getElementById('customer-name');
const phoneInput = document.getElementById('customer-phone');
const addressInput = document.getElementById('customer-address');
const cityInput = document.getElementById('customer-city');
const pincodeInput = document.getElementById('customer-pincode');

// Error fields
const nameError = document.getElementById('name-error');
const phoneError = document.getElementById('phone-error');
const addressError = document.getElementById('address-error');
const cityError = document.getElementById('city-error');
const pincodeError = document.getElementById('pincode-error');

function checkCart() {
  const cart = getCart();
  if (cart.length === 0) {
    // If cart is empty, show notification or redirect
    const container = document.getElementById('checkout-container');
    if (container) {
      container.innerHTML = `
        <div style="text-align: center; padding: 4rem 1rem;">
          <h2 style="font-size: 1.5rem; color: var(--navy); margin-bottom: 1rem;">Your Cart is Empty</h2>
          <p style="color: var(--text-light); margin-bottom: 1.5rem;">You need items in your cart to proceed with demo checkout.</p>
          <a href="/shop.html" class="btn-primary">Browse Shop</a>
        </div>
      `;
    }
    return false;
  }

  // Render items summary
  if (checkoutItemsEl) {
    checkoutItemsEl.innerHTML = cart.map(item => `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.6rem 0; border-bottom: 1px solid var(--border); font-size: 0.9rem;">
        <div>
          <strong style="color: var(--navy);">${item.name}</strong>
          <div style="font-size: 0.8rem; color: var(--text-light);">
            Size: ${item.size} • Qty: ${item.quantity}
          </div>
        </div>
        <div style="font-weight: 700; color: var(--navy);">
          ${formatPrice(item.price * item.quantity)}
        </div>
      </div>
    `).join('');
  }

  const { subtotal } = getCartTotal();
  if (checkoutSubtotalEl) checkoutSubtotalEl.textContent = formatPrice(subtotal);
  if (checkoutTotalEl) checkoutTotalEl.textContent = formatPrice(subtotal);

  // Track begin_checkout
  trackBeginCheckout(cart);
  return true;
}

// ─── Real-time field validation ─────────────────────────────────────
function setupFieldValidation() {
  if (nameInput && nameError) {
    nameInput.addEventListener('blur', () => {
      const res = validateName(nameInput.value);
      nameError.textContent = res.valid ? '' : res.error;
      nameError.style.display = res.valid ? 'none' : 'block';
    });
  }

  if (phoneInput && phoneError) {
    phoneInput.addEventListener('blur', () => {
      const res = validatePhone(phoneInput.value);
      phoneError.textContent = res.valid ? '' : res.error;
      phoneError.style.display = res.valid ? 'none' : 'block';
    });
  }

  if (addressInput && addressError) {
    addressInput.addEventListener('blur', () => {
      const res = validateAddress(addressInput.value);
      addressError.textContent = res.valid ? '' : res.error;
      addressError.style.display = res.valid ? 'none' : 'block';
    });
  }

  if (cityInput && cityError) {
    cityInput.addEventListener('blur', () => {
      const res = validateCity(cityInput.value);
      cityError.textContent = res.valid ? '' : res.error;
      cityError.style.display = res.valid ? 'none' : 'block';
    });
  }

  if (pincodeInput && pincodeError) {
    pincodeInput.addEventListener('blur', () => {
      const res = validatePincode(pincodeInput.value);
      pincodeError.textContent = res.valid ? '' : res.error;
      pincodeError.style.display = res.valid ? 'none' : 'block';
    });
  }
}

// ─── Form Submission ────────────────────────────────────────────────
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = {
      name: nameInput ? nameInput.value.trim() : '',
      phone: phoneInput ? phoneInput.value.trim() : '',
      address: addressInput ? addressInput.value.trim() : '',
      city: cityInput ? cityInput.value.trim() : '',
      pincode: pincodeInput ? pincodeInput.value.trim() : '',
    };

    const validation = validateCheckoutForm(formData);

    // Show errors
    if (!validation.valid) {
      if (nameError) {
        nameError.textContent = validation.errors.name || '';
        nameError.style.display = validation.errors.name ? 'block' : 'none';
      }
      if (phoneError) {
        phoneError.textContent = validation.errors.phone || '';
        phoneError.style.display = validation.errors.phone ? 'block' : 'none';
      }
      if (addressError) {
        addressError.textContent = validation.errors.address || '';
        addressError.style.display = validation.errors.address ? 'block' : 'none';
      }
      if (cityError) {
        cityError.textContent = validation.errors.city || '';
        cityError.style.display = validation.errors.city ? 'block' : 'none';
      }
      if (pincodeError) {
        pincodeError.textContent = validation.errors.pincode || '';
        pincodeError.style.display = validation.errors.pincode ? 'block' : 'none';
      }
      return;
    }

    // Form is valid!
    const cart = getCart();
    if (cart.length === 0) return;

    // 1. Create order
    const order = createOrder(cart, formData);

    // 2. Save order to localStorage
    saveOrder(order);

    // 3. Track lead generation
    trackGenerateLead(order);

    // 4. Build WhatsApp URL and open link
    const waURL = getWhatsAppURL(order);
    try {
      window.open(waURL, '_blank', 'noopener,noreferrer');
    } catch {
      // Ignored if popup blocked in test
    }

    // 5. Clear the cart
    clearCart();
    updateCartCount();

    // 6. Redirect to Thank You page with order ID
    window.location.href = `/thankyou.html?orderId=${order.orderId}`;
  });
}

checkCart();
setupFieldValidation();
