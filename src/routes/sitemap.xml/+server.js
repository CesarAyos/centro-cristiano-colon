import { supabase } from '$lib/supabaseClient'; // Ajusta la ruta a tu cliente de Supabase

export async function GET() {
  // Ejemplo: Traer los slugs de las prédicas desde Supabase
  const { data: predicas } = await supabase.from('predicas').select('slug');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://sitemaps.org">
      <url><loc>https://centro-cristiano-colon.vercel.app/</loc></url>
      <url><loc>https://vercel.app</loc></url>
      ${predicas ? predicas.map(p => `<url><loc>https://vercel.app{p.slug}</loc></url>`).join('') : ''}
    </urlset>`.trim();

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml'
    }
  });
}
