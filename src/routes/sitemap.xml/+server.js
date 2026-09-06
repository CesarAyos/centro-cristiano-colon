export const prerender = true;

function xmlEscape(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

async function getReflexionUrls() {
  const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !anonKey) return [];
  try {
    const res = await fetch(
      `${supabaseUrl.replace(/\/$/, '')}/rest/v1/reflexiones?select=id&order=created_at.desc&limit=100`,
      {
        headers: {
          apikey: anonKey,
          Authorization: `Bearer ${anonKey}`,
        },
      }
    );
    if (!res.ok) return [];
    const rows = await res.json();
    return Array.isArray(rows) ? rows.map((r) => `/reflexiones?id=${r.id}`) : [];
  } catch (e) {
    console.error('Error listando reflexiones para el sitemap:', e);
    return [];
  }
}

export async function GET() {
  const miDominio =
    (import.meta.env.VITE_PUBLIC_SITE_URL || 'https://centro-cristiano-colon.vercel.app').replace(/\/$/, '');

  const hoy = new Date().toISOString().slice(0, 10);

  const urls = [
    { loc: '/', changefreq: 'weekly', priority: '1.0' },
    { loc: '/adn', changefreq: 'monthly', priority: '0.8' },
    { loc: '/biblia', changefreq: 'weekly', priority: '0.8' },
    { loc: '/envivo', changefreq: 'weekly', priority: '0.7' },
    { loc: '/fundadores', changefreq: 'monthly', priority: '0.6' },
    { loc: '/misiones', changefreq: 'monthly', priority: '0.7' },
    { loc: '/predica', changefreq: 'weekly', priority: '0.8' },
    { loc: '/reflexiones', changefreq: 'daily', priority: '0.9' },
    { loc: '/ubicanos', changefreq: 'monthly', priority: '0.6' },
  ];

  const reflexionUrls = await getReflexionUrls();
  for (const url of reflexionUrls) {
    urls.push({ loc: url, changefreq: 'weekly', priority: '0.7' });
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls
    .map(
      (u) => `  <url>
    <loc>${miDominio}${xmlEscape(u.loc)}</loc>
    <lastmod>${hoy}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
    )
    .join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}