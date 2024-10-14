import { sveltePreprocess } from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-auto';

const preprocess = sveltePreprocess({});

export default {
  kit: {
    adapter: adapter(),
    prerender: {
      crawl: true,
    },
  },
  preprocess,
};
