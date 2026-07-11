import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', '.md'],

  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter({
      fallback: 'index.html',
      pages: 'build',
      assets: 'build'
    }),

    paths: {
      base: process.env.SVELTE_BASE_PATH || ''
    },
  }
};

export default config;
