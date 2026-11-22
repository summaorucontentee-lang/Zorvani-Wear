// Zorvani Wear (DEMO) - Enhanced Fashion SVG Image Generator
// Generates realistic, beautifully detailed vector apparel & footwear images.
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
  'white': '#F4F5F7', 'sky blue': '#7EB8E2', 'navy': '#1B2A4A', 'sage green': '#7F9E7B',
  'blush pink': '#E8A3B2', 'charcoal': '#2C343D', 'lavender': '#9F90C2', 'mustard': '#D69E2E',
  'ivory': '#F7F3E8', 'burgundy': '#6B1728', 'olive': '#5E6B3C', 'coral': '#E05A47',
  'khaki': '#A89472', 'black': '#1E2024', 'beige': '#C9BC9C', 'stone': '#827E77',
  'dark wash': '#1D2A44', 'light wash': '#6F8FAF', 'forest green': '#1C4A27', 'slate blue': '#4A5B78',
  'tan': '#AD8350', 'grey': '#6E737A', 'camel': '#A67C48', 'sand': '#B0A178',
  'rust': '#9E381A', 'cognac': '#803823',
};

function getHexColor(name) {
  return COLOR_MAP[name.toLowerCase()] || '#4A5568';
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

// ─── Pattern & Texture definitions ────────────────────────────
function getPatternDefs(name, color, id) {
  const lowerName = name.toLowerCase();
  let pattern = '';
  if (lowerName.includes('stripe')) {
    pattern = `<pattern id="pat-${id}" patternUnits="userSpaceOnUse" width="28" height="28">
      <rect width="28" height="28" fill="${color}"/>
      <line x1="0" y1="14" x2="28" y2="14" stroke="${darken(color, 0.25)}" stroke-width="4"/>
      <line x1="0" y1="7" x2="28" y2="7" stroke="${lighten(color, 0.2)}" stroke-width="1.5" opacity="0.6"/>
    </pattern>`;
  } else if (lowerName.includes('check')) {
    pattern = `<pattern id="pat-${id}" patternUnits="userSpaceOnUse" width="36" height="36">
      <rect width="36" height="36" fill="${color}"/>
      <rect width="18" height="18" fill="${darken(color, 0.18)}"/>
      <rect x="18" y="18" width="18" height="18" fill="${darken(color, 0.18)}"/>
      <line x1="0" y1="18" x2="36" y2="18" stroke="${darken(color, 0.35)}" stroke-width="1.5"/>
      <line x1="18" y1="0" x2="18" y2="36" stroke="${darken(color, 0.35)}" stroke-width="1.5"/>
    </pattern>`;
  } else if (lowerName.includes('color block') || lowerName.includes('colour block')) {
    pattern = `<linearGradient id="pat-${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${lighten(color, 0.15)}"/>
      <stop offset="48%" stop-color="${color}"/>
      <stop offset="52%" stop-color="${darken(color, 0.3)}"/>
      <stop offset="100%" stop-color="${darken(color, 0.45)}"/>
    </linearGradient>`;
  }
  return pattern ? `<defs>${pattern}</defs>` : '';
}

function getFill(name, color, id) {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('stripe') || lowerName.includes('check') || lowerName.includes('color block') || lowerName.includes('colour block')) {
    return `url(#pat-${id})`;
  }
  return color;
}

// ─── SHIRT ILLUSTRATIONS (REALISTIC CLOTHING) ────────────────

function shirtFront(color, fill, name, id) {
  const dark = darken(color, 0.35);
  const light = lighten(color, 0.3);
  const mid = darken(color, 0.15);
  return `
    <!-- Pedestal Shadow -->
    <ellipse cx="400" cy="640" rx="210" ry="22" fill="#000000" opacity="0.12" filter="url(#shadow-filter)"/>
    
    <!-- Torso Body -->
    <path d="M290 190 Q220 220 180 260 L195 590 Q400 625 605 590 L620 260 Q580 220 510 190 Q450 220 400 220 Q350 220 290 190 Z" fill="${fill}" stroke="${dark}" stroke-width="2.5"/>
    
    <!-- Inner Neck Arch & Contrast Band -->
    <path d="M330 195 Q400 240 470 195 Q445 160 400 160 Q355 160 330 195 Z" fill="${darken(color, 0.4)}"/>
    <rect x="375" y="172" width="50" height="22" rx="3" fill="#FFFFFF" opacity="0.85"/>
    <text x="400" y="186" text-anchor="middle" font-size="9" font-weight="bold" fill="#1A202C" font-family="sans-serif">ZORVANI</text>
    
    <!-- Left Sleeve -->
    <path d="M190 250 L110 330 Q125 410 155 430 L195 385 Z" fill="${fill}" stroke="${dark}" stroke-width="2"/>
    <path d="M125 410 L155 430" stroke="${dark}" stroke-width="3"/> <!-- Cuff -->
    
    <!-- Right Sleeve -->
    <path d="M610 250 L690 330 Q675 410 645 430 L605 385 Z" fill="${fill}" stroke="${dark}" stroke-width="2"/>
    <path d="M675 410 L645 430" stroke="${dark}" stroke-width="3"/> <!-- Cuff -->
    
    <!-- Center Front Placket -->
    <path d="M382 210 L382 605 L418 605 L418 210 Z" fill="${lighten(color, 0.1)}" stroke="${dark}" stroke-width="1.8"/>
    <line x1="388" y1="210" x2="388" y2="605" stroke="${dark}" stroke-width="1" stroke-dasharray="3,3" opacity="0.5"/>
    <line x1="412" y1="210" x2="412" y2="605" stroke="${dark}" stroke-width="1" stroke-dasharray="3,3" opacity="0.5"/>
    
    <!-- Left Collar Leaf -->
    <path d="M330 190 Q380 230 396 295 L350 260 Q315 220 330 190 Z" fill="${light}" stroke="${dark}" stroke-width="2.2"/>
    <!-- Right Collar Leaf -->
    <path d="M470 190 Q420 230 404 295 L450 260 Q485 220 470 190 Z" fill="${light}" stroke="${dark}" stroke-width="2.2"/>
    
    <!-- Chest Pocket Left -->
    <path d="M235 320 L310 320 L310 395 L272 415 L235 395 Z" fill="${fill}" stroke="${dark}" stroke-width="1.8"/>
    <line x1="235" y1="335" x2="310" y2="335" stroke="${dark}" stroke-width="1.2" stroke-dasharray="2,2"/>
    
    <!-- Buttons (Mother of Pearl style) -->
    ${[230, 290, 350, 410, 470, 535].map(y => `
      <circle cx="400" cy="${y}" r="6.5" fill="#FFFFFF" stroke="${mid}" stroke-width="1.5"/>
      <circle cx="400" cy="${y}" r="3.5" fill="#E2E8F0"/>
      <circle cx="398.5" cy="${y - 1.5}" r="1" fill="#4A5568"/>
      <circle cx="401.5" cy="${y - 1.5}" r="1" fill="#4A5568"/>
      <circle cx="398.5" cy="${y + 1.5}" r="1" fill="#4A5568"/>
      <circle cx="401.5" cy="${y + 1.5}" r="1" fill="#4A5568"/>
    `).join('')}
    
    <!-- Natural Fabric Folds -->
    <path d="M250 480 Q290 510 320 490" stroke="${dark}" stroke-width="1.5" fill="none" opacity="0.35"/>
    <path d="M480 490 Q510 510 550 480" stroke="${dark}" stroke-width="1.5" fill="none" opacity="0.35"/>
  `;
}

function shirtBack(color, fill, name, id) {
  const dark = darken(color, 0.35);
  return `
    <ellipse cx="400" cy="640" rx="210" ry="22" fill="#000000" opacity="0.12" filter="url(#shadow-filter)"/>
    <path d="M290 190 Q220 220 180 260 L195 590 Q400 625 605 590 L620 260 Q580 220 510 190 Q450 175 400 175 Q350 175 290 190 Z" fill="${fill}" stroke="${dark}" stroke-width="2.5"/>
    <!-- Back Yoke -->
    <path d="M185 270 Q400 295 615 270" stroke="${dark}" stroke-width="2.5" fill="none"/>
    <line x1="185" y1="274" x2="615" y2="274" stroke="${dark}" stroke-width="1" stroke-dasharray="3,3" opacity="0.6"/>
    <!-- Box Pleat -->
    <line x1="400" y1="290" x2="400" y2="570" stroke="${dark}" stroke-width="2" opacity="0.5"/>
    <!-- Sleeves -->
    <path d="M190 250 L110 330 Q125 410 155 430 L195 385 Z" fill="${fill}" stroke="${dark}" stroke-width="2"/>
    <path d="M610 250 L690 330 Q675 410 645 430 L605 385 Z" fill="${fill}" stroke="${dark}" stroke-width="2"/>
    <!-- Collar Band Back -->
    <path d="M320 190 Q400 205 480 190" stroke="${dark}" stroke-width="4" fill="none"/>
  `;
}

function shirtDetail(color, fill, name, id) {
  const dark = darken(color, 0.35);
  const light = lighten(color, 0.3);
  return `
    <!-- Macro View of Collar & Placket -->
    <rect x="160" y="160" width="480" height="480" rx="24" fill="${fill}" stroke="${dark}" stroke-width="3"/>
    <!-- Collar Spread Macro -->
    <path d="M210 220 L370 380 L395 320 L270 200 Z" fill="${light}" stroke="${dark}" stroke-width="3"/>
    <path d="M590 220 L430 380 L405 320 L530 200 Z" fill="${light}" stroke="${dark}" stroke-width="3"/>
    <!-- Placket Macro -->
    <rect x="365" y="240" width="70" height="400" fill="${lighten(color, 0.15)}" stroke="${dark}" stroke-width="2.5"/>
    <line x1="375" y1="240" x2="375" y2="640" stroke="${dark}" stroke-width="1.5" stroke-dasharray="4,4"/>
    <line x1="425" y1="240" x2="425" y2="640" stroke="${dark}" stroke-width="1.5" stroke-dasharray="4,4"/>
    <!-- Button Close-Up -->
    <circle cx="400" cy="400" r="22" fill="#FFFFFF" stroke="${dark}" stroke-width="3"/>
    <circle cx="400" cy="400" r="14" fill="#EDF2F7" stroke="${dark}" stroke-width="1"/>
    <circle cx="394" cy="394" r="2.5" fill="#1A202C"/>
    <circle cx="406" cy="394" r="2.5" fill="#1A202C"/>
    <circle cx="394" cy="406" r="2.5" fill="#1A202C"/>
    <circle cx="406" cy="406" r="2.5" fill="#1A202C"/>
    <!-- Woven Brand Label Inside -->
    <rect x="330" y="170" width="140" height="50" rx="4" fill="#1A202C"/>
    <text x="400" y="200" text-anchor="middle" font-size="16" font-weight="bold" fill="#FFFFFF" font-family="sans-serif">ZORVANI</text>
    <text x="400" y="214" text-anchor="middle" font-size="10" fill="#E2E8F0" font-family="sans-serif">EST. 2026 • 100% COTTON</text>
  `;
}

function shirtSide(color, fill, name, id) {
  const dark = darken(color, 0.35);
  return `
    <ellipse cx="400" cy="620" rx="190" ry="20" fill="#000000" opacity="0.12" filter="url(#shadow-filter)"/>
    <!-- Neatly Folded Boutique Presentation -->
    <rect x="220" y="240" width="360" height="360" rx="16" fill="${fill}" stroke="${dark}" stroke-width="3"/>
    <!-- Fold Shadows -->
    <rect x="220" y="240" width="360" height="90" fill="#FFFFFF" opacity="0.15"/>
    <line x1="220" y1="330" x2="580" y2="330" stroke="${dark}" stroke-width="2" opacity="0.6"/>
    <!-- Collar Centered on Fold -->
    <path d="M310 240 Q400 290 490 240 Q450 200 400 200 Q350 200 310 240 Z" fill="${lighten(color, 0.25)}" stroke="${dark}" stroke-width="2.5"/>
    <circle cx="400" cy="300" r="8" fill="#FFFFFF" stroke="${dark}" stroke-width="1.8"/>
    <!-- Silk Ribbon / Boutique Band -->
    <rect x="220" y="440" width="360" height="48" fill="#1B2A4A" opacity="0.95"/>
    <text x="400" y="470" text-anchor="middle" font-size="16" font-weight="bold" fill="#E05A47" font-family="sans-serif">ZORVANI WEAR</text>
  `;
}

// ─── PANTS ILLUSTRATIONS (REALISTIC TROUSERS/DENIM) ──────────

function pantsFront(color, fill, name, id) {
  const dark = darken(color, 0.4);
  const mid = darken(color, 0.15);
  return `
    <ellipse cx="400" cy="660" rx="190" ry="20" fill="#000000" opacity="0.12" filter="url(#shadow-filter)"/>
    
    <!-- Left Leg -->
    <path d="M240 230 L260 645 L385 645 L395 380 L350 230 Z" fill="${fill}" stroke="${dark}" stroke-width="2.5"/>
    <!-- Right Leg -->
    <path d="M450 230 L405 380 L415 645 L540 645 L560 230 Z" fill="${fill}" stroke="${dark}" stroke-width="2.5"/>
    <!-- Crotch & Rise Center -->
    <path d="M350 230 L395 380 L405 380 L450 230 Z" fill="${fill}"/>
    
    <!-- Waistband -->
    <rect x="235" y="180" width="330" height="52" rx="4" fill="${darken(color, 0.1)}" stroke="${dark}" stroke-width="2.5"/>
    <line x1="235" y1="184" x2="565" y2="184" stroke="${mid}" stroke-width="1" stroke-dasharray="3,2"/>
    <line x1="235" y1="228" x2="565" y2="228" stroke="${mid}" stroke-width="1" stroke-dasharray="3,2"/>
    
    <!-- Belt Loops -->
    ${[270, 345, 455, 530].map(x => `
      <rect x="${x}" y="174" width="12" height="64" rx="2" fill="${darken(color, 0.25)}" stroke="${dark}" stroke-width="1"/>
      <line x1="${x}" y1="178" x2="${x + 12}" y2="178" stroke="#F6AD55" stroke-width="2"/>
      <line x1="${x}" y1="234" x2="${x + 12}" y2="234" stroke="#F6AD55" stroke-width="2"/>
    `).join('')}
    
    <!-- Shank Button (Antique Brass / Gunmetal) -->
    <circle cx="400" cy="206" r="10" fill="#D69E2E" stroke="#744210" stroke-width="2"/>
    <circle cx="400" cy="206" r="6" fill="#B7791F"/>
    
    <!-- J-Stitch Fly -->
    <path d="M400 232 L400 320 Q400 350 380 360" stroke="#D69E2E" stroke-width="2" fill="none" stroke-dasharray="4,2"/>
    
    <!-- Curved Front Pockets with Rivets -->
    <path d="M240 232 Q290 240 310 290" stroke="${dark}" stroke-width="2" fill="none"/>
    <circle cx="310" cy="290" r="3.5" fill="#D69E2E"/>
    <path d="M560 232 Q510 240 490 290" stroke="${dark}" stroke-width="2" fill="none"/>
    <circle cx="490" cy="290" r="3.5" fill="#D69E2E"/>
    
    <!-- Ankle Hem Cuffs -->
    <line x1="260" y1="635" x2="385" y2="635" stroke="${mid}" stroke-width="1.5" stroke-dasharray="3,2"/>
    <line x1="415" y1="635" x2="540" y2="635" stroke="${mid}" stroke-width="1.5" stroke-dasharray="3,2"/>
  `;
}

function pantsBack(color, fill, name, id) {
  const dark = darken(color, 0.4);
  return `
    <ellipse cx="400" cy="660" rx="190" ry="20" fill="#000000" opacity="0.12" filter="url(#shadow-filter)"/>
    <path d="M240 230 L260 645 L385 645 L395 380 L350 230 Z" fill="${fill}" stroke="${dark}" stroke-width="2.5"/>
    <path d="M450 230 L405 380 L415 645 L540 645 L560 230 Z" fill="${fill}" stroke="${dark}" stroke-width="2.5"/>
    <path d="M350 230 L395 380 L405 380 L450 230 Z" fill="${fill}"/>
    <rect x="235" y="180" width="330" height="52" rx="4" fill="${darken(color, 0.1)}" stroke="${dark}" stroke-width="2.5"/>
    <!-- Leather Brand Patch -->
    <rect x="475" y="184" width="70" height="44" rx="3" fill="#8B4513" stroke="#5C2C0A" stroke-width="1.5"/>
    <text x="510" y="210" text-anchor="middle" font-size="8" font-weight="bold" fill="#F7FAFC" font-family="sans-serif">ZORVANI</text>
    <!-- Back Yoke V-Seam -->
    <path d="M235 250 L400 280 L565 250" stroke="${dark}" stroke-width="2" fill="none"/>
    <!-- Back Pockets -->
    <path d="M270 290 L345 290 L345 365 L307 385 L270 365 Z" fill="${darken(color, 0.05)}" stroke="${dark}" stroke-width="2"/>
    <path d="M275 325 Q307 350 340 325" stroke="#D69E2E" stroke-width="1.5" fill="none"/>
    <path d="M455 290 L530 290 L530 365 L492 385 L455 365 Z" fill="${darken(color, 0.05)}" stroke="${dark}" stroke-width="2"/>
    <path d="M460 325 Q492 350 525 325" stroke="#D69E2E" stroke-width="1.5" fill="none"/>
  `;
}

function pantsDetail(color, fill, name, id) {
  const dark = darken(color, 0.4);
  return `
    <!-- Close-Up Waist & Front Pocket Details -->
    <rect x="160" y="180" width="480" height="440" rx="20" fill="${fill}" stroke="${dark}" stroke-width="3"/>
    <rect x="160" y="180" width="480" height="90" fill="${darken(color, 0.1)}" stroke="${dark}" stroke-width="2"/>
    <!-- Belt Loop -->
    <rect x="310" y="170" width="22" height="110" rx="3" fill="${darken(color, 0.25)}" stroke="${dark}" stroke-width="1.5"/>
    <line x1="310" y1="180" x2="332" y2="180" stroke="#F6AD55" stroke-width="3"/>
    <line x1="310" y1="270" x2="332" y2="270" stroke="#F6AD55" stroke-width="3"/>
    <!-- Large Antique Brass Button -->
    <circle cx="440" cy="225" r="24" fill="#D69E2E" stroke="#5C3B0E" stroke-width="3"/>
    <circle cx="440" cy="225" r="16" fill="#B7791F"/>
    <text x="440" y="230" text-anchor="middle" font-size="10" font-weight="bold" fill="#5C3B0E" font-family="sans-serif">ZW 26</text>
    <!-- Coin Pocket Detail -->
    <rect x="190" y="320" width="110" height="85" rx="4" fill="${darken(color, 0.08)}" stroke="${dark}" stroke-width="2"/>
    <circle cx="205" cy="335" r="5" fill="#D69E2E"/>
    <circle cx="285" cy="335" r="5" fill="#D69E2E"/>
    <!-- Rivet Contrast -->
    <line x1="190" y1="360" x2="300" y2="360" stroke="#F6AD55" stroke-width="2" stroke-dasharray="4,2"/>
  `;
}

function pantsSide(color, fill, name, id) {
  const dark = darken(color, 0.4);
  return `
    <ellipse cx="400" cy="650" rx="160" ry="18" fill="#000000" opacity="0.12" filter="url(#shadow-filter)"/>
    <!-- Elegant Side Profile -->
    <path d="M360 180 L440 180 Q465 240 455 640 L375 640 Q350 400 345 240 Z" fill="${fill}" stroke="${dark}" stroke-width="2.5"/>
    <rect x="350" y="180" width="95" height="48" rx="4" fill="${darken(color, 0.1)}" stroke="${dark}" stroke-width="2"/>
    <!-- Outer Side Seam with Double Stitching -->
    <line x1="410" y1="228" x2="410" y2="640" stroke="${dark}" stroke-width="2"/>
    <line x1="414" y1="228" x2="414" y2="640" stroke="#D69E2E" stroke-width="1.2" stroke-dasharray="3,2" opacity="0.7"/>
    <!-- Side Pocket -->
    <path d="M410 240 L370 290" stroke="${dark}" stroke-width="2.5"/>
    <!-- Turn-up Hem Cuff -->
    <rect x="370" y="615" width="90" height="25" fill="${darken(color, 0.15)}" stroke="${dark}" stroke-width="2"/>
  `;
}

// ─── SHOE ILLUSTRATIONS (REALISTIC SNEAKERS & LEATHER FOOTWEAR) ────────

function shoeSide(color, fill, name, id) {
  const dark = darken(color, 0.4);
  const soleWhite = '#F7FAFC';
  const mid = darken(color, 0.15);
  return `
    <!-- Contact Ground Shadow -->
    <ellipse cx="400" cy="570" rx="260" ry="16" fill="#000000" opacity="0.18" filter="url(#shadow-filter)"/>
    
    <!-- Rubber Outsole Lugs -->
    <path d="M150 540 L650 540 L645 558 Q400 565 155 558 Z" fill="#2D3748" stroke="#1A202C" stroke-width="2"/>
    
    <!-- Sculpted Cushioned Midsole (Sneaker / Comfort Sole) -->
    <path d="M142 510 Q280 525 430 520 Q560 528 658 510 L650 540 L150 540 Z" fill="${soleWhite}" stroke="#CBD5E0" stroke-width="1.8"/>
    <!-- Air / Gel Cushion Accent Window -->
    <rect x="480" y="520" width="70" height="14" rx="7" fill="#E2E8F0" stroke="#A0AEC0" stroke-width="1"/>
    <line x1="500" y1="520" x2="500" y2="534" stroke="#CBD5E0" stroke-width="2"/>
    <line x1="515" y1="520" x2="515" y2="534" stroke="#CBD5E0" stroke-width="2"/>
    <line x1="530" y1="520" x2="530" y2="534" stroke="#CBD5E0" stroke-width="2"/>
    
    <!-- Upper Body Contour -->
    <path d="M145 510 Q160 410 240 370 Q340 340 430 330 Q530 310 590 350 Q635 390 655 510 Z" fill="${fill}" stroke="${dark}" stroke-width="2.5"/>
    
    <!-- Suede / Leather Toe Mudguard -->
    <path d="M145 510 Q160 410 240 370 Q215 470 230 512 Z" fill="${darken(color, 0.12)}" stroke="${dark}" stroke-width="2"/>
    
    <!-- Ankle Collar Padding & Opening -->
    <path d="M490 325 Q545 300 590 350 Q560 380 490 340 Z" fill="#2D3748"/>
    <path d="M495 320 Q550 305 585 345" stroke="#FFFFFF" stroke-width="2" fill="none" opacity="0.6"/>
    
    <!-- Eyestay & Lacing System -->
    <path d="M290 360 L480 330 L465 375 L300 405 Z" fill="${darken(color, 0.18)}" stroke="${dark}" stroke-width="1.8"/>
    <!-- Criss-Cross Laces -->
    ${[
      [315, 385, 335, 350],
      [350, 375, 370, 345],
      [385, 365, 405, 340],
      [420, 355, 440, 335],
    ].map(([x1, y1, x2, y2]) => `
      <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round"/>
      <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#A0AEC0" stroke-width="1.5" stroke-linecap="round"/>
    `).join('')}
    
    <!-- Aerodynamic Side Swoosh / Brand Stripe Wave -->
    <path d="M230 450 Q380 470 540 370 Q420 500 240 475 Z" fill="#E05A47" opacity="0.9" stroke="${dark}" stroke-width="1.5"/>
    
    <!-- Heel Counter Support Overlay -->
    <path d="M570 380 Q620 400 655 510 L585 510 Q560 430 570 380 Z" fill="${darken(color, 0.22)}" stroke="${dark}" stroke-width="1.5"/>
  `;
}

function shoeFront(color, fill, name, id) {
  const dark = darken(color, 0.4);
  return `
    <ellipse cx="400" cy="620" rx="160" ry="24" fill="#000000" opacity="0.16" filter="url(#shadow-filter)"/>
    <!-- Top-Down 3D Perspective -->
    <!-- Outsole Edge -->
    <path d="M270 560 Q240 400 290 280 Q400 220 510 280 Q560 400 530 560 Q400 620 270 560 Z" fill="#F7FAFC" stroke="#CBD5E0" stroke-width="3"/>
    <!-- Upper Body -->
    <path d="M285 540 Q260 400 305 300 Q400 250 495 300 Q540 400 515 540 Q400 595 285 540 Z" fill="${fill}" stroke="${dark}" stroke-width="2.5"/>
    <!-- Perforated Toe Vamp -->
    <path d="M320 320 Q400 280 480 320 Q440 390 360 390 Z" fill="${darken(color, 0.1)}" stroke="${dark}" stroke-width="1.5"/>
    ${[
      [400, 310], [385, 330], [415, 330], [370, 350], [400, 350], [430, 350]
    ].map(([cx, cy]) => `<circle cx="${cx}" cy="${cy}" r="2.5" fill="${dark}"/>`).join('')}
    <!-- Lacing Array -->
    ${[390, 425, 460, 495].map(y => `
      <rect x="350" y="${y}" width="100" height="8" rx="4" fill="#FFFFFF" stroke="#CBD5E0" stroke-width="1"/>
    `).join('')}
    <!-- Tongue Badge -->
    <rect x="365" y="515" width="70" height="30" rx="4" fill="#1A202C"/>
    <text x="400" y="534" text-anchor="middle" font-size="10" font-weight="bold" fill="#E05A47" font-family="sans-serif">ZORVANI</text>
  `;
}

function shoeBack(color, fill, name, id) {
  const dark = darken(color, 0.4);
  return `
    <ellipse cx="400" cy="620" rx="140" ry="20" fill="#000000" opacity="0.16" filter="url(#shadow-filter)"/>
    <rect x="290" y="550" width="220" height="38" rx="8" fill="#F7FAFC" stroke="#CBD5E0" stroke-width="2"/>
    <!-- Heel Counter Column -->
    <path d="M305 550 Q290 380 340 330 Q400 310 460 330 Q510 380 495 550 Z" fill="${fill}" stroke="${dark}" stroke-width="2.5"/>
    <!-- Pull Tab Ribbon -->
    <rect x="382" y="270" width="36" height="75" rx="4" fill="#E05A47" stroke="#9C2615" stroke-width="1.5"/>
    <text x="400" y="315" text-anchor="middle" font-size="9" font-weight="bold" fill="#FFFFFF" font-family="sans-serif" transform="rotate(-90 400 315)">ZW-RUN</text>
    <!-- Ankle Collar Cushioned Opening -->
    <ellipse cx="400" cy="335" rx="55" ry="18" fill="#1A202C" stroke="${dark}" stroke-width="2"/>
    <!-- Reflective Heel Strip -->
    <line x1="400" y1="360" x2="400" y2="520" stroke="#CBD5E0" stroke-width="8" stroke-linecap="round"/>
    <line x1="400" y1="360" x2="400" y2="520" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>
  `;
}

function shoeDetail(color, fill, name, id) {
  const dark = darken(color, 0.4);
  return `
    <!-- High-Traction Outsole Tread Macro -->
    <rect x="180" y="180" width="440" height="440" rx="24" fill="#1A202C" stroke="#2D3748" stroke-width="4"/>
    <!-- Waffle & Hex Grip Pattern -->
    ${[220, 280, 340, 400, 460, 520].map(y => `
      <line x1="210" y1="${y}" x2="590" y2="${y}" stroke="#4A5568" stroke-width="5" stroke-dasharray="14,14"/>
    `).join('')}
    <!-- Center Pivot Circle / Tech Branding -->
    <circle cx="400" cy="400" r="64" fill="#E05A47" stroke="#FFFFFF" stroke-width="3"/>
    <circle cx="400" cy="400" r="48" fill="#1A202C" stroke="#FFFFFF" stroke-width="1.5"/>
    <text x="400" y="398" text-anchor="middle" font-size="14" font-weight="bold" fill="#FFFFFF" font-family="sans-serif">GRIP-MAX</text>
    <text x="400" y="415" text-anchor="middle" font-size="9" fill="#A0AEC0" font-family="sans-serif">ALL-WEATHER</text>
  `;
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
  <defs>
    <!-- Soft Studio Radial Backdrop -->
    <radialGradient id="studio-bg" cx="50%" cy="45%" r="65%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="60%" stop-color="#F8FAFC"/>
      <stop offset="100%" stop-color="#E2E8F0"/>
    </radialGradient>
    <filter id="shadow-filter" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="10"/>
    </filter>
  </defs>
  ${patternDefs}
  
  <!-- Clean Studio Canvas -->
  <rect width="800" height="800" fill="url(#studio-bg)"/>
  
  <!-- Subtle Framing Pedestal / Vignette -->
  <circle cx="400" cy="400" r="340" fill="none" stroke="#E2E8F0" stroke-width="1.5" stroke-dasharray="8,6" opacity="0.6"/>
  
  <!-- Apparel / Footwear Artwork -->
  ${illustration}
  
  <!-- Minimalist Luxury Watermark / Tag -->
  <rect x="250" y="722" width="300" height="34" rx="17" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1" opacity="0.95"/>
  <text x="400" y="743" text-anchor="middle" font-size="11" font-weight="bold" fill="#1B2A4A" letter-spacing="1.5" font-family="sans-serif">${product.name.toUpperCase()}</text>
  <text x="400" y="775" text-anchor="middle" font-size="10" fill="#94A3B8" letter-spacing="1" font-family="sans-serif">${viewLabel.toUpperCase()} VIEW • DEMO STORE</text>
</svg>`;
}

// ─── Main ────────────────────────────────────────────────────

const productsPath = path.join(ROOT, 'src', 'data', 'products.json');
if (!fs.existsSync(productsPath)) {
  console.error('Error: src/data/products.json not found. Run generate-products.js first.');
  process.exit(1);
}

const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));

// Clean image directories before generating
['shirts', 'pants', 'shoes'].forEach(cat => {
  const catDir = path.join(ROOT, 'src', 'images', cat);
  if (fs.existsSync(catDir)) {
    fs.rmSync(catDir, { recursive: true, force: true });
  }
  fs.mkdirSync(catDir, { recursive: true });
});

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
