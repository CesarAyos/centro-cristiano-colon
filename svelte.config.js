import { sveltePreprocess } from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-vercel';

const preprocess = sveltePreprocess({});

export default {
  kit: {
    adapter: adapter(),
    prerender: {
      handleMissingId: 'warn',
    },
  },
  preprocess,
};
