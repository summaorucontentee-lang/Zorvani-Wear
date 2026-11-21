import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..');

import { products } from '../../src/data/products.js';
import { IMAGES_PER_PRODUCT } from '../../src/js/config.js';

describe('Product SVG Images Verification', () => {
  it('should have 60+ products in total across 3 categories', () => {
    assert.ok(products.length >= 60, `Expected >= 60 products, got ${products.length}`);
    const shirts = products.filter(p => p.category === 'Shirts');
    const pants = products.filter(p => p.category === 'Pants');
    const shoes = products.filter(p => p.category === 'Shoes');

    assert.ok(shirts.length >= 20, `Expected >= 20 shirts, got ${shirts.length}`);
    assert.ok(pants.length >= 20, `Expected >= 20 pants, got ${pants.length}`);
    assert.ok(shoes.length >= 20, `Expected >= 20 shoes, got ${shoes.length}`);
  });

  it('every product must have exactly IMAGES_PER_PRODUCT (4) image paths', () => {
    for (const product of products) {
      assert.ok(Array.isArray(product.images), `Product ${product.name} images should be an array`);
      assert.strictEqual(
        product.images.length,
        IMAGES_PER_PRODUCT,
        `Product ${product.name} should have ${IMAGES_PER_PRODUCT} images`
      );
    }
  });

  it('every image file referenced by products must exist on disk and be valid SVG', () => {
    let checkedCount = 0;
    for (const product of products) {
      for (const imgPath of product.images) {
        // imgPath is like '/images/shirts/...'
        const cleanPath = imgPath.startsWith('/') ? imgPath.slice(1) : imgPath;
        const fullDiskPath = path.join(ROOT, 'src', cleanPath);

        assert.ok(fs.existsSync(fullDiskPath), `Image file must exist: ${fullDiskPath}`);

        const content = fs.readFileSync(fullDiskPath, 'utf-8');
        assert.ok(content.includes('<svg'), `File ${imgPath} must contain <svg tag`);
        assert.ok(content.includes('</svg>'), `File ${imgPath} must contain closing </svg> tag`);
        assert.ok(content.includes('viewBox="0 0 800 800"'), `File ${imgPath} must have 800x800 viewBox`);
        assert.ok(content.includes('<title>'), `File ${imgPath} must include <title> for accessibility`);
        assert.ok(content.includes('<desc>'), `File ${imgPath} must include <desc> for accessibility`);

        checkedCount++;
      }
    }

    assert.strictEqual(checkedCount, products.length * IMAGES_PER_PRODUCT);
  });
});
