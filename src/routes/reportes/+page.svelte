<script>
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabaseClient';

  let planilla = [];
  let nuevos = [];

  onMount(async () => {
    try {
      const { data: planillaData, error: planillaError } = await supabase.from('planilla').select('*');
      if (planillaError) throw planillaError;
      planilla = planillaData;

      const { data: nuevosData, error: nuevosError } = await supabase.from('nuevos').select('*');
      if (nuevosError) throw nuevosError;
      nuevos = nuevosData;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  });


  
  async function deleteItem(item) {
    try {
      const { error } = await supabase.from('nuevos').delete().eq('id', item.id);
      if (error) throw error;
      nuevos = nuevos.filter(nuevo => nuevo.id !== item.id);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  }

  async function deletePlanilla(item) {
    try {
      const { error } = await supabase.from('planilla').delete().eq('id', item.id);
      if (error) throw error;
      planilla = planilla.filter(planillaItem => planillaItem.id !== item.id);
    } catch (error) {
      console.error('Error deleting item from planilla:', error);
    }
  }

</script>

<div class="text-center bg-dark">
  <p class="text-white fs-1 pt-5">Reportes Grupos Biblicos</p>
  </div>

<div class="container ">
  <div class="card row" >
    {#each planilla as item}
      <div class="card d-flex justify-content-center mb-4" style="background: #333333;" >
        <div class="d-flex justify-content-center m-2" style="background: #333333;">
          <img src="/logo.png" style="width: 50px;" alt="logo" class="logo-form" />
          <h2 class="d-flex justify-content-center m-2 text-white">REPORTES DE GRUPOS BÍBLICOS</h2>
        </div>
        
        <div class="card-body"style="background: #333333;" >
          <form class="row g-3">
            <div class="form-group col-md-2">
              <p class="text-white">Felipe Lider: {item.FELIPE_LIDER}</p>
            </div>
            <div class="form-group col-md-2">
              <p class="text-white">Asistencia VEA: {item.Asistencia_vea}</p>
            </div>
            <div class="form-group col-md-2">
              <p class="text-white">Asistentes GB: {item.asistentes}</p>
            </div>
            <div class="form-group col-md-2">
              <p class="text-white">Felipes: {item.Felipes}</p>
            </div>
            <div class="form-group col-md-2">
              <p class="text-white">Etiopes: {item.Etiopes}</p>
            </div>
            <div class="form-group col-md-2">
              <p class="text-white">Novedades: {item.novedades}</p>
            </div>
            <div class="form-group col-md-2">
              <p class="text-white">Amigos: {item.Amigos}</p>
            </div>
            <div class="form-group col-md-2">
              <p class="text-white">Niños: {item.Ninos}</p>
            </div>
            <div class="form-group col-md-2">
              <p class="text-white">Ausentes: {item.Ausentes}</p>
            </div>
            <div class="form-group col-md-2">
              <p class="text-white">Convertidos Adultos: {item.Convertidos_adultos}</p>
            </div>
            <div class="form-group col-md-2">
              <p class="text-white">Convertidos Nños: {item.Convertidos_ninos}</p>
            </div>
            <div class="form-group col-md-2">
              <p class="text-white">Reconciliados: {item.Reconciliados}</p>
            </div>
            <div class="form-group col-md-2">
              <p class="text-white">Diezmos: {item.Diezmos}</p>
            </div>
            <div class="form-group col-md-2">
              <p class="text-white">Ofrendas: {item.Ofrendas}</p>
            </div>
            <div class="form-group col-md-2">
              <p class="text-white">Total: {item.Total_financiero}</p>
            </div>
            <div class="form-group col-md-2">
              <p class="text-white">Mision Amigo: {item.Participacion_Mision_Amigo}</p>
            </div>
            <div class="form-group col-md-2">
              <p class="text-white">Consolidacion: {item.Participacion_Consolidacion}</p>
            </div>
            <div class="form-group col-md-2">
              <p class="text-white">d1 / d2: {item.Participacion_Discipulado_1}</p>
            </div>
            <div class="form-group col-md-2">
              <p class="text-white">Escuela de Liderazgo: {item.Asistencia_a_la_Escuela_de_Liderazgo}</p>
            </div>
            <div class="form-group col-md-2">
              <p class="text-white">Asistencia de hermanoss: {item.asistencia_hermanos}</p>
            </div>
            <div class="form-group col-md-2">
              <p class="text-white">Asistencia de amigos: {item.Asistencia_de_Amigos}</p>
            </div>
            <div class="form-group col-md-2">
              <p class="text-white">Asistencia de Niños: {item.Asistencia_de_Ninos}</p>
            </div>
            <button type="button" on:click={() => deletePlanilla(item)} class="btn btn-danger">Eliminar</button>
          </form>
        </div>
      </div>
    {/each}
  </div>
</div>

<div class="text-center bg-dark">
<p class="text-white fs-1">Nuevos Amigos</p>
</div>
<div class="container p-4">
  <div class="card row" >
    {#each nuevos as item}
      <div class="card d-flex justify-content-center p-2 mb-4" style="background: #333333;" >
        <div class="d-flex justify-content-center m-2" style="background: #333333;">
          <img src="/logo.png" style="width: 50px;" alt="logo" class="logo-form" />
          <h2 class="d-flex justify-content-center m-2 text-white">Nuevos Amigos</h2>
        </div>
        
        <div class="card-body"style="background: #333333;" >
          <form class="row g-3">
            <div class="form-group col-md-2">
              <p class="text-white">Felipe Lider: {item.nombrelidernuevo}</p>
            </div>
            <div class="form-group col-md-2">
              <p class="text-white">Asistencia VEA: {item.nombregruponuevo}</p>
            </div>
            <div class="form-group col-md-2">
              <p class="text-white">Asistentes GB: {item.nombresnuevo}</p>
            </div>
            <div class="form-group col-md-2">
              <p class="text-white">Felipes: {item.apellidosnuevo}</p>
            </div>
            <div class="form-group col-md-2">
              <p class="text-white">Etiopes: {item.direccionnuevo}</p>
            </div>
            <div class="form-group col-md-2">
              <p class="text-white">Novedades: {item.edadnuevo}</p>
            </div>
            <div class="form-group col-md-2">
              <p class="text-white">Amigos: {item.telefononuevo}</p>
            </div>
            <button type="button" on:click={() => deleteItem(item)} class="btn btn-danger">Eliminar</button>
          </form>
        </div>
      </div>
    {/each}
  </div>
</div>
