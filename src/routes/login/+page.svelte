<script>
  import { supabase } from "../../components/supabase.js";
  import { onMount } from "svelte";
  import '$lib/admin.css';

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


<div class="admin-login d-flex align-items-center justify-content-center" style="min-height: 100vh; background: radial-gradient(ellipse at top left, #1b1813 0%, #14120e 55%, #0e0d06 100%); padding: 2rem;">
  <div
    class="card p-5"
    style="width: 100%; max-width: 420px; border: 1px solid rgba(200,169,126,0.25); box-shadow: 0 24px 70px rgba(0,0,0,0.55);"
  >
    <div class="text-center mb-4">
      <img src="/logo.png" alt="logo" style="height: 60px; margin-bottom: 0.5rem;" />
      <h1 class="mb-1" style="font-size: 1.7rem;">
        Centro Cristiano Misión Global Colón
      </h1>
      <p style="color: var(--adm-muted); font-size: 0.95rem; margin: 0;">Acceso al panel de administración</p>
    </div>
    <form on:submit|preventDefault={handleLogin}>
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input
          type="email"
          placeholder="Correo electrónico"
          class="form-control"
          id="email"
          bind:value={email}
          name="email"
          required
        />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Contraseña</label>
        <input
          type="password"
          placeholder="Contraseña"
          class="form-control"
          id="password"
          bind:value={password}
          name="password"
          required
        />
      </div>
      <button type="submit" class="btn btn-primary w-100" style="padding: 0.7rem;">
        <i class="fa-solid fa-right-to-bracket me-2"></i>Iniciar sesión
      </button>
    </form>
    {#if errorMessage}
      <div class="mt-3 alert alert-danger py-2">{errorMessage}</div>
    {/if}
    <div class="d-flex justify-content-center mt-4">
      <a href="/" aria-label="Inicio" style="color: #c8a97e;"><i class="fa-solid fa-house fs-4"></i></a>
    </div>
  </div>
</div>
