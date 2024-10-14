const sitemap = require('sveltekit-sitemap');

async function generateSitemap() {
  await sitemap({
    config: 'svelte.config.js',
    hostname: 'https://example.com', // Cambia esto a tu dominio
  });
}

generateSitemap().catch(console.error);
