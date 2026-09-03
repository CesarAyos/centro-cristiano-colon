<script>
  import { onMount } from 'svelte';
  import Navbar from "../components/Navbar.svelte";
  import RadioPlayer from "../components/RadioPlayer.svelte";
  import LiveTvPlayer from "../components/LiveTvPlayer.svelte";
  import { watchNewReflexiones } from '$lib/notifications';

  let stopWatch = () => {};

  onMount(() => {
    stopWatch = watchNewReflexiones();
    return () => {
      stopWatch();
    };
  });
</script>

  <Navbar />
  
  <slot />

  <RadioPlayer />
  <LiveTvPlayer />