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


<div class="wrapper mb-5">
  <div class="logo">
    <img src="/mini.png" alt="logo">
  </div>
  <div class="text-center mt-4 name">
    Centro Cristiano Colón
  </div>
  <form on:submit|preventDefault={handleLogin} class="p-3 mt-3">
    <div class="form-field d-flex align-items-center">
      <input type="email" name="userName" bind:value={email} id="userName" placeholder="Correo" autocomplete="off">
    </div>
    <div class="form-field d-flex align-items-center">
      <input type="password" name="password" bind:value={password} id="pwd" placeholder="Contraseña" autocomplete="off">
    </div>
    <button type="submit" class="btn mt-3 ">Ingresar</button>
  </form>
</div>

<style>
  /* Importing fonts from Google */
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');

  /* Reseting */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Poppins', sans-serif;
  }

  .wrapper {
    max-width: 350px;
    min-height: 500px;
    margin: 80px auto;
    padding: 40px 30px 30px 30px;
    background-color: #ecf0f3;
    border-radius: 15px;
    box-shadow: 13px 13px 20px #cbced1, -13px -13px 20px #fff;
  }

  .logo {
    width: 80px;
    margin: auto;
  }

  .logo img {
    width: 100%;
    height: 80px;
    object-fit: cover;
    border-radius: 50%;
    box-shadow: 0px 0px 3px #5f5f5f,
      0px 0px 0px 5px #ecf0f3,
      8px 8px 15px #a7aaa7,
      -8px -8px 15px #fff;
  }

  .wrapper .name {
    font-weight: 600;
    font-size: 1.4rem;
    letter-spacing: 1.3px;
    padding-left: 10px;
    color: #555;
  }

  .wrapper .form-field input {
    width: 100%;
    display: block;
    border: none;
    outline: none;
    background: none;
    font-size: 1.2rem;
    color: #666;
    padding: 10px 15px 10px 10px;
  }

  .wrapper .form-field {
    padding-left: 10px;
    margin-bottom: 20px;
    border-radius: 20px;
    box-shadow: inset 8px 8px 8px #cbced1, inset -8px -8px 8px #fff;
  }


  .wrapper .btn {
    box-shadow: none;
    width: 100%;
    height: 40px;
    background-color: #03A9F4;
    color: #fff;
    border-radius: 25px;
    box-shadow: 3px 3px 3px #b1b1b1,
      -3px -3px 3px #fff;
    letter-spacing: 1.3px;
  }




  @media (max-width: 380px) {
    .wrapper {
      margin: 30px 20px;
      padding: 40px 15px 15px 15px;
    }
  }
</style>
