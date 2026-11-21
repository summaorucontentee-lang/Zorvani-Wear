// Zorvani Wear (DEMO) - Product Detail Controller
import { products } from '../data/products.js';
import { formatPrice } from './config.js';
import { addToCart } from './cart.js';
import { trackViewItem, trackAddToCart } from './dataLayer.js';
import { initHeader, updateCartCount } from './header.js';

initHeader();

// State
let currentProduct = null;
let currentImageIndex = 0;
let selectedSize = '';
let selectedColor = '';
let quantity = 1;

// Elements
const galleryMainImg = document.getElementById('gallery-main-img');
const galleryThumbs = document.getElementById('gallery-thumbnails');
const productNameEl = document.getElementById('product-name');
const productCategoryEl = document.getElementById('product-category');
const productPriceEl = document.getElementById('product-price');
const productMrpEl = document.getElementById('product-mrp');
const sizeSelectorEl = document.getElementById('size-selector');
const colorSelectorEl = document.getElementById('color-selector');
const qtyInputEl = document.getElementById('qty-input');
const qtyMinusBtn = document.getElementById('qty-minus');
const qtyPlusBtn = document.getElementById('qty-plus');
const addToCartBtn = document.getElementById('add-to-cart-btn');
const sizeErrorEl = document.getElementById('size-error');
const cartFeedbackEl = document.getElementById('cart-feedback');
const productDescEl = document.getElementById('product-description');
const productMaterialEl = document.getElementById('product-material');
const productCareEl = document.getElementById('product-care');
const sizeGuideContainer = document.getElementById('size-guide-container');
const relatedProductsGrid = document.getElementById('related-products-grid');

// ─── Find Product by Slug ───────────────────────────────────────────
function getProductFromURL() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');
  if (slug) {
    const found = products.find(p => p.slug === slug);
    if (found) return found;
  }
  // Fallback to first product if slug not found
  return products[0];
}

// ─── Render Product ─────────────────────────────────────────────────
function renderProduct(product) {
  currentProduct = product;
  selectedColor = product.colors && product.colors.length > 0 ? product.colors[0] : '';
  currentImageIndex = 0;
  selectedSize = '';
  quantity = 1;

  // Title & Metadata
  document.title = `${product.name} | Zorvani Wear (DEMO)`;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute('content', `${product.name} - ${product.description}`);
  }

  // Basic Info
  if (productNameEl) productNameEl.textContent = product.name;
  if (productCategoryEl) {
    productCategoryEl.textContent = product.category;
    productCategoryEl.href = `/shop.html?category=${product.category.toLowerCase()}`;
  }
  if (productPriceEl) productPriceEl.textContent = formatPrice(product.price);
  if (productMrpEl) {
    if (product.mrp) {
      productMrpEl.textContent = formatPrice(product.mrp);
      productMrpEl.style.display = 'inline';
    } else {
      productMrpEl.style.display = 'none';
    }
  }

  // Description & Details
  if (productDescEl) productDescEl.textContent = product.description;
  if (productMaterialEl) productMaterialEl.textContent = product.material;
  if (productCareEl) productCareEl.textContent = product.care;

  // Gallery
  renderGallery();

  // Size Selector Pills
  renderSizes();

  // Color Selector Pills
  renderColors();

  // Size Guide Table
  renderSizeGuide();

  // "You May Also Like" (4 items from same category, excluding current)
  renderRelatedProducts();

  // Track view_item
  trackViewItem(product);
}

// ─── Gallery ────────────────────────────────────────────────────────
function renderGallery() {
  if (!galleryMainImg || !currentProduct.images || currentProduct.images.length === 0) return;

  const updateMain = (index) => {
    currentImageIndex = index;
    galleryMainImg.src = currentProduct.images[index];
    galleryMainImg.alt = `${currentProduct.name} - View ${index + 1}`;

    // Highlight thumbnail
    if (galleryThumbs) {
      const thumbs = galleryThumbs.querySelectorAll('.gallery-thumb');
      thumbs.forEach((thumb, i) => {
        if (i === index) {
          thumb.classList.add('active');
          thumb.setAttribute('aria-current', 'true');
        } else {
          thumb.classList.remove('active');
          thumb.removeAttribute('aria-current');
        }
      });
    }
  };

  // Render thumbnails
  if (galleryThumbs) {
    galleryThumbs.innerHTML = currentProduct.images.map((imgSrc, i) => `
      <button type="button" class="gallery-thumb ${i === 0 ? 'active' : ''}" data-index="${i}" aria-label="View image ${i + 1}">
        <img src="${imgSrc}" alt="${currentProduct.name} thumbnail ${i + 1}" width="80" height="80">
      </button>
    `).join('');

    galleryThumbs.querySelectorAll('.gallery-thumb').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.currentTarget.getAttribute('data-index'), 10);
        updateMain(index);
      });
    });
  }

  updateMain(0);

  // Arrow key navigation for gallery
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      const next = (currentImageIndex + 1) % currentProduct.images.length;
      updateMain(next);
    } else if (e.key === 'ArrowLeft') {
      const prev = (currentImageIndex - 1 + currentProduct.images.length) % currentProduct.images.length;
      updateMain(prev);
    }
  });
}

// ─── Size Selector ──────────────────────────────────────────────────
function renderSizes() {
  if (!sizeSelectorEl) return;

  sizeSelectorEl.innerHTML = currentProduct.sizes.map(size => `
    <button type="button" class="size-pill" data-size="${size}" aria-label="Size ${size}">
      ${size}
    </button>
  `).join('');

  sizeSelectorEl.querySelectorAll('.size-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      sizeSelectorEl.querySelectorAll('.size-pill').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedSize = btn.getAttribute('data-size');
      if (sizeErrorEl) sizeErrorEl.style.display = 'none';
    });
  });
}

// ─── Color Selector ─────────────────────────────────────────────────
function renderColors() {
  if (!colorSelectorEl) return;

  colorSelectorEl.innerHTML = currentProduct.colors.map((color, i) => `
    <button type="button" class="color-pill ${i === 0 ? 'selected' : ''}" data-color="${color}" aria-label="Color ${color}">
      ${color}
    </button>
  `).join('');

  colorSelectorEl.querySelectorAll('.color-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      colorSelectorEl.querySelectorAll('.color-pill').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedColor = btn.getAttribute('data-color');
    });
  });
}

// ─── Size Guide Table ───────────────────────────────────────────────
function renderSizeGuide() {
  if (!sizeGuideContainer) return;

  const cat = currentProduct.category.toLowerCase();
  let tableHtml = '';

  if (cat === 'shirts') {
    tableHtml = `
      <table class="size-table" aria-label="Shirt Size Guide">
        <thead>
          <tr><th>Size</th><th>Chest (in)</th><th>Length (in)</th><th>Shoulder (in)</th></tr>
        </thead>
        <tbody>
          <tr><td>S</td><td>38</td><td>27.5</td><td>17.5</td></tr>
          <tr><td>M</td><td>40</td><td>28.5</td><td>18.0</td></tr>
          <tr><td>L</td><td>42</td><td>29.5</td><td>18.5</td></tr>
          <tr><td>XL</td><td>44</td><td>30.5</td><td>19.0</td></tr>
          <tr><td>XXL</td><td>46</td><td>31.5</td><td>19.5</td></tr>
        </tbody>
      </table>
    `;
  } else if (cat === 'pants') {
    tableHtml = `
      <table class="size-table" aria-label="Pants Size Guide">
        <thead>
          <tr><th>Size</th><th>Waist (in)</th><th>Inseam (in)</th><th>Hip (in)</th></tr>
        </thead>
        <tbody>
          <tr><td>28</td><td>28</td><td>30</td><td>36</td></tr>
          <tr><td>30</td><td>30</td><td>31</td><td>38</td></tr>
          <tr><td>32</td><td>32</td><td>32</td><td>40</td></tr>
          <tr><td>34</td><td>34</td><td>32</td><td>42</td></tr>
          <tr><td>36</td><td>36</td><td>33</td><td>44</td></tr>
          <tr><td>38</td><td>38</td><td>33</td><td>46</td></tr>
          <tr><td>40</td><td>40</td><td>34</td><td>48</td></tr>
        </tbody>
      </table>
    `;
  } else {
    tableHtml = `
      <table class="size-table" aria-label="Shoe Size Guide">
        <thead>
          <tr><th>UK Size</th><th>EU Size</th><th>US Size</th><th>Foot Length (cm)</th></tr>
        </thead>
        <tbody>
          <tr><td>UK6</td><td>40</td><td>7</td><td>25.4</td></tr>
          <tr><td>UK7</td><td>41</td><td>8</td><td>26.2</td></tr>
          <tr><td>UK8</td><td>42</td><td>9</td><td>27.1</td></tr>
          <tr><td>UK9</td><td>43</td><td>10</td><td>27.9</td></tr>
          <tr><td>UK10</td><td>44</td><td>11</td><td>28.8</td></tr>
          <tr><td>UK11</td><td>45</td><td>12</td><td>29.6</td></tr>
        </tbody>
      </table>
    `;
  }

  sizeGuideContainer.innerHTML = tableHtml;
}

// ─── "You May Also Like" ────────────────────────────────────────────
function renderRelatedProducts() {
  if (!relatedProductsGrid) return;

  const sameCategory = products
    .filter(p => p.category === currentProduct.category && p.id !== currentProduct.id)
    .slice(0, 4);

  relatedProductsGrid.innerHTML = sameCategory.map(p => {
    const mrpHtml = p.mrp ? `<span class="price-mrp">${formatPrice(p.mrp)}</span>` : '';
    return `
      <a href="/product.html?slug=${p.slug}" class="product-card" aria-label="${p.name}">
        <div class="product-card-image">
          <img src="${p.images[0]}" alt="${p.name}" width="300" height="300" loading="lazy">
        </div>
        <div class="product-card-info">
          <span class="product-card-category">${p.category}</span>
          <h3 class="product-card-name">${p.name}</h3>
          <div class="product-card-price">
            <span class="price-current">${formatPrice(p.price)}</span>
            ${mrpHtml}
          </div>
        </div>
      </a>
    `;
  }).join('');
}

// ─── Quantity Controls ──────────────────────────────────────────────
if (qtyMinusBtn && qtyInputEl) {
  qtyMinusBtn.addEventListener('click', () => {
    const val = parseInt(qtyInputEl.value, 10) || 1;
    if (val > 1) {
      qtyInputEl.value = val - 1;
      quantity = val - 1;
    }
  });
}

if (qtyPlusBtn && qtyInputEl) {
  qtyPlusBtn.addEventListener('click', () => {
    const val = parseInt(qtyInputEl.value, 10) || 1;
    if (val < 10) {
      qtyInputEl.value = val + 1;
      quantity = val + 1;
    }
  });
}

if (qtyInputEl) {
  qtyInputEl.addEventListener('change', () => {
    let val = parseInt(qtyInputEl.value, 10) || 1;
    val = Math.max(1, Math.min(10, val));
    qtyInputEl.value = val;
    quantity = val;
  });
}

// ─── Add to Cart ────────────────────────────────────────────────────
if (addToCartBtn) {
  addToCartBtn.addEventListener('click', () => {
    if (!selectedSize) {
      if (sizeErrorEl) {
        sizeErrorEl.style.display = 'block';
        sizeErrorEl.textContent = 'Please select a size before adding to cart.';
      }
      return;
    }

    if (sizeErrorEl) sizeErrorEl.style.display = 'none';

    try {
      addToCart(currentProduct, selectedSize, selectedColor, quantity);
      updateCartCount();

      // Show temporary success feedback
      if (cartFeedbackEl) {
        cartFeedbackEl.style.display = 'block';
        cartFeedbackEl.textContent = `Added ${quantity}x "${currentProduct.name}" (${selectedSize}) to cart!`;
        setTimeout(() => {
          cartFeedbackEl.style.display = 'none';
        }, 4000);
      }

      // Track add_to_cart
      trackAddToCart(currentProduct, selectedSize, selectedColor, quantity);
    } catch (err) {
      if (sizeErrorEl) {
        sizeErrorEl.style.display = 'block';
        sizeErrorEl.textContent = err.message;
      }
    }
  });
}

// Initialize on page load
const prod = getProductFromURL();
renderProduct(prod);
