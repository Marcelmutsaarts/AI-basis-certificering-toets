import type { Config } from 'tailwindcss';

/**
 * Tailwind v4 gebruikt CSS-first config via `@theme` blocks in app/globals.css.
 * Deze file is minimaal en bestaat alleen voor content-paths zodat tooling
 * (IDE, eslint, postcss) duidelijke scoping ziet.
 */
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
};

export default config;
