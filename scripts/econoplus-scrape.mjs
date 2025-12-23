import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

const sourceUrl = process.env.ECONOPLUS_URL ?? 'https://www.econoplus.com/';

const response = await fetch(sourceUrl, {
  headers: {
    'User-Agent': 'EconoDealBot/1.0 (+https://github.com/)'
  }
});

if (!response.ok) {
  throw new Error(`Failed to fetch ${sourceUrl}: ${response.status} ${response.statusText}`);
}

const html = await response.text();
const productLinks = new Set();
const linkRegex = /href="([^"]+)"/gi;

for (const match of html.matchAll(linkRegex)) {
  const href = match[1];
  if (!/product|produit|produits|promo|liquidation/i.test(href)) {
    continue;
  }
  try {
    const resolved = new URL(href, sourceUrl).toString();
    productLinks.add(resolved);
  } catch (error) {
    console.warn(`Skipping invalid URL: ${href}`);
  }
  if (productLinks.size >= 50) {
    break;
  }
}

const payload = {
  source_url: sourceUrl,
  fetched_at: new Date().toISOString(),
  html_length: html.length,
  html_preview: html.slice(0, 5000),
  product_links: Array.from(productLinks)
};

const outputDir = path.join(process.cwd(), 'data');
await mkdir(outputDir, { recursive: true });
await writeFile(
  path.join(outputDir, 'econoplus.json'),
  `${JSON.stringify(payload, null, 2)}\n`,
  'utf8'
);

console.log(`Saved ${payload.product_links.length} links from ${sourceUrl}`);
