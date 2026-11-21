// Zorvani Wear (DEMO) - SVG Image Generator
// Generates original SVG product images for every product.
// Run: node scripts/generate-images.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const IMAGES_PER_PRODUCT = 4;
const VIEWS = ['front', 'back', 'detail', 'side'];

// ─── Color name → hex mapping ────────────────────────────────
const COLOR_MAP = {
  'white': '#FFFFFF', 'sky blue': '#87CEEB', 'navy': '#1B2A4A', 'sage green': '#8FAE7E',
  'blush pink': '#F4A6B8', 'charcoal': '#36454F', 'lavender': '#B8A9D0', 'mustard': '#D4A843',
  'ivory': '#FFFFF0', 'burgundy': '#800020', 'olive': '#808000', 'coral': '#FF6B6B',
  'khaki': '#C3B091', 'black': '#222222', 'beige': '#D4C5A9', 'stone': '#928E85',
  'dark wash': '#2C3E6B', 'light wash': '#8CAACC', 'forest green': '#228B22', 'slate blue': '#6A7B9B',
  'tan': '#D2B48C', 'grey': '#888888', 'camel': '#C19A6B', 'sand': '#C2B280',
  'rust': '#B7410E', 'cognac': '#9A463D',
};

function getHexColor(name) {
  return COLOR_MAP[name.toLowerCase()] || '#888888';
}

function darken(hex, amount = 0.2) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, Math.floor(((num >> 16) & 0xFF) * (1 - amount)));
  const g = Math.max(0, Math.floor(((num >> 8) & 0xFF) * (1 - amount)));
  const b = Math.max(0, Math.floor((num & 0xFF) * (1 - amount)));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

function lighten(hex, amount = 0.3) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.floor(((num >> 16) & 0xFF) + (255 - ((num >> 16) & 0xFF)) * amount));
  const g = Math.min(255, Math.floor(((num >> 8) & 0xFF) + (255 - ((num >> 8) & 0xFF)) * amount));
  const b = Math.min(255, Math.floor((num & 0xFF) + (255 - (num & 0xFF)) * amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

// ─── Pattern generators ──────────────────────────────────────
function getPatternDefs(name, color, id) {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('stripe')) {
    return `<defs><pattern id="pat-${id}" patternUnits="userSpaceOnUse" width="20" height="20"><rect width="20" height="20" fill="${color}"/><line x1="0" y1="10" x2="20" y2="10" stroke="${darken(color, 0.3)}" stroke-width="3"/></pattern></defs>`;
  }
  if (lowerName.includes('check')) {
    return `<defs><pattern id="pat-${id}" patternUnits="userSpaceOnUse" width="24" height="24"><rect width="24" height="24" fill="${color}"/><rect width="12" height="12" fill="${darken(color, 0.15)}"/><rect x="12" y="12" width="12" height="12" fill="${darken(color, 0.15)}"/></pattern></defs>`;
  }
  if (lowerName.includes('color block') || lowerName.includes('colour block')) {
    return `<defs><linearGradient id="pat-${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="50%" stop-color="${color}"/><stop offset="50%" stop-color="${darken(color, 0.35)}"/></linearGradient></defs>`;
  }
  return '';
}

function getFill(name, color, id) {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('stripe') || lowerName.includes('check')) {
    return `url(#pat-${id})`;
  }
  if (lowerName.includes('color block') || lowerName.includes('colour block')) {
    return `url(#pat-${id})`;
  }
  return color;
}

// ─── SVG builders per category and view ──────────────────────

function shirtFront(color, fill, name, id) {
  return `
    <!-- Shirt body -->
    <path d="M300 220 L280 250 L220 240 L180 280 L180 600 L620 600 L620 280 L580 240 L520 250 L500 220 Z" fill="${fill}" stroke="${darken(color, 0.3)}" stroke-width="2"/>
    <!-- Collar -->
    <path d="M300 220 L360 190 L400 210 L440 190 L500 220 L460 260 L440 240 L400 250 L360 240 L340 260 Z" fill="${lighten(color, 0.4)}" stroke="${darken(color, 0.3)}" stroke-width="2"/>
    <!-- Left sleeve -->
    <path d="M180 280 L100 320 L120 420 L180 380 Z" fill="${fill}" stroke="${darken(color, 0.3)}" stroke-width="2"/>
    <!-- Right sleeve -->
    <path d="M620 280 L700 320 L680 420 L620 380 Z" fill="${fill}" stroke="${darken(color, 0.3)}" stroke-width="2"/>
    <!-- Buttons -->
    <circle cx="400" cy="320" r="5" fill="${darken(color, 0.4)}"/>
    <circle cx="400" cy="380" r="5" fill="${darken(color, 0.4)}"/>
    <circle cx="400" cy="440" r="5" fill="${darken(color, 0.4)}"/>
    <circle cx="400" cy="500" r="5" fill="${darken(color, 0.4)}"/>`;
}

function shirtBack(color, fill, name, id) {
  return `
    <!-- Shirt body back -->
    <path d="M300 230 L280 250 L220 240 L180 280 L180 600 L620 600 L620 280 L580 240 L520 250 L500 230 L400 220 Z" fill="${fill}" stroke="${darken(color, 0.3)}" stroke-width="2"/>
    <!-- Back yoke -->
    <path d="M220 300 L580 300" stroke="${darken(color, 0.2)}" stroke-width="1.5" stroke-dasharray="none"/>
    <!-- Left sleeve -->
    <path d="M180 280 L100 320 L120 420 L180 380 Z" fill="${fill}" stroke="${darken(color, 0.3)}" stroke-width="2"/>
    <!-- Right sleeve -->
    <path d="M620 280 L700 320 L680 420 L620 380 Z" fill="${fill}" stroke="${darken(color, 0.3)}" stroke-width="2"/>
    <!-- Back label -->
    <rect x="370" y="240" width="60" height="20" rx="2" fill="${lighten(color, 0.5)}" stroke="${darken(color, 0.2)}" stroke-width="1"/>
    <text x="400" y="254" text-anchor="middle" font-size="8" fill="${darken(color, 0.4)}" font-family="sans-serif">ZW</text>`;
}

function shirtDetail(color, fill, name, id) {
  return `
    <!-- Close-up collar area -->
    <path d="M200 350 L340 250 L400 300 L460 250 L600 350 L540 400 L460 360 L400 380 L340 360 L260 400 Z" fill="${lighten(color, 0.4)}" stroke="${darken(color, 0.3)}" stroke-width="2.5"/>
    <!-- Collar stand -->
    <path d="M280 370 L520 370" stroke="${darken(color, 0.2)}" stroke-width="2"/>
    <!-- Placket -->
    <rect x="385" y="370" width="30" height="250" fill="${lighten(color, 0.3)}" stroke="${darken(color, 0.2)}" stroke-width="1.5"/>
    <!-- Buttons close-up -->
    <circle cx="400" cy="420" r="8" fill="${darken(color, 0.4)}" stroke="${darken(color, 0.5)}" stroke-width="1"/>
    <circle cx="400" cy="480" r="8" fill="${darken(color, 0.4)}" stroke="${darken(color, 0.5)}" stroke-width="1"/>
    <circle cx="400" cy="540" r="8" fill="${darken(color, 0.4)}" stroke="${darken(color, 0.5)}" stroke-width="1"/>
    <!-- Button holes -->
    <line x1="396" y1="420" x2="404" y2="420" stroke="${lighten(color, 0.3)}" stroke-width="1.5"/>
    <line x1="396" y1="480" x2="404" y2="480" stroke="${lighten(color, 0.3)}" stroke-width="1.5"/>
    <line x1="396" y1="540" x2="404" y2="540" stroke="${lighten(color, 0.3)}" stroke-width="1.5"/>
    <!-- Fabric area -->
    <rect x="200" y="370" width="185" height="250" fill="${fill}" stroke="none"/>
    <rect x="415" y="370" width="185" height="250" fill="${fill}" stroke="none"/>`;
}

function shirtSide(color, fill, name, id) {
  return `
    <!-- Folded shirt -->
    <rect x="200" y="300" width="400" height="250" rx="10" fill="${fill}" stroke="${darken(color, 0.3)}" stroke-width="2"/>
    <!-- Fold lines -->
    <path d="M200 380 L600 380" stroke="${darken(color, 0.15)}" stroke-width="1.5"/>
    <path d="M200 450" stroke="${darken(color, 0.15)}" stroke-width="1"/>
    <!-- Collar peeking -->
    <path d="M250 300 L350 280 L400 295 L450 280 L550 300" fill="none" stroke="${darken(color, 0.3)}" stroke-width="2"/>
    <!-- Sleeve fold -->
    <rect x="220" y="310" width="80" height="40" rx="5" fill="${lighten(color, 0.15)}" stroke="${darken(color, 0.2)}" stroke-width="1"/>`;
}

function pantsFront(color, fill, name, id) {
  return `
    <!-- Waistband -->
    <rect x="220" y="180" width="360" height="50" rx="5" fill="${darken(color, 0.1)}" stroke="${darken(color, 0.3)}" stroke-width="2"/>
    <!-- Belt loops -->
    <rect x="260" y="175" width="12" height="60" rx="2" fill="${darken(color, 0.2)}"/>
    <rect x="395" y="175" width="12" height="60" rx="2" fill="${darken(color, 0.2)}"/>
    <rect x="530" y="175" width="12" height="60" rx="2" fill="${darken(color, 0.2)}"/>
    <!-- Left leg -->
    <path d="M220 230 L240 650 L380 650 L400 400 Z" fill="${fill}" stroke="${darken(color, 0.3)}" stroke-width="2"/>
    <!-- Right leg -->
    <path d="M400 400 L420 650 L560 650 L580 230 Z" fill="${fill}" stroke="${darken(color, 0.3)}" stroke-width="2"/>
    <!-- Front crease -->
    <line x1="310" y1="280" x2="310" y2="630" stroke="${darken(color, 0.1)}" stroke-width="1"/>
    <line x1="490" y1="280" x2="490" y2="630" stroke="${darken(color, 0.1)}" stroke-width="1"/>
    <!-- Pockets -->
    <path d="M250 240 L250 340 L340 320 L340 240" fill="none" stroke="${darken(color, 0.2)}" stroke-width="1.5"/>
    <path d="M460 240 L460 320 L550 340 L550 240" fill="none" stroke="${darken(color, 0.2)}" stroke-width="1.5"/>`;
}

function pantsBack(color, fill, name, id) {
  return `
    <!-- Waistband back -->
    <rect x="220" y="180" width="360" height="50" rx="5" fill="${darken(color, 0.1)}" stroke="${darken(color, 0.3)}" stroke-width="2"/>
    <!-- Belt loops -->
    <rect x="260" y="175" width="12" height="60" rx="2" fill="${darken(color, 0.2)}"/>
    <rect x="530" y="175" width="12" height="60" rx="2" fill="${darken(color, 0.2)}"/>
    <!-- Left leg -->
    <path d="M220 230 L240 650 L380 650 L400 400 Z" fill="${fill}" stroke="${darken(color, 0.3)}" stroke-width="2"/>
    <!-- Right leg -->
    <path d="M400 400 L420 650 L560 650 L580 230 Z" fill="${fill}" stroke="${darken(color, 0.3)}" stroke-width="2"/>
    <!-- Back pockets -->
    <rect x="270" y="280" width="90" height="80" rx="5" fill="none" stroke="${darken(color, 0.25)}" stroke-width="1.5"/>
    <rect x="440" y="280" width="90" height="80" rx="5" fill="none" stroke="${darken(color, 0.25)}" stroke-width="1.5"/>
    <!-- Pocket stitching -->
    <path d="M280 320 L350 320" stroke="${darken(color, 0.3)}" stroke-width="1" stroke-dasharray="3,2"/>
    <path d="M450 320 L520 320" stroke="${darken(color, 0.3)}" stroke-width="1" stroke-dasharray="3,2"/>`;
}

function pantsDetail(color, fill, name, id) {
  return `
    <!-- Waistband close-up -->
    <rect x="150" y="250" width="500" height="80" rx="8" fill="${darken(color, 0.1)}" stroke="${darken(color, 0.3)}" stroke-width="2.5"/>
    <!-- Belt loops close -->
    <rect x="220" y="240" width="18" height="100" rx="3" fill="${darken(color, 0.2)}" stroke="${darken(color, 0.35)}" stroke-width="1"/>
    <rect x="390" y="240" width="18" height="100" rx="3" fill="${darken(color, 0.2)}" stroke="${darken(color, 0.35)}" stroke-width="1"/>
    <rect x="560" y="240" width="18" height="100" rx="3" fill="${darken(color, 0.2)}" stroke="${darken(color, 0.35)}" stroke-width="1"/>
    <!-- Zipper/fly area -->
    <rect x="370" y="330" width="60" height="120" rx="3" fill="${darken(color, 0.08)}" stroke="${darken(color, 0.2)}" stroke-width="1.5"/>
    <line x1="400" y1="340" x2="400" y2="440" stroke="${darken(color, 0.3)}" stroke-width="2"/>
    <!-- Button -->
    <circle cx="400" cy="290" r="12" fill="${darken(color, 0.3)}" stroke="${darken(color, 0.4)}" stroke-width="1.5"/>
    <!-- Fabric below -->
    <rect x="150" y="330" width="220" height="200" fill="${fill}" stroke="none"/>
    <rect x="430" y="330" width="220" height="200" fill="${fill}" stroke="none"/>`;
}

function pantsSide(color, fill, name, id) {
  return `
    <!-- Side profile pants -->
    <path d="M350 180 L450 180 L460 230 L470 650 L420 650 L400 400 L380 650 L330 650 L340 230 Z" fill="${fill}" stroke="${darken(color, 0.3)}" stroke-width="2"/>
    <!-- Waistband -->
    <rect x="340" y="180" width="120" height="50" rx="5" fill="${darken(color, 0.1)}" stroke="${darken(color, 0.3)}" stroke-width="2"/>
    <!-- Side seam -->
    <line x1="460" y1="230" x2="470" y2="640" stroke="${darken(color, 0.15)}" stroke-width="1.5"/>
    <!-- Side pocket -->
    <path d="M445 250 L460 250 L465 350 L445 340 Z" fill="none" stroke="${darken(color, 0.2)}" stroke-width="1.5"/>`;
}

function shoeFront(color, fill, name, id) {
  return `
    <!-- Shoe top-front view -->
    <ellipse cx="400" cy="500" rx="180" ry="60" fill="${darken(color, 0.1)}" stroke="${darken(color, 0.3)}" stroke-width="2"/>
    <!-- Shoe upper -->
    <path d="M220 500 L240 350 L350 300 L400 290 L450 300 L560 350 L580 500 Z" fill="${fill}" stroke="${darken(color, 0.3)}" stroke-width="2"/>
    <!-- Toe box -->
    <ellipse cx="400" cy="340" rx="80" ry="30" fill="${lighten(color, 0.1)}" stroke="${darken(color, 0.2)}" stroke-width="1.5"/>
    <!-- Lacing area -->
    <line x1="380" y1="350" x2="420" y2="350" stroke="${darken(color, 0.4)}" stroke-width="2"/>
    <line x1="375" y1="370" x2="425" y2="370" stroke="${darken(color, 0.4)}" stroke-width="2"/>
    <line x1="370" y1="390" x2="430" y2="390" stroke="${darken(color, 0.4)}" stroke-width="2"/>
    <line x1="365" y1="410" x2="435" y2="410" stroke="${darken(color, 0.4)}" stroke-width="2"/>
    <!-- Tongue -->
    <path d="M375 350 L400 310 L425 350" fill="${lighten(color, 0.2)}" stroke="${darken(color, 0.2)}" stroke-width="1"/>`;
}

function shoeBack(color, fill, name, id) {
  return `
    <!-- Sole back -->
    <rect x="250" y="510" width="300" height="30" rx="5" fill="${darken(color, 0.4)}" stroke="${darken(color, 0.5)}" stroke-width="2"/>
    <!-- Heel counter -->
    <path d="M270 510 L270 370 L330 340 L400 330 L470 340 L530 370 L530 510 Z" fill="${fill}" stroke="${darken(color, 0.3)}" stroke-width="2"/>
    <!-- Heel tab -->
    <rect x="370" y="330" width="60" height="30" rx="5" fill="${lighten(color, 0.3)}" stroke="${darken(color, 0.2)}" stroke-width="1.5"/>
    <text x="400" y="350" text-anchor="middle" font-size="10" fill="${darken(color, 0.4)}" font-family="sans-serif">ZW</text>
    <!-- Heel accent -->
    <path d="M290 480 L510 480" stroke="${darken(color, 0.2)}" stroke-width="1.5"/>
    <!-- Collar -->
    <ellipse cx="400" cy="345" rx="90" ry="25" fill="none" stroke="${darken(color, 0.2)}" stroke-width="1.5"/>`;
}

function shoeDetail(color, fill, name, id) {
  return `
    <!-- Sole pattern close-up -->
    <rect x="200" y="250" width="400" height="300" rx="20" fill="${darken(color, 0.4)}" stroke="${darken(color, 0.5)}" stroke-width="2.5"/>
    <!-- Tread pattern -->
    <line x1="230" y1="290" x2="570" y2="290" stroke="${darken(color, 0.3)}" stroke-width="3"/>
    <line x1="230" y1="330" x2="570" y2="330" stroke="${darken(color, 0.3)}" stroke-width="3"/>
    <line x1="230" y1="370" x2="570" y2="370" stroke="${darken(color, 0.3)}" stroke-width="3"/>
    <line x1="230" y1="410" x2="570" y2="410" stroke="${darken(color, 0.3)}" stroke-width="3"/>
    <line x1="230" y1="450" x2="570" y2="450" stroke="${darken(color, 0.3)}" stroke-width="3"/>
    <line x1="230" y1="490" x2="570" y2="490" stroke="${darken(color, 0.3)}" stroke-width="3"/>
    <!-- Cross treads -->
    <line x1="300" y1="260" x2="300" y2="540" stroke="${darken(color, 0.3)}" stroke-width="2"/>
    <line x1="400" y1="260" x2="400" y2="540" stroke="${darken(color, 0.3)}" stroke-width="2"/>
    <line x1="500" y1="260" x2="500" y2="540" stroke="${darken(color, 0.3)}" stroke-width="2"/>
    <!-- Brand circle -->
    <circle cx="400" cy="400" r="40" fill="${darken(color, 0.35)}" stroke="${darken(color, 0.5)}" stroke-width="2"/>
    <text x="400" y="405" text-anchor="middle" font-size="14" fill="${lighten(color, 0.3)}" font-family="sans-serif" font-weight="bold">ZW</text>`;
}

function shoeSide(color, fill, name, id) {
  return `
    <!-- Sole -->
    <path d="M150 520 L650 520 L660 540 L640 550 L160 550 L140 540 Z" fill="${darken(color, 0.4)}" stroke="${darken(color, 0.5)}" stroke-width="2"/>
    <!-- Midsole -->
    <path d="M160 510 L640 510 L650 520 L150 520 Z" fill="#EEEEEE" stroke="${darken(color, 0.3)}" stroke-width="1"/>
    <!-- Shoe upper -->
    <path d="M180 510 L200 350 L280 300 L380 280 L500 290 L580 330 L620 420 L630 510 Z" fill="${fill}" stroke="${darken(color, 0.3)}" stroke-width="2"/>
    <!-- Toe cap -->
    <path d="M180 510 L200 420 L280 380 L300 510" fill="${lighten(color, 0.1)}" stroke="${darken(color, 0.2)}" stroke-width="1.5"/>
    <!-- Collar/opening -->
    <path d="M480 310 L540 340 L580 380" fill="none" stroke="${darken(color, 0.2)}" stroke-width="2"/>
    <!-- Laces -->
    <line x1="350" y1="310" x2="420" y2="300" stroke="${darken(color, 0.4)}" stroke-width="2"/>
    <line x1="340" y1="330" x2="410" y2="315" stroke="${darken(color, 0.4)}" stroke-width="2"/>
    <line x1="330" y1="350" x2="400" y2="332" stroke="${darken(color, 0.4)}" stroke-width="2"/>
    <!-- Logo -->
    <circle cx="460" cy="420" r="15" fill="${darken(color, 0.2)}" opacity="0.5"/>`;
}

// ─── Build complete SVG ──────────────────────────────────────

const GENERATORS = {
  shirts: { front: shirtFront, back: shirtBack, detail: shirtDetail, side: shirtSide },
  pants: { front: pantsFront, back: pantsBack, detail: pantsDetail, side: pantsSide },
  shoes: { front: shoeFront, back: shoeBack, detail: shoeDetail, side: shoeSide },
};

function buildSVG(product, viewIndex) {
  const view = VIEWS[viewIndex];
  const category = product.category.toLowerCase();
  const color = getHexColor(product.colors[0]);
  const patternId = `${product.id}-${view}`;

  const patternDefs = getPatternDefs(product.name, color, patternId);
  const fill = getFill(product.name, color, patternId);

  const generator = GENERATORS[category]?.[view];
  if (!generator) return null;

  const illustration = generator(color, fill, product.name, patternId);

  const viewLabel = view.charAt(0).toUpperCase() + view.slice(1);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <title>${product.name} - ${viewLabel} View</title>
  <desc>${viewLabel} view of ${product.name}. Category: ${product.category}. Color: ${product.colors[0]}. This is a demo product image.</desc>
  ${patternDefs}
  <rect width="800" height="800" fill="#F5F5F5"/>
  ${illustration}
  <text x="400" y="720" text-anchor="middle" font-size="12" fill="#999" font-family="sans-serif">${product.name}</text>
  <text x="400" y="740" text-anchor="middle" font-size="10" fill="#BBB" font-family="sans-serif">${viewLabel} View • DEMO</text>
</svg>`;
}

// ─── Main ────────────────────────────────────────────────────

const productsPath = path.join(ROOT, 'src', 'data', 'products.json');
if (!fs.existsSync(productsPath)) {
  console.error('Error: src/data/products.json not found. Run generate-products.js first.');
  process.exit(1);
}

const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));

let generated = 0;
let errors = 0;

for (const product of products) {
  const category = product.category.toLowerCase();
  const dir = path.join(ROOT, 'src', 'images', category);
  fs.mkdirSync(dir, { recursive: true });

  for (let v = 0; v < IMAGES_PER_PRODUCT; v++) {
    const svg = buildSVG(product, v);
    if (!svg) {
      errors++;
      continue;
    }

    const fileName = `${product.slug}-${VIEWS[v]}.svg`;
    const filePath = path.join(dir, fileName);
    fs.writeFileSync(filePath, svg, 'utf-8');
    generated++;
  }
}

console.log(`SVG generation complete.`);
console.log(`  Generated: ${generated} images`);
console.log(`  Errors: ${errors}`);
console.log(`  Products: ${products.length}`);
console.log(`  Views per product: ${IMAGES_PER_PRODUCT}`);
