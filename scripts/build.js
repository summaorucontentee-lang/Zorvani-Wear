// Build script for Zorvani Wear
import { execSync } from 'child_process';

console.log('--- Step 1: Generating Product Data ---');
execSync('npm run generate:data', { stdio: 'inherit' });

console.log('--- Step 2: Generating SVG Illustrations ---');
execSync('npm run generate', { stdio: 'inherit' });

console.log('--- Step 3: Generating Sitemap & Robots ---');
execSync('npm run generate:sitemap', { stdio: 'inherit' });

console.log('--- Step 4: Running Unit Tests ---');
execSync('npm test', { stdio: 'inherit' });

if (process.env.VERCEL || process.env.NETLIFY || process.env.CI || process.env.NOW_BUILDER) {
  console.log('Vercel/Netlify/CI deployment environment detected: skipping Playwright browser test run.');
} else {
  console.log('--- Step 5: Running End-to-End Tests ---');
  execSync('npm run test:e2e', { stdio: 'inherit' });
}

console.log('--- Build Finished Successfully ---');
