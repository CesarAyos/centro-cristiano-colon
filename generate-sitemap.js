import { sitemap } from 'sveltekit-sitemap';

async function generateSitemap() {
  await sitemap({
    config: 'svelte.config.js',
    hostname: 'https://centro-cristiano-colon.vercel.app/', // Cambia esto a tu dominio
  });
}

generateSitemap().catch(console.error);
