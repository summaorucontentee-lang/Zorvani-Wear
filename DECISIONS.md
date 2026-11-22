# Zorvani Wear (DEMO) — Architectural & Design Decisions

This document logs all choices made where specifications allowed discretion or required sensible defaults.

## 1. Zero External Runtime Dependencies
- **Decision:** The entire website runs as pure static HTML, modern CSS, and vanilla ES modules with no client-side frameworks, build-step bundlers, or remote CDN fonts/scripts.
- **Rationale:** Guarantees instantaneous loading, 100% offline reliability, high security, and clean testability without compilation overhead.

## 2. Zero-Dependency Local Static Server
- **Decision:** Built `scripts/serve.js` using Node.js built-in `http` and `fs` modules rather than relying on third-party servers like `serve` or `http-server`.
- **Rationale:** Starts in under 10ms, correctly maps all required MIME types (`image/svg+xml`, `text/javascript`, etc.), handles clean 404 routing, and operates seamlessly within the testing sandbox.

## 3. Deterministic Algorithmic Product Data & SVG Generator
- **Decision:** Generated 66 products (22 Shirts, 22 Pants, 22 Shoes) deterministically using seeded arithmetic based on product ID and style names, and rendered 4 bespoke SVG illustrations per product (264 total SVGs).
- **Rationale:** Same input always yields the exact same product names, prices, colors, and SVG vectors across builds, ensuring full test reproducibility without downloading external stock assets.

## 4. IMAGES_PER_PRODUCT Constant
- **Decision:** Abstracted the number of views per product into a single configuration constant (`IMAGES_PER_PRODUCT = 4`) in `scripts/generate-images.js`, `src/js/config.js`, and data generators.
- **Rationale:** Fulfills the requirement to allow easy expansion (e.g. to 20 views) in the future with a single variable change.

## 5. Client-Side WhatsApp Order Simulation
- **Decision:** On checkout submit, form validation blocks invalid inputs. On valid submit, the order is persisted to `localStorage` under `zorvani_orders`, the cart is cleared, `window.open` is invoked with a `wa.me` URL containing an encoded receipt, and the user is routed to `thankyou.html?orderId=...`.
- **Rationale:** Provides an interactive e-commerce flow simulating direct-to-consumer WhatsApp ordering commonly used by boutique Indian fashion stores, with zero payment gateway complexity.

## 6. Currency & Localized Formatting
- **Decision:** Formatted all prices using `new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })`.
- **Rationale:** Strict adherence to project constraints: INR only, no cents/paise decimals (e.g. ₹1,499), and standard Indian numbering grouping.

## 7. Reviews Section Policy
- **Decision:** Provided a clearly labeled empty reviews section titled `Customer Reviews` with the exact notice: `"Reviews: no reviews yet (demo)"`.
- **Rationale:** Strictly honors the guideline forbidding fabricated star ratings, fake review counts, or countdown timers.

## 8. Test Runner Configuration
- **Decision:** Used Node.js native test runner (`node --test`) for lightning-fast unit tests (46 tests, 0 dependencies), and `@playwright/test` for multi-device end-to-end browser testing (Desktop Chrome and Mobile Chrome viewport).
- **Rationale:** Clean, minimal dev dependencies without bloat.

## 9. Cloud Static Hosting Deployment (Vercel / Netlify)
- **Decision:** Added `vercel.json` configuring `outputDirectory: "src"` so the static assets in `src/` are served at the domain root. Added `scripts/build.js` which generates data, SVGs, sitemap, and runs unit tests; if running in cloud CI/CD environments (Vercel/Netlify where `process.env.VERCEL` is set), it skips the local headless browser launcher so deployment builds succeed instantly without requiring Linux browser binaries.
- **Rationale:** Standard static cloud providers do not include Playwright browser binaries in their default serverless build environments.

## 10. Top Brands Catalog Integration
- **Decision:** Integrated top global brand names (Shirts: Zara, Ralph Lauren, Tommy Hilfiger, Calvin Klein, Raymond, etc.; Pants: Levi's, Wrangler, Lee, Dockers, Pepe Jeans, etc.; Shoes: Nike, Adidas, Puma, Vans, Converse, Woodland, etc.) into product titles and descriptions across all 66 products while retaining the mandatory top demo banner ("DEMO STORE: no real products, no real payments") on every page.
- **Rationale:** Directly fulfills user request to showcase recognizable top brand naming styles across the catalog.
