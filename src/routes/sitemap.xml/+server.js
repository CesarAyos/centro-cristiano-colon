// src/routes/sitemap.xml/+server.js

export async function GET() {
  const miDominio = 'https://centro-cristiano-colon.vercel.app';
  
  // Todas tus URLs estáticas
  const urls = [
    '/',
    '/adn',
    '/biblia', 
    '/envivo',
    '/fundadores',
    '/misiones',
    '/predica',
    '/reflexiones',
    '/ubicanos'
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.map(url => `
  <url>
    <loc>${miDominio}${url}</loc>
  </url>`).join('')}
</urlset>`.trim();

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600' 
    }
  });
}