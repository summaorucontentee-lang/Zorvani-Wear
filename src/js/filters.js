// Zorvani Wear (DEMO) - Filters Module
// Filtering, sorting, and search for products.

/**
 * Filter products by multiple criteria.
 * @param {Array} products
 * @param {Object} filters - { category, sizes, colors, priceMin, priceMax, search }
 * @returns {Array} filtered products
 */
export function filterProducts(products, filters = {}) {
  let result = [...products];

  if (filters.category) {
    const cat = filters.category.toLowerCase();
    result = result.filter(
      (p) => p.category.toLowerCase() === cat
    );
  }

  if (filters.sizes && filters.sizes.length > 0) {
    result = result.filter((p) =>
      p.sizes.some((s) => filters.sizes.includes(s))
    );
  }

  if (filters.colors && filters.colors.length > 0) {
    const lowerColors = filters.colors.map((c) => c.toLowerCase());
    result = result.filter((p) =>
      p.colors.some((c) => lowerColors.includes(c.toLowerCase()))
    );
  }

  if (filters.priceMin != null) {
    result = result.filter((p) => p.price >= filters.priceMin);
  }

  if (filters.priceMax != null) {
    result = result.filter((p) => p.price <= filters.priceMax);
  }

  if (filters.search) {
    result = searchProducts(result, filters.search);
  }

  return result;
}

/**
 * Sort products by criteria.
 * @param {Array} products
 * @param {string} sortBy - 'price-asc' | 'price-desc' | 'newest'
 * @returns {Array} sorted products (new array)
 */
export function sortProducts(products, sortBy) {
  const sorted = [...products];

  switch (sortBy) {
    case 'price-asc':
      sorted.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      sorted.sort((a, b) => b.price - a.price);
      break;
    case 'newest':
      // Products are assumed to be in newest-first order by default (higher id = newer)
      sorted.sort((a, b) => {
        const idA = typeof a.id === 'number' ? a.id : parseInt(a.id, 10) || 0;
        const idB = typeof b.id === 'number' ? b.id : parseInt(b.id, 10) || 0;
        return idB - idA;
      });
      break;
    default:
      break;
  }

  return sorted;
}

/**
 * Get unique colors from a product list.
 * @param {Array} products
 * @returns {Array<string>}
 */
export function getUniqueColors(products) {
  const colorSet = new Set();
  for (const p of products) {
    if (p.colors) {
      for (const c of p.colors) {
        colorSet.add(c);
      }
    }
  }
  return Array.from(colorSet).sort();
}

/**
 * Get unique sizes from a product list, optionally filtered by category.
 * @param {Array} products
 * @param {string} [category]
 * @returns {Array<string>}
 */
export function getUniqueSizes(products, category) {
  let filtered = products;
  if (category) {
    const cat = category.toLowerCase();
    filtered = products.filter((p) => p.category.toLowerCase() === cat);
  }

  const sizeSet = new Set();
  for (const p of filtered) {
    if (p.sizes) {
      for (const s of p.sizes) {
        sizeSet.add(s);
      }
    }
  }

  // Sort sizes logically
  const sizes = Array.from(sizeSet);
  const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', '38', '40', 'UK6', 'UK7', 'UK8', 'UK9', 'UK10', 'UK11'];
  sizes.sort((a, b) => {
    const ia = sizeOrder.indexOf(a);
    const ib = sizeOrder.indexOf(b);
    if (ia >= 0 && ib >= 0) return ia - ib;
    if (ia >= 0) return -1;
    if (ib >= 0) return 1;
    return a.localeCompare(b);
  });

  return sizes;
}

/**
 * Search products by name (case-insensitive, partial match).
 * @param {Array} products
 * @param {string} query
 * @returns {Array}
 */
export function searchProducts(products, query) {
  if (!query || !query.trim()) return [...products];
  const lowerQuery = query.trim().toLowerCase();
  return products.filter((p) =>
    p.name.toLowerCase().includes(lowerQuery)
  );
}
