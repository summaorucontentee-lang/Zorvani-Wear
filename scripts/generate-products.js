// Zorvani Wear (DEMO) - Product Data Generator
// Generates 60+ deterministic demo products with top brand names across 3 categories.
// Run: node scripts/generate-products.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const IMAGES_PER_PRODUCT = 4;
const VIEWS = ['front', 'back', 'detail', 'side'];

// ─── Deterministic helpers ───────────────────────────────────────────
function seededPick(arr, seed) {
  return arr[seed % arr.length];
}

function seededBool(seed, threshold = 60) {
  // Returns true ~threshold% of the time based on seed
  return ((seed * 7 + 13) % 100) < threshold;
}

function seededRange(min, max, seed) {
  return min + (seed % (max - min + 1));
}

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// ─── Data definitions ────────────────────────────────────────────────

const SHIRT_BRANDS = [
  'Zara', 'Ralph Lauren', 'Tommy Hilfiger', 'Calvin Klein',
  'Allen Solly', 'Van Heusen', 'Peter England', 'Louis Philippe',
  'Arrow', 'Raymond', 'Lacoste', 'H&M',
];

const SHIRT_STYLES = [
  'Classic Oxford', 'Slim Fit Poplin', 'Casual Linen', 'Mandarin Collar',
  'Relaxed Flannel', 'Stripe Formal', 'Check Casual', 'Colour Block Sport',
  'Denim Chambray', 'Henley Knit', 'Camp Collar Resort',
];

const SHIRT_COLORS = [
  'White', 'Sky Blue', 'Navy', 'Sage Green', 'Blush Pink',
  'Charcoal', 'Lavender', 'Mustard', 'Ivory', 'Burgundy',
  'Olive', 'Coral',
];

const PANT_BRANDS = [
  "Levi's", 'Zara', 'Wrangler', 'Lee',
  'Dockers', 'Pepe Jeans', 'Jack & Jones', 'Flying Machine',
  'Tommy Hilfiger', 'Calvin Klein', 'Diesel', 'U.S. Polo Assn.',
];

const PANT_STYLES = [
  'Slim Chinos', 'Relaxed Joggers', 'Straight Fit Trousers', 'Cargo Pants',
  'Tailored Formal', 'Colour Block Track', 'Stripe Lounge', 'Pleated Wide Leg',
  'Linen Drawstring', 'Denim Slim', 'Check Wool Blend',
];

const PANT_COLORS = [
  'Khaki', 'Black', 'Navy', 'Olive', 'Charcoal',
  'Beige', 'Stone', 'Dark Wash', 'Light Wash', 'Burgundy',
  'Forest Green', 'Slate Blue',
];

const SHOE_BRANDS = [
  'Nike', 'Adidas', 'Puma', 'Reebok',
  'Vans', 'Converse', 'Skechers', 'Woodland',
  'Clarks', 'New Balance', 'Asics', 'Timberland',
];

const SHOE_STYLES = [
  'Canvas Sneakers', 'Leather Derby', 'Suede Loafers', 'Running Trainers',
  'Colour Block High Tops', 'Brogue Oxfords', 'Slip-On Mules', 'Chelsea Boots',
  'Stripe Espadrilles', 'Knit Sport', 'Monk Strap Formal',
];

const SHOE_COLORS = [
  'White', 'Black', 'Tan', 'Navy', 'Burgundy',
  'Grey', 'Olive', 'Camel', 'Sand', 'Rust',
  'Forest Green', 'Cognac',
];

const SHIRT_MATERIALS = ['100% Cotton', 'Cotton-Linen Blend', 'Pure Linen', 'Cotton Poplin', 'Brushed Flannel', 'Chambray Cotton', 'Pima Cotton'];
const PANT_MATERIALS = ['Cotton Twill', 'Stretch Cotton', 'Cotton-Linen Blend', 'French Terry', 'Wool Blend', 'Raw Denim', 'Linen'];
const SHOE_MATERIALS = ['Canvas Upper', 'Full-Grain Leather', 'Suede', 'Knit Mesh', 'Premium Leather', 'Vegan Leather', 'Woven Textile'];

const CARE_INSTRUCTIONS = [
  'Machine wash cold, tumble dry low',
  'Hand wash recommended, hang dry',
  'Machine wash gentle cycle, do not bleach',
  'Dry clean only',
  'Spot clean with damp cloth',
  'Machine wash cold, iron on low',
];

const SHIRT_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
const PANT_SIZES = ['28', '30', '32', '34', '36', '38', '40'];
const SHOE_SIZES = ['UK6', 'UK7', 'UK8', 'UK9', 'UK10', 'UK11'];

// ─── Product generator per category ─────────────────────────────────

function generateCategoryProducts(category, brands, styles, colors, sizes, materials, priceMin, priceMax, startId) {
  const products = [];
  const categorySlug = category.toLowerCase();

  // Generate at least 20 products per category
  let id = startId;
  let count = 0;
  const targetCount = 22; // slightly more than 20

  for (let si = 0; count < targetCount; si++) {
    const brand = brands[si % brands.length];
    const style = styles[si % styles.length];
    const colorIndex = Math.floor(si / styles.length) + si;
    const primaryColor = colors[colorIndex % colors.length];

    // Deterministic secondary colors
    const secondaryColor = colors[(colorIndex + 3) % colors.length];
    const tertiaryColor = colors[(colorIndex + 6) % colors.length];
    const productColors = [primaryColor, secondaryColor, tertiaryColor];

    const name = `${brand} ${style} - ${primaryColor}`;
    const slug = slugify(`${categorySlug}-${brand}-${style}-${primaryColor}`);

    // Deterministic price within range
    const priceRange = priceMax - priceMin;
    const priceSeed = (id * 31 + 17) % (priceRange + 1);
    const rawPrice = priceMin + priceSeed;
    const price = Math.round(rawPrice / 49) * 49 + 99; // Ends in 99 or similar

    // MRP for ~60% of products
    let mrp = null;
    if (seededBool(id, 60)) {
      const markup = 1.2 + ((id * 13 % 21) / 100); // 1.20 to 1.40
      mrp = Math.round((price * markup) / 99) * 99 + 99;
    }

    // Material
    const material = seededPick(materials, id);
    const care = seededPick(CARE_INSTRUCTIONS, id + 3);

    // Stock: ~90% in stock
    const stock = seededBool(id, 90);

    // Image paths
    const images = VIEWS.map((view) => `/images/${categorySlug}/${slug}-${view}.svg`);

    const description = `${name} from the Zorvani Wear demo collection. Made from ${material.toLowerCase()}. A premium ${style.toLowerCase()} design inspired by ${brand} in a vibrant ${primaryColor.toLowerCase()} tone. Perfect for modern wardrobes. This is a demo product — not for sale.`;

    products.push({
      id,
      slug,
      name,
      category,
      price,
      mrp,
      colors: productColors,
      sizes,
      description,
      material,
      care,
      stock,
      images,
    });

    id++;
    count++;
  }

  return products;
}

// ─── Main generation ─────────────────────────────────────────────────

function generateAllProducts() {
  const shirts = generateCategoryProducts(
    'Shirts', SHIRT_BRANDS, SHIRT_STYLES, SHIRT_COLORS, SHIRT_SIZES, SHIRT_MATERIALS,
    499, 2499, 1
  );

  const pants = generateCategoryProducts(
    'Pants', PANT_BRANDS, PANT_STYLES, PANT_COLORS, PANT_SIZES, PANT_MATERIALS,
    799, 3499, 100
  );

  const shoes = generateCategoryProducts(
    'Shoes', SHOE_BRANDS, SHOE_STYLES, SHOE_COLORS, SHOE_SIZES, SHOE_MATERIALS,
    999, 5999, 200
  );

  return [...shirts, ...pants, ...shoes];
}

// ─── Write output ────────────────────────────────────────────────────

const products = generateAllProducts();

console.log(`Generated ${products.length} products:`);
console.log(`  Shirts: ${products.filter(p => p.category === 'Shirts').length}`);
console.log(`  Pants:  ${products.filter(p => p.category === 'Pants').length}`);
console.log(`  Shoes:  ${products.filter(p => p.category === 'Shoes').length}`);

// Ensure output directory exists
const dataDir = path.join(ROOT, 'src', 'data');
fs.mkdirSync(dataDir, { recursive: true });

// Write ES module
const esModuleContent = `// Auto-generated by scripts/generate-products.js
// DO NOT EDIT — re-run the generator to update.
// ${products.length} demo products.

export const products = ${JSON.stringify(products, null, 2)};

export default products;
`;

fs.writeFileSync(path.join(dataDir, 'products.js'), esModuleContent, 'utf-8');
console.log(`Written: src/data/products.js`);

// Write JSON
fs.writeFileSync(path.join(dataDir, 'products.json'), JSON.stringify(products, null, 2), 'utf-8');
console.log(`Written: src/data/products.json`);

console.log('Product generation complete.');
