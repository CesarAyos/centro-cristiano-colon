<script>
  import { supabase } from "../../components/supabase.js";
  import { onMount } from "svelte";

  let email = "";
  let password = "";
  let errorMessage = "";

  const handleLogin = async () => {
    const { user, error } = await supabase.auth.signInWithPassword({
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

<main>
  <div class="login-container">
    <h1>Iniciar Sesión</h1>
    {#if errorMessage}
      <p class="error">{errorMessage}</p>
    {/if}
    <div class="d-flex justify-content-center p-4 m-5">
      <div
        class="card pt-3"
        style="width: 30rem;border:none;background: linear-gradient(360deg, rgba(243, 240, 240, 0.055) 10%, #333333 90%);box-shadow: 12px -12px 5px -1px rgba(0,0,0,0.75);"
      >
        <div class="d-flex justify-content-center">
          <img
            src="/logo.png"
            class="card-img-top d-flex"
            alt="login"
            style="height: 120px;width:150px;"
          />
        </div>
        <div class="card-body d-flex justify-content-center">
          <form on:submit|preventDefault={handleLogin}>
            <div>
              <label for="email"></label><br />
              <input
                style="border:none;border-bottom: 2px solid #37390f;outline: none;background:transparent"
                bind:value={email}
                required
                type="email"
                id="email"
                name="email"
                placeholder="Usuario"
              /><br />
            </div>
            <div>
              <label class=" m-2" for="password"></label><br />
              <input
                style="border:none;border-bottom: 2px solid #37390f;outline: none;background:transparent"
                bind:value={password}
                required
                type="password"
                id="password"
                name="password"
                placeholder="Contraseña"
              /><br />
            </div>
            <div class=" d-flex justify-content-center m-4">
              <input
                class="btn btn-dark"
                type="submit"
                value="Iniciar sesión"
                style="border-radius:10px; "
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</main>
