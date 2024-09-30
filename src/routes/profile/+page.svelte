<script>
  import { supabase } from "../../components/supabase.js";
  import { onMount } from "svelte";

  let user = null;
  let userName = "";

  onMount(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || !session.user) {
      window.location.href = "/login";
    } else {
      user = session.user;
      userName = user.user_metadata.full_name || user.email; // Usa el nombre completo si está disponible, de lo contrario usa el email
    }
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };
</script>

<main class="p-5">
  <div class="d-flex justify-content-center m-5">
    <div
      class="list-group p-4"
      style="width: 25rem;background: linear-gradient(360deg, rgba(243, 240, 240, 0.055) 10%, #333333 90%);"
    >
      <p class="text-white text-center">Bienvenido, {userName}</p>
      <a href="planilla" class=" text-center text-decoration-none fs-5 m-2">
        <button
          type="button"
          class="list-group-item list-group-item-action text-dark"
          style="border-radius:20px;">Reporte de Grupo Biblico</button
        ></a
      >
      <a href="nuevos" class="text-center text-decoration-none fs-5 m-2">
        <button
          type="button"
          class="list-group-item list-group-item-action text-dark"
          style="border-radius:20px;">Reporte de Personas Nuevas</button
        ></a
      >
      <a href="reportes" class="text-center text-decoration-none fs-5 m-2">
        <button
          type="button"
          class="list-group-item list-group-item-action text-dark"
          style="border-radius:20px;">Ver Reportes</button
        ></a
      >
      <a href="verbosquejoadmin" class="text-center text-decoration-none fs-5 m-2">
        <button
          type="button"
          class="list-group-item list-group-item-action text-dark"
          style="border-radius:20px;">Ver bosquejo</button
        ></a
      >
      <a href="vervideoadmin" class="text-center text-decoration-none fs-5 m-2">
        <button
          type="button"
          class="list-group-item list-group-item-action text-dark"
          style="border-radius:20px;">Ver Video</button
        ></a
      >
      <a
        href="bosquejos"
        class="text-center text-decoration-none fs-5 m-2"
      >
        <button
          type="button"
          class="list-group-item list-group-item-action text-dark"
          style="border-radius:20px;">Subir Bosquejos</button
        ></a
      >
      <a
        href="subirvideos"
        class="text-center text-decoration-none fs-5 m-2"
      >
        <button
          type="button"
          class="list-group-item list-group-item-action text-dark"
          style="border-radius:20px;">Subir Video</button
        ></a
      >
      <button
        type="button"
        class="list-group-item list-group-item-action text-center text-dark"
        style="border-radius:20px;"
        on:click={handleLogout}
      >Cerrar sesión</button>
    </div>
  </div>
</main>
