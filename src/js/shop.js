// Zorvani Wear (DEMO) - Shop Page Controller
import { products } from '../data/products.js';
import { formatPrice, PRODUCTS_PER_PAGE } from './config.js';
import { filterProducts, sortProducts, getUniqueColors, getUniqueSizes } from './filters.js';
import { trackViewItemList } from './dataLayer.js';
import { initHeader } from './header.js';

initHeader();

// State
let currentPage = 1;
const state = {
  category: '',
  sizes: [],
  colors: [],
  priceMin: null,
  priceMax: null,
  search: '',
  sort: 'newest',
};

// DOM elements
const productGrid = document.getElementById('product-grid');
const productCountEl = document.getElementById('product-count');
const loadMoreBtn = document.getElementById('load-more-btn');
const emptyStateEl = document.getElementById('empty-state');
const resetFiltersBtn = document.getElementById('reset-filters-btn');
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');
const categoryTitle = document.getElementById('category-title');
const sizeFilterContainer = document.getElementById('size-filter-options');
const colorFilterContainer = document.getElementById('color-filter-options');
const priceMinInput = document.getElementById('price-min');
const priceMaxInput = document.getElementById('price-max');

// Mobile filter toggle
const filterToggleBtn = document.getElementById('filter-toggle-btn');
const filterSidebar = document.querySelector('.filter-sidebar');
const filterCloseBtn = document.getElementById('filter-close-btn');

if (filterToggleBtn && filterSidebar) {
  filterToggleBtn.addEventListener('click', () => {
    filterSidebar.classList.add('filter-open');
  });
}
if (filterCloseBtn && filterSidebar) {
  filterCloseBtn.addEventListener('click', () => {
    filterSidebar.classList.remove('filter-open');
  });
}

// ─── Initialize Filters from URL ────────────────────────────────────
function parseURLParams() {
  const params = new URLSearchParams(window.location.search);
  const cat = params.get('category');
  if (cat && ['shirts', 'pants', 'shoes'].includes(cat.toLowerCase())) {
    state.category = cat.toLowerCase();
  }
  const q = params.get('q');
  if (q) {
    state.search = q;
    if (searchInput) searchInput.value = q;
  }
}

// ─── Build Filter Checkboxes ────────────────────────────────────────
function renderFilterOptions() {
  // Category radio / checkboxes
  const categoryRadios = document.querySelectorAll('input[name="category-filter"]');
  categoryRadios.forEach(radio => {
    if (state.category) {
      radio.checked = radio.value.toLowerCase() === state.category;
    } else {
      radio.checked = radio.value === '';
    }
  });

  // Unique sizes based on active category
  const activeProducts = state.category
    ? products.filter(p => p.category.toLowerCase() === state.category)
    : products;

  const sizes = getUniqueSizes(activeProducts);
  if (sizeFilterContainer) {
    sizeFilterContainer.innerHTML = sizes.map(sz => `
      <label class="filter-checkbox-label">
        <input type="checkbox" name="size-filter" value="${sz}" ${state.sizes.includes(sz) ? 'checked' : ''}>
        <span>${sz}</span>
      </label>
    `).join('');
  }

  // Unique colors
  const colors = getUniqueColors(products);
  if (colorFilterContainer) {
    colorFilterContainer.innerHTML = colors.map(col => `
      <label class="filter-checkbox-label">
        <input type="checkbox" name="color-filter" value="${col}" ${state.colors.includes(col) ? 'checked' : ''}>
        <span>${col}</span>
      </label>
    `).join('');
  }
}

// ─── Filter & Render ────────────────────────────────────────────────
function getFilteredAndSortedProducts() {
  const filtered = filterProducts(products, {
    category: state.category,
    sizes: state.sizes,
    colors: state.colors,
    priceMin: state.priceMin,
    priceMax: state.priceMax,
    search: state.search,
  });

  return sortProducts(filtered, state.sort);
}

function renderProducts() {
  const allMatching = getFilteredAndSortedProducts();
  const visibleCount = currentPage * PRODUCTS_PER_PAGE;
  const toDisplay = allMatching.slice(0, visibleCount);

  // Update counts and headers
  if (productCountEl) {
    productCountEl.textContent = `Showing ${toDisplay.length} of ${allMatching.length} products`;
  }

  if (categoryTitle) {
    if (state.category) {
      const catCapitalized = state.category.charAt(0).toUpperCase() + state.category.slice(1);
      categoryTitle.textContent = `${catCapitalized} Collection`;
      document.title = `${catCapitalized} | Zorvani Wear (DEMO)`;
    } else {
      categoryTitle.textContent = 'All Products';
      document.title = 'Shop All | Zorvani Wear (DEMO)';
    }
  }

  // Empty state handling
  if (allMatching.length === 0) {
    if (productGrid) productGrid.innerHTML = '';
    if (emptyStateEl) emptyStateEl.style.display = 'block';
    if (loadMoreBtn) loadMoreBtn.style.display = 'none';
    return;
  }

  if (emptyStateEl) emptyStateEl.style.display = 'none';

  // Render cards
  if (productGrid) {
    productGrid.innerHTML = toDisplay.map(p => {
      const mrpHtml = p.mrp ? `<span class="price-mrp">${formatPrice(p.mrp)}</span>` : '';
      return `
        <a href="/product.html?slug=${p.slug}" class="product-card" aria-label="${p.name}">
          <div class="product-card-image">
            <img src="${p.images[0]}" alt="${p.name}" width="400" height="400" loading="lazy">
          </div>
          <div class="product-card-info">
            <span class="product-card-category">${p.category}</span>
            <h2 class="product-card-name">${p.name}</h2>
            <div class="product-card-price">
              <span class="price-current">${formatPrice(p.price)}</span>
              ${mrpHtml}
            </div>
          </div>
        </a>
      `;
    }).join('');
  }

  // Load More button
  if (loadMoreBtn) {
    if (visibleCount < allMatching.length) {
      loadMoreBtn.style.display = 'inline-block';
      loadMoreBtn.textContent = `Load More (${allMatching.length - visibleCount} remaining)`;
    } else {
      loadMoreBtn.style.display = 'none';
    }
  }

  // DataLayer tracking
  trackViewItemList(toDisplay, state.category || 'All Products');
}

// ─── Event Listeners ────────────────────────────────────────────────

// Category filter
document.querySelectorAll('input[name="category-filter"]').forEach(radio => {
  radio.addEventListener('change', (e) => {
    state.category = e.target.value.toLowerCase();
    state.sizes = []; // reset sizes when category changes
    currentPage = 1;
    renderFilterOptions();
    attachCheckboxListeners();
    renderProducts();

    // Update URL query string without reloading
    const url = new URL(window.location);
    if (state.category) {
      url.searchParams.set('category', state.category);
    } else {
      url.searchParams.delete('category');
    }
    window.history.pushState({}, '', url);
  });
});

function attachCheckboxListeners() {
  // Size checkboxes
  if (sizeFilterContainer) {
    sizeFilterContainer.querySelectorAll('input[name="size-filter"]').forEach(cb => {
      cb.addEventListener('change', () => {
        state.sizes = Array.from(
          sizeFilterContainer.querySelectorAll('input[name="size-filter"]:checked')
        ).map(el => el.value);
        currentPage = 1;
        renderProducts();
      });
    });
  }

  // Color checkboxes
  if (colorFilterContainer) {
    colorFilterContainer.querySelectorAll('input[name="color-filter"]').forEach(cb => {
      cb.addEventListener('change', () => {
        state.colors = Array.from(
          colorFilterContainer.querySelectorAll('input[name="color-filter"]:checked')
        ).map(el => el.value);
        currentPage = 1;
        renderProducts();
      });
    });
  }
}

// Price range
if (priceMinInput) {
  priceMinInput.addEventListener('input', (e) => {
    state.priceMin = e.target.value ? Number(e.target.value) : null;
    currentPage = 1;
    renderProducts();
  });
}

if (priceMaxInput) {
  priceMaxInput.addEventListener('input', (e) => {
    state.priceMax = e.target.value ? Number(e.target.value) : null;
    currentPage = 1;
    renderProducts();
  });
}

// Search input (debounced)
let searchTimeout;
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      state.search = e.target.value.trim();
      currentPage = 1;
      renderProducts();
    }, 250);
  });
}

// Sort dropdown
if (sortSelect) {
  sortSelect.addEventListener('change', (e) => {
    state.sort = e.target.value;
    renderProducts();
  });
}

// Load more button
if (loadMoreBtn) {
  loadMoreBtn.addEventListener('click', () => {
    currentPage++;
    renderProducts();
  });
}

// Reset filters button
if (resetFiltersBtn) {
  resetFiltersBtn.addEventListener('click', () => {
    state.category = '';
    state.sizes = [];
    state.colors = [];
    state.priceMin = null;
    state.priceMax = null;
    state.search = '';
    state.sort = 'newest';
    currentPage = 1;

    if (searchInput) searchInput.value = '';
    if (priceMinInput) priceMinInput.value = '';
    if (priceMaxInput) priceMaxInput.value = '';
    if (sortSelect) sortSelect.value = 'newest';

    const url = new URL(window.location);
    url.searchParams.delete('category');
    url.searchParams.delete('q');
    window.history.pushState({}, '', url);

    renderFilterOptions();
    attachCheckboxListeners();
    renderProducts();
  });
}

// Initial Run
parseURLParams();
renderFilterOptions();
attachCheckboxListeners();
renderProducts();
