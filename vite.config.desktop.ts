import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import electron from 'vite-plugin-electron/simple';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    electron({
      main: { entry: 'electron/main.ts' },
      preload: { input: path.join(path.dirname(fileURLToPath(import.meta.url)), 'electron/preload.ts') },
      renderer: {},
    }),
  ],
});
