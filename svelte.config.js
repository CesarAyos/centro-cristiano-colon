// svelte.config.js
import { sveltePreprocess } from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-auto';

const preprocess = sveltePreprocess({
  // Opciones de preprocess aquí (por ejemplo, postcss, scss, etc.)
});

export default {
  kit: {
    // Configuración del kit
    adapter: adapter(),
  },
  preprocess,
};
