import { chromium } from '@playwright/test';
import { readFile, mkdir } from 'node:fs/promises';

const svg = await readFile(new URL('../public/icon.svg', import.meta.url), 'utf8');
const browser = await chromium.launch();
const page = await browser.newPage();
await mkdir(new URL('../public/icons/', import.meta.url), { recursive: true });
for (const size of [192, 512]) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(`<html><body style="margin:0;background:#d6f387">${svg.replace('<svg ', `<svg width="${size}" height="${size}" `)}</body></html>`);
  await page.screenshot({ path: `public/icons/icon-${size}.png` });
}
await page.setContent(`<html><body style="margin:0;background:#d6f387;display:grid;place-items:center;width:512px;height:512px">${svg.replace('<svg ', '<svg width="410" height="410" ')}</body></html>`);
await page.screenshot({ path: 'public/icons/maskable-512.png' });
await browser.close();