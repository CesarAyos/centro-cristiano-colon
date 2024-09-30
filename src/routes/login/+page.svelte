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

<section class="vh-100">
  <div class="container mt-5">
    <div>
      {#if errorMessage}
        <p class="error">{errorMessage}</p>
      {/if}
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col-12 col-md-8 col-lg-6 col-xl-5">
          <div class="card bg-dark text-white" style="border-radius: 1rem;">
            <div class="card-body p-5 text-center">
              <form on:submit|preventDefault={handleLogin}>
                <div class="mt-5">
                  <div class="d-flex justify-content-center">
                    <img
                      src="/logo.png"
                      class="card-img-top d-flex"
                      alt="login"
                      style="height: 120px; width: 150px;"
                    />
                  </div>
                  <p class="text-white-50 mb-5">Por favor ingrese su nombre de usuario y contraseña</p>

                  <div data-mdb-input-init class="form-outline form-white mb-4">
                    <input type="email" bind:value={email} id="typeEmailX" class="form-control form-control-lg" />
                    <label class="form-label" for="typeEmailX">Correo</label>
                  </div>

                  <div data-mdb-input-init class="form-outline form-white mb-4">
                    <input type="password" bind:value={password} id="typePasswordX" class="form-control form-control-lg" />
                    <label class="form-label" for="typePasswordX">Contraseña</label>
                  </div>

                  <button data-mdb-button-init data-mdb-ripple-init class="btn btn-outline-light btn-lg px-5" type="submit">Ingresar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>