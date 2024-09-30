<script>
  import { supabase } from "$lib/supabaseClient";

  let video = [];

  async function fetchVideoData() {
    try {
      const { data, error } = await supabase.from("video").select("*");
      if (error) throw error;
      video = data;
    } catch (error) {
      console.error("Error fetching video data:", error);
    }
  }

  function getYoutubeVideoId(url) {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/|u\/\w\/|embed\/))([^#\&\?]*).*/);
    return match ? match[1] : null;
  }

  fetchVideoData();
</script>


<div class="container mt-5">
  <div class="row row-cols-1 row-cols-md-4">
    {#each video as item}
      <div class="col mb-4 p-1">
        <div class="card p-2" style="width: 18rem; border: none;">
          <p><em>{item.Titulo}  <br> {item.Fecha}</em></p>
          <iframe
            class="ratio ratio-16x9"
            src={`https://www.youtube.com/embed/${getYoutubeVideoId(item.Url)}`}
            frameborder="0"
            allowfullscreen
            title={`Video de ${item.Titulo}`}
          ></iframe>
          <div class="card-body">
            <p><em>{item.Pastor}</em></p>
            <p></p>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>
