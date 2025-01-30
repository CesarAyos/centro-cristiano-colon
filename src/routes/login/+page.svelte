<script>
  import { supabase } from "../../components/supabase.js";
  import { onMount } from "svelte";

  let email = "";
  let password = "";
  let errorMessage = "";

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      errorMessage = "Error al iniciar sesión: " + error.message;
    } else {
      // Redirigir al perfil después de iniciar sesión
      window.location.href = "/profile";
    }
  };

  onMount(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session && session.user) {
      window.location.href = "/profile";
    }
  });
</script>



<div
  class="card mt-5 p-5 position-absolute top-50 start-50 translate-middle"
  style="background: rgba(31, 54, 61, 0.75); box-shadow: 1px 2px 6px 3px rgba(0,0,0,0.75) inset;"
>
  <h1 class="text-center text-white">
    Centro Cristiano Colón
  </h1>
  <form on:submit|preventDefault={handleLogin}>
    <div class="mb-3">
      <label for="email" class="form-label text-white">Email</label>
      <input
        type="email"
        placeholder="Correo electrónico"
        class="form-control"
        style="box-shadow: 1px 2px 6px 3px rgba(0,0,0,0.75) inset;"
        id="email"
        bind:value={email}
        name="email"
        required
      />
    </div>
    <div class="mb-3">
      <label for="password" class="form-label text-white">Contraseña</label>
      <input
        type="password"
        placeholder="Contraseña"
        class="form-control"
        style="box-shadow: 1px 2px 6px 3px rgba(0,0,0,0.75) inset;"
        id="password"
        bind:value={password}
        name="password"
        required
      />
    </div>
    <button type="submit" class="btn btn-primary">Login</button>
    <div class="d-flex justify-content-end">
      <a href="/" aria-label="Inicio"><i class="fa-solid fa-house fs-4"></i></a>
    </div>
  </form>
  {#if errorMessage}
    <div class="mt-3 alert alert-danger">{errorMessage}</div>
  {/if}
</div>
