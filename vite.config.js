import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

export default defineConfig({
  base: './',
  plugins: [{
    name: 'offline-app-shell',
    generateBundle(_, bundle) {
      const assets = Object.keys(bundle).filter(name => name !== 'sw.js');
      const worker = readFileSync(new URL('./public/sw.js', import.meta.url), 'utf8');
      const hash = createHash('sha256').update(worker);
      for (const asset of Object.values(bundle)) hash.update(asset.type === 'chunk' ? asset.code : asset.source);
      for (const file of ['index.html', 'public/manifest.webmanifest', 'public/icon.svg', 'public/artwork.jpg', 'public/icons/icon-192.png', 'public/icons/icon-512.png', 'public/icons/maskable-512.png']) {
        hash.update(readFileSync(new URL(file, import.meta.url)));
      }
      const version = hash.digest('hex').slice(0, 12);
      const source = worker
        .replace("'v1'", `'${version}'`)
        .replace('const ASSETS = [];', `const ASSETS = ${JSON.stringify(assets)};`);
      this.emitFile({ type: 'asset', fileName: 'sw.js', source });
    },
  }],
});