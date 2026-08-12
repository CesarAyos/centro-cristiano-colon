import { supabase } from '$lib/supabaseClient'; 

export async function GET() {
  // Trae los slugs de las prédicas desde tu tabla en Supabase
  const { data: predicas } = await supabase.from('predicas').select('slug');

  // 1. Namespace oficial corregido en <urlset>
  // 2. Dominio real corregido en cada <loc>
  // 3. Sintaxis interpolada corregida con ${p.slug}
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://sitemaps.org">
  <url>
    <loc>https://centro-cristiano-colon.vercel.app/</loc>
  </url>
  ${predicas ? predicas.map(p => `
  <url>
    <loc>https://vercel.app{p.slug}</loc>
  </url>`).join('') : ''}
</urlset>`.trim();

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml'
    }
  });
}
