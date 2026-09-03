import { sveltePreprocess } from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-static';

const preprocess = sveltePreprocess({});

export default {
  kit: {
    adapter: adapter({
      fallback: 'index.html',
    }),
    prerender: {
      handleMissingId: 'warn',
    },
  },
  preprocess,
};
