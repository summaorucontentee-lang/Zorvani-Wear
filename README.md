# Zorvani Wear (DEMO) 🛍️

A clean, responsive, lightweight demo fashion e-commerce website built with vanilla HTML, modern CSS, and plain JavaScript (ES modules).

> **IMPORTANT:** Everything on this site is fictional and for demonstration purposes only. Brand name, products, prices, reviews, and addresses are simulated.

---

## 🚀 Features

- **Brand & Theme:** Zorvani Wear (DEMO) in Indian Rupee (INR ₹), deep navy (`#1B2A4A`) primary, coral (`#FF6B6B`) accent, mobile-first responsive layout.
- **60+ Products (Deterministic Data):** 22 Shirts, 22 Pants, and 22 Shoes generated algorithmically from natural clothing styles, colors, and realistic price bands (INR 499–5,999).
- **Original Vector SVG Graphics:** 264 bespoke SVG product illustrations (4 views per product: front, back, detail, side) generated deterministically with zero external asset dependencies.
- **Shop & Faceted Navigation:** Instant client-side filtering by category, size, color, and price range, sorting (low to high, high to low, newest), real-time search, and pagination ("Load More").
- **Product Details & Gallery:** Interactive multi-angle image gallery with thumbnail clicks and keyboard arrow key navigation, size & color selectors, validation guarding Add to Cart, size guide tables, and related items.
- **Persistent Shopping Cart:** LocalStorage cart that survives page reloads, updates cart counts across tabs, handles line-item quantity changes and removals.
- **Demo Checkout & WhatsApp Integration:** Indian mobile and pincode form validation, order summary compilation, and automated generation of pre-filled WhatsApp (`wa.me`) order requests.
- **Order History:** LocalStorage order ledger with clear history options.
- **DataLayer Analytics:** Tracks standard e-commerce events (`view_item_list`, `view_item`, `add_to_cart`, `remove_from_cart`, `view_cart`, `begin_checkout`, `generate_lead`, `purchase`).
- **Zero-Dependency Static Server:** Built-in lightweight Node server with zero external runtime dependencies.

---

## 🛠️ Quick Start & Installation

### Prerequisites
- Node.js (v18 or higher recommended; developed and tested on Node v22)
- npm (v9+)

### Installation
Clone or open this repository, then install dev dependencies (used only for Playwright testing):
```bash
npm install
```

---

## 💻 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Launches the local static development server at `http://localhost:3000/` |
| `npm run generate` | Deterministically generates all 264 SVG product images into `src/images/` |
| `npm run generate:data` | Generates 66 demo products into `src/data/products.js` and `products.json` |
| `npm run generate:sitemap` | Generates `src/sitemap.xml` and `src/robots.txt` |
| `npm test` | Runs all 46 unit tests using Node.js native test runner |
| `npm run test:e2e` | Runs comprehensive Playwright E2E browser tests (Desktop & Mobile viewports) |
| `npm run build` | Re-generates all data, images, sitemaps, and executes the complete test suite |
| `npm run verify` | Full verification pipeline (exits with error if any test or generator fails) |

---

## 📂 Project Structure

```
zorvani-wear/
├── src/
│   ├── index.html            # Homepage (Hero, Categories, Featured, How It Works)
│   ├── shop.html             # Product catalog with filter sidebar, sort, & search
│   ├── product.html          # Product detail page with gallery & size guide
│   ├── cart.html             # Interactive cart page with line item management
│   ├── checkout.html         # Demo checkout with real input validation
│   ├── thankyou.html         # Order confirmation & receipt page
│   ├── orders.html           # Local demo order history
│   ├── about.html            # Fictional brand story & technical details
│   ├── shipping.html         # Demo shipping policy
│   ├── returns.html          # Demo returns policy
│   ├── privacy.html          # Client-side privacy policy
│   ├── contact.html          # Demo contact page
│   ├── 404.html              # Custom 404 error page
│   ├── sitemap.xml           # XML Sitemap
│   ├── robots.txt            # Search engine directives
│   ├── css/
│   │   └── style.css         # Complete mobile-first stylesheet
│   ├── js/
│   │   ├── config.js         # Configuration, formatting, and constants
│   │   ├── cart.js           # LocalStorage cart management module
│   │   ├── filters.js        # Product filtering, sorting, and search logic
│   │   ├── validation.js     # Form input validators (phone, pincode, etc.)
│   │   ├── orders.js         # Demo order generator and WhatsApp link builder
│   │   ├── dataLayer.js      # E-commerce analytics tracking module
│   │   ├── header.js         # Shared header/footer controller and cart counter
│   │   ├── shop.js           # Shop page interaction logic
│   │   ├── product.js        # Product detail gallery and size selection logic
│   │   ├── cart-page.js      # Cart table controller
│   │   ├── checkout.js       # Checkout form submission and validation logic
│   │   ├── thankyou.js       # Receipt rendering and purchase event trigger
│   │   └── orders-page.js    # Order history controller
│   ├── data/
│   │   ├── products.js       # 66 demo products (ES module)
│   │   └── products.json     # 66 demo products (JSON)
│   └── images/
│       ├── shirts/           # 88 SVG illustrations (22 items × 4 views)
│       ├── pants/            # 88 SVG illustrations (22 items × 4 views)
│       └── shoes/            # 88 SVG illustrations (22 items × 4 views)
├── scripts/
│   ├── generate-products.js  # Product data generation script
│   ├── generate-images.js    # SVG illustration generator
│   ├── generate-sitemap.js   # Sitemap & robots.txt generator
│   └── serve.js              # Zero-dependency local static HTTP server
├── tests/
│   ├── unit/                 # 46 unit tests (config, cart, filters, validation, orders, SVGs)
│   └── e2e/                  # Playwright end-to-end tests (Desktop & Mobile)
├── DECISIONS.md              # Architectural decisions and tradeoffs
├── TEST-SUMMARY.md           # Test suite execution results and report
└── package.json
```

---

## 🌐 Free Deployment Guide

Because Zorvani Wear is 100% static with zero backend dependencies, it can be deployed anywhere for free in seconds.

### 1. Deploying to Netlify (Recommended)
1. Push your repository to GitHub / GitLab.
2. Log into [Netlify](https://app.netlify.com/) and click **"Add new site" > "Import an existing project"**.
3. Select your repository.
4. Set the following build settings:
   - **Base directory:** Leave empty (root)
   - **Build command:** `node scripts/generate-products.js && node scripts/generate-images.js && node scripts/generate-sitemap.js`
   - **Publish directory:** `src`
5. Click **Deploy Site**. Your site will be live immediately with an SSL certificate.

### 2. Deploying to GitHub Pages
1. In your GitHub repository, go to **Settings > Pages**.
2. Under **Build and deployment > Source**, select **GitHub Actions**.
3. Use a simple static deployment workflow that publishes the `/src` folder:
```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: node scripts/generate-products.js && node scripts/generate-images.js && node scripts/generate-sitemap.js
      - uses: actions/upload-pages-artifact@v3
        with:
          path: 'src/'
      - id: deployment
        uses: actions/deploy-pages@v4
```

---

## 📄 License

ISC License. Demo project developed for educational and portfolio demonstration purposes.
