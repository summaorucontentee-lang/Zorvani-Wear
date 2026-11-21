// Zorvani Wear (DEMO) - Sitemap & Robots Generator
// Generates src/sitemap.xml and src/robots.txt from product data.
// Run: node scripts/generate-sitemap.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const BASE_URL = 'https://zorvaniwear.demo';

// ─── Load products ───────────────────────────────────────────────────

const productsPath = path.join(ROOT, 'src', 'data', 'products.json');
if (!fs.existsSync(productsPath)) {
  console.error('Error: src/data/products.json not found. Run generate-products.js first.');
  process.exit(1);
}

const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));

// ─── Static pages ────────────────────────────────────────────────────

const staticPages = [
  { loc: '/', changefreq: 'daily', priority: '1.0' },
  { loc: '/shop.html', changefreq: 'daily', priority: '0.9' },
  { loc: '/shop.html?category=shirts', changefreq: 'weekly', priority: '0.8' },
  { loc: '/shop.html?category=pants', changefreq: 'weekly', priority: '0.8' },
  { loc: '/shop.html?category=shoes', changefreq: 'weekly', priority: '0.8' },
  { loc: '/about.html', changefreq: 'monthly', priority: '0.5' },
  { loc: '/contact.html', changefreq: 'monthly', priority: '0.5' },
  { loc: '/shipping.html', changefreq: 'monthly', priority: '0.4' },
  { loc: '/returns.html', changefreq: 'monthly', priority: '0.4' },
  { loc: '/privacy.html', changefreq: 'monthly', priority: '0.3' },
];

// ─── Build sitemap XML ──────────────────────────────────────────────

const today = new Date().toISOString().split('T')[0];

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

// Static pages
for (const page of staticPages) {
  xml += `  <url>
    <loc>${BASE_URL}${page.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
}

// Product pages
for (const product of products) {
  xml += `  <url>
    <loc>${BASE_URL}/product.html?slug=${product.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`;
}

xml += `</urlset>
`;

// ─── Build robots.txt ────────────────────────────────────────────────

const robotsTxt = `# Robots.txt for ${BASE_URL}
# This is a DEMO site — not a real store.

User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml
`;

// ─── Write files ─────────────────────────────────────────────────────

const srcDir = path.join(ROOT, 'src');
fs.mkdirSync(srcDir, { recursive: true });

fs.writeFileSync(path.join(srcDir, 'sitemap.xml'), xml, 'utf-8');
console.log(`Written: src/sitemap.xml (${staticPages.length} static + ${products.length} product URLs)`);

fs.writeFileSync(path.join(srcDir, 'robots.txt'), robotsTxt, 'utf-8');
console.log('Written: src/robots.txt');

console.log('Sitemap generation complete.');
