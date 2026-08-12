import { supabase } from '$lib/supabaseClient';

export async function GET() {
  let predicas = [];

  try {
    const { data, error } = await supabase.from('predicas').select('slug');
    if (!error && data) {
      predicas = data;
    }
  } catch (err) {
    console.error("Error cargando datos de Supabase:", err);
  }

  // ✅ CORREGIDO: Namespace completo
  const xmlNamespace = 'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"';
  
  // ✅ CORREGIDO: Tu dominio correcto
  const miDominio = 'https://centro-cristiano-colon.vercel.app';

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset ${xmlNamespace}>
  <url>
    <loc>${miDominio}/</loc>
  </url>
  <url>
    <loc>${miDominio}/ubicanos</loc>
  </url>
  ${predicas.map(p => `
  <url>
    <loc>${miDominio}/predicas/${p.slug}</loc>
  </url>`).join('')}
</urlset>`.trim();

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600' // Opcional: cache por 1 hora
    }
  });
}