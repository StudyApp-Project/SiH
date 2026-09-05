/**
 * vitest.config.ts — Vitest configuration with IndexedDB polyfill
 */

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom', // Use jsdom for browser APIs (IndexedDB, etc.)
    globals: true,
  },
});
