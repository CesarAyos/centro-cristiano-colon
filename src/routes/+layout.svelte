<script>
  import Navbar from "../components/Navbar.svelte";
  import RadioPlayer from "../components/RadioPlayer.svelte";
  import LiveTvPlayer from "../components/LiveTvPlayer.svelte";

  </script>
  
  <Navbar />
  
  <slot />

  <RadioPlayer />
  <LiveTvPlayer />