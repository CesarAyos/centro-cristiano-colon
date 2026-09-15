const pages = [
  { url: '/', changefreq: 'weekly', priority: 1.0 },
  { url: '/adn', changefreq: 'monthly', priority: 0.8 },
  { url: '/biblia', changefreq: 'weekly', priority: 0.8 },
  { url: '/envivo', changefreq: 'weekly', priority: 0.7 },
  { url: '/fundadores', changefreq: 'monthly', priority: 0.6 },
  { url: '/misiones', changefreq: 'monthly', priority: 0.7 },
  { url: '/predica', changefreq: 'weekly', priority: 0.8 },
  { url: '/reflexiones', changefreq: 'daily', priority: 0.9 },
  { url: '/ubicanos', changefreq: 'monthly', priority: 0.6 }
];

export function GET() {
  const base = 'https://centro-cristiano-colon.vercel.app';
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(p => `  <url>
    <loc>${base}${p.url}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
