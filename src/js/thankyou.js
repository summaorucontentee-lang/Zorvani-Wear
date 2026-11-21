// Zorvani Wear (DEMO) - Thank You Page Controller
import { getOrders } from './orders.js';
import { formatPrice } from './config.js';
import { trackPurchase } from './dataLayer.js';
import { initHeader } from './header.js';

initHeader();

const orderIdEl = document.getElementById('thankyou-order-id');
const orderDateEl = document.getElementById('thankyou-order-date');
const orderItemsEl = document.getElementById('thankyou-order-items');
const orderTotalEl = document.getElementById('thankyou-order-total');
const customerDetailsEl = document.getElementById('thankyou-customer-details');
const notFoundEl = document.getElementById('thankyou-not-found');
const successCardEl = document.getElementById('thankyou-success-card');

function initThankYouPage() {
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get('orderId');

  const orders = getOrders();
  let order = null;

  if (orderId) {
    order = orders.find(o => o.orderId === orderId);
  }

  // If no orderId in URL, show most recent order if available
  if (!order && orders.length > 0) {
    order = orders[orders.length - 1];
  }

  if (!order) {
    if (successCardEl) successCardEl.style.display = 'none';
    if (notFoundEl) notFoundEl.style.display = 'block';
    return;
  }

  if (notFoundEl) notFoundEl.style.display = 'none';
  if (successCardEl) successCardEl.style.display = 'block';

  if (orderIdEl) orderIdEl.textContent = order.orderId;
  if (orderDateEl) orderDateEl.textContent = new Date(order.date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  if (orderTotalEl) orderTotalEl.textContent = formatPrice(order.total);

  if (customerDetailsEl && order.customer) {
    customerDetailsEl.innerHTML = `
      <p><strong>Name:</strong> ${order.customer.name}</p>
      <p><strong>Phone:</strong> ${order.customer.phone}</p>
      <p><strong>Address:</strong> ${order.customer.address}, ${order.customer.city} - ${order.customer.pincode}</p>
    `;
  }

  if (orderItemsEl && order.items) {
    orderItemsEl.innerHTML = order.items.map(item => `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0; border-bottom: 1px solid var(--border);">
        <div style="display: flex; gap: 0.75rem; align-items: center;">
          ${item.image ? `<img src="${item.image}" alt="${item.name}" width="50" height="50" style="border-radius: var(--radius-sm); object-fit: cover;">` : ''}
          <div>
            <div style="font-weight: 700; color: var(--navy); font-size: 0.95rem;">${item.name}</div>
            <div style="font-size: 0.8rem; color: var(--text-light);">
              Size: ${item.size} • Color: ${item.color || 'Standard'} • Qty: ${item.quantity}
            </div>
          </div>
        </div>
        <div style="font-weight: 700; color: var(--navy); font-size: 1rem;">
          ${formatPrice(item.price * item.quantity)}
        </div>
      </div>
    `).join('');
  }

  // Track purchase event
  trackPurchase(order);
}

initThankYouPage();
