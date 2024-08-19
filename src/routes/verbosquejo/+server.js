import { supabase } from "$lib/supabaseClient.js";

export async function GET() {
    const { data, error } = await supabase
      .storage
      .from('imagenes')
      .list('bosquejo', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' },
      });
  
    if (error) {
      console.error('Error fetching data:', error);
      return new Response('Ha ocurrido un error al obtener las imágenes', { status: 500 });
    } else {
      const imagesWithUrls = await Promise.all(data.map(async image => {
        const { data, error } = await supabase.storage.from('imagenes').getPublicUrl(`bosquejo/${image.name}`);
        
        if (error) {
          console.error('Error obteniendo la URL de la imagen:', error);
          return null;
        }
        
        const url = data.publicUrl;
        return {
          name: image.name,
          url
        };
      }));
      
      const validImages = imagesWithUrls.filter(image => image !== null && image.url !== undefined && image.name !== '.emptyFolderPlaceholder');
  
      return new Response(JSON.stringify({ images: validImages }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }