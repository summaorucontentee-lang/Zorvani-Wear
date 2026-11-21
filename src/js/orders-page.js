// Zorvani Wear (DEMO) - Order History Controller
import { getOrders, clearOrders } from './orders.js';
import { formatPrice } from './config.js';
import { initHeader } from './header.js';

initHeader();

const ordersListEl = document.getElementById('orders-list');
const emptyOrdersEl = document.getElementById('empty-orders-state');
const clearOrdersBtn = document.getElementById('clear-orders-btn');

function renderOrders() {
  const orders = getOrders();

  if (!orders || orders.length === 0) {
    if (ordersListEl) {
      ordersListEl.style.display = 'none';
      ordersListEl.innerHTML = '';
    }
    if (emptyOrdersEl) emptyOrdersEl.style.display = 'block';
    if (clearOrdersBtn) clearOrdersBtn.style.display = 'none';
    return;
  }

  if (emptyOrdersEl) emptyOrdersEl.style.display = 'none';
  if (ordersListEl) ordersListEl.style.display = 'flex';
  if (clearOrdersBtn) clearOrdersBtn.style.display = 'inline-block';

  // Render orders newest first
  const reversedOrders = [...orders].reverse();

  ordersListEl.innerHTML = reversedOrders.map(order => {
    const formattedDate = new Date(order.date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const itemsHtml = (order.items || []).map(item => `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; font-size: 0.9rem;">
        <div>
          <span style="font-weight: 600; color: var(--navy);">${item.name}</span>
          <span style="color: var(--text-light); font-size: 0.8rem;"> (${item.size}${item.color ? `, ${item.color}` : ''}) × ${item.quantity}</span>
        </div>
        <div style="font-weight: 700; color: var(--navy);">
          ${formatPrice(item.price * item.quantity)}
        </div>
      </div>
    `).join('');

    return `
      <article class="order-card" style="background: var(--light-gray); border: 1px solid var(--border); border-radius: var(--radius); padding: 1.5rem; margin-bottom: 1.5rem;" aria-label="Demo Order ${order.orderId}">
        <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--border);">
          <div>
            <span style="font-size: 0.8rem; color: var(--text-light); display: block;">Demo Order ID</span>
            <strong style="color: var(--navy); font-size: 1.15rem;">${order.orderId}</strong>
          </div>
          <div style="text-align: right;">
            <span style="font-size: 0.8rem; color: var(--text-light); display: block;">Placed on</span>
            <span style="font-size: 0.9rem; color: var(--text);">${formattedDate}</span>
          </div>
        </div>

        <div style="margin-bottom: 1rem;">
          ${itemsHtml}
        </div>

        <div style="display: flex; justify-content: space-between; align-items: baseline; padding-top: 0.75rem; border-top: 1px solid var(--border); font-size: 1.15rem; font-weight: 800; color: var(--navy);">
          <span>Total:</span>
          <span>${formatPrice(order.total)}</span>
        </div>
      </article>
    `;
  }).join('');
}

if (clearOrdersBtn) {
  clearOrdersBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear your demo order history?')) {
      clearOrders();
      renderOrders();
    }
  });
}

renderOrders();
