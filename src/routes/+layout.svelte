<script>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import Navbar from "../components/Navbar.svelte";
  import RadioPlayer from "../components/RadioPlayer.svelte";
  import LiveTvPlayer from "../components/LiveTvPlayer.svelte";
  import { watchNewReflexiones } from '$lib/notifications';

  /** @type {import('./$types').LayoutData} */
  export let data;

  let stopWatch = () => {};

  onMount(() => {
    stopWatch = watchNewReflexiones();
    return () => {
      stopWatch();
    };
  });

  $: title = $page.data?.title || data?.defaultTitle || 'Centro Cristiano Misión Global Colón';
  $: description = $page.data?.description || data?.defaultDescription || 'Iglesia cristiana en San Juan de Colón, Estado Zulia, Venezuela.';
  $: canonicalUrl = $page.data?.url || data?.siteUrl || 'https://centro-cristiano-colon.vercel.app';
  $: image = data?.defaultImage || 'https://centro-cristiano-colon.vercel.app/logo.png';
</script>

<title>{title}</title>
  <meta name="description" content={description} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={canonicalUrl} />
  <meta property="og:type" content="website" />
  <meta property="og:image" content={image} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={image} />
  <link rel="canonical" href={canonicalUrl} />

<Navbar />

<slot />

<RadioPlayer />
<LiveTvPlayer />
