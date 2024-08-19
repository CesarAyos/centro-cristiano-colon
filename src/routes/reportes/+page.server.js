import { supabase } from '$lib/supabaseClient';

export async function load() {
  const { data, error } = await supabase.from('planilla').select('*');
  if (error) {
    console.error('Error fetching data:', error);
    return { planilla: [] };
  }
  return { planilla: data };
}
