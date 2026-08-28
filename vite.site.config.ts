import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: 'site',
  publicDir: 'public',
  build: {
    outDir: '../dist/site',
    emptyOutDir: true,
    target: 'es2022',
    cssCodeSplit: true,
    rollupOptions: {
      input: {
        home: resolve('site/index.html'),
        privacy: resolve('site/privacy/index.html'),
        terms: resolve('site/terms/index.html')
      }
    }
  }
});
