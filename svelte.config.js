import adapter from '@sveltejs/adapter-static';
import { kitDocsPlugin } from '@svelteness/kit-docs/node';
import preprocess from 'svelte-preprocess';
import Icons from 'unplugin-icons/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', '.md'],

  preprocess: preprocess({
    postcss: true
  }),

  kit: {
    adapter: adapter({
      fallback: 'index.html'
    }),

    paths: {
      base: process.env.SVELTE_BASE_PATH || ''
    },

    vite: {
      ssr: {
        noExternal: ['@felte/common']
      },
      plugins: [
        Icons({ compiler: 'svelte' }),
        kitDocsPlugin({
          shiki: {
            theme: 'one-dark-pro'
          }
        })
      ]
    },

    prerender: {
      default: true,
      entries: ['*'],
      onError: 'continue'
    }
  }
};

export default config;
