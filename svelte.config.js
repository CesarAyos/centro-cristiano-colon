import { sveltePreprocess } from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-vercel';
import adapterStatic from '@sveltejs/adapter-static';

const preprocess = sveltePreprocess({});
const isCapacitorBuild = process.env.CAPACITOR_BUILD === 'true';

export default {
  kit: {
    adapter: isCapacitorBuild ? adapterStatic({ fallback: 'index.html' }) : adapter(),
    prerender: {
      handleMissingId: 'warn',
    },
  },
  preprocess,
};
