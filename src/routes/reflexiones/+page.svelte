<script>
  import { onMount, tick } from 'svelte';
  import Footer from '../../components/Footer.svelte';
  import { supabase } from '$lib/supabaseClient';
  import { setupReveals } from '$lib/reveal.js';
  import '$lib/public.css';

  let reflexiones = [];
  let loading = true;
  let errorMsg = '';
  let expanded = [];
  let likedIds = [];
  let likesByReflection = {};
  let commentsByReflection = {};
  let commentsOpen = [];
  let commentDrafts = {};
  let commentErrors = {};

  function getUserId() {
    let uid = localStorage.getItem('cc-device-id');
    if (!uid) {
      uid = 'u-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
      localStorage.setItem('cc-device-id', uid);
    }
    return uid;
  }

  async function loadReflexiones() {
    try {
      const { data, error } = await supabase
        .from('reflexiones')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      reflexiones = data || [];
      if (reflexiones.length) {
        await loadComments(reflexiones.map((x) => x.id));
        await loadLikes(reflexiones.map((x) => x.id));
      }
    } catch (e) {
      errorMsg = 'No fue posible cargar las reflexiones. Intenta de nuevo más tarde.';
      console.error('Error cargando reflexiones:', e);
    } finally {
      loading = false;
      await tick();
      setupReveals();
    }
  }

  function toggle(id) {
    if (expanded.includes(id)) {
      expanded = expanded.filter((x) => x !== id);
    } else {
      expanded = [...expanded, id];
    }
  }

  function share(r) {
    const url = `${window.location.origin}/reflexiones?id=${r.id}`;
    const texto = `${r.titulo}${r.referencia ? ' — ' + r.referencia : ''}\n${url}`;
    if (navigator.share) {
      navigator
        .share({ title: r.titulo, text: r.referencia || r.titulo, url })
        .catch(() => {});
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, '_blank');
    }
  }

  async function toggleLike(r) {
    const uid = getUserId();
    const liked = likedIds.includes(r.id);
    const current = likesByReflection[r.id] || 0;
    likesByReflection = {
      ...likesByReflection,
      [r.id]: liked ? Math.max(current - 1, 0) : current + 1,
    };
    if (liked) {
      likedIds = likedIds.filter((x) => x !== r.id);
    } else {
      likedIds = [...likedIds, r.id];
    }
    localStorage.setItem('cc-reflexiones-likes', JSON.stringify(likedIds));
    try {
      const { error } = liked
        ? await supabase
            .from('likes')
            .delete()
            .eq('reflexion_id', r.id)
            .eq('user_id', uid)
        : await supabase.from('likes').insert([{ reflexion_id: r.id, user_id: uid }]);
      if (error) throw error;
    } catch (e) {
      likesByReflection = {
        ...likesByReflection,
        [r.id]: liked ? current + 1 : Math.max(current - 1, 0),
      };
      if (liked) {
        likedIds = [...likedIds, r.id];
      } else {
        likedIds = likedIds.filter((x) => x !== r.id);
      }
      localStorage.setItem('cc-reflexiones-likes', JSON.stringify(likedIds));
      console.error('Error actualizando like:', e.message);
    }
  }

  async function loadLikes(ids) {
    if (!ids || !ids.length) return;
    const { data, error } = await supabase
      .from('likes')
      .select('reflexion_id')
      .in('reflexion_id', ids);
    if (error) {
      console.error('Error cargando likes:', error.message);
      return;
    }
    const counts = {};
    for (const l of data || []) {
      counts[l.reflexion_id] = (counts[l.reflexion_id] || 0) + 1;
    }
    likesByReflection = counts;
  }

  async function loadComments(ids) {
    if (!ids || !ids.length) return;
    const { data, error } = await supabase
      .from('comentarios')
      .select('*')
      .in('reflexion_id', ids)
      .order('created_at', { ascending: true });
    if (error) {
      console.error('Error cargando comentarios:', error.message);
      return;
    }
    const grouped = {};
    for (const c of data || []) {
      if (!grouped[c.reflexion_id]) grouped[c.reflexion_id] = [];
      grouped[c.reflexion_id].push(c);
    }
    commentsByReflection = grouped;
  }

  function toggleComments(id) {
    commentDrafts = {
      ...commentDrafts,
      [id]: commentDrafts[id] || { nombre: '', texto: '' },
    };
    commentErrors = { ...commentErrors, [id]: '' };
    commentsOpen = commentsOpen.includes(id)
      ? commentsOpen.filter((x) => x !== id)
      : [...commentsOpen, id];
  }

  async function submitComment(r) {
    if (!commentDrafts[r.id]) commentDrafts[r.id] = { nombre: '', texto: '' };
    const d = commentDrafts[r.id];
    commentErrors = { ...commentErrors, [r.id]: '' };
    if (!d.nombre.trim() || !d.texto.trim()) return;
    const { data, error } = await supabase
      .from('comentarios')
      .insert([{ reflexion_id: r.id, nombre: d.nombre.trim(), texto: d.texto.trim() }])
      .select();
    if (error) {
      console.error('Error publicando comentario:', error.message);
      commentErrors = {
        ...commentErrors,
        [r.id]:
          'No se pudo publicar el comentario. Verifica en Supabase que la tabla "comentarios" exista (columnas: reflexion_id, nombre, texto) y tenga políticas RLS de lectura e inserción.',
      };
      return;
    }
    commentDrafts = { ...commentDrafts, [r.id]: { nombre: '', texto: '' } };
    await loadComments(reflexiones.map((x) => x.id));
    if (!commentsOpen.includes(r.id)) commentsOpen = [...commentsOpen, r.id];
  }

  function formatCommentDate(ts) {
    try {
      return new Date(ts).toLocaleDateString('es', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return '';
    }
  }

  onMount(async () => {
    try {
      likedIds = JSON.parse(localStorage.getItem('cc-reflexiones-likes') || '[]');
    } catch {
      likedIds = [];
    }
    await loadReflexiones();
    const params = new URLSearchParams(window.location.search);
    const target = params.get('id');
    if (target) {
      setTimeout(() => {
        const el = document.getElementById(`r-${target}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.style.borderColor = 'rgba(200, 169, 126, 0.65)';
          el.style.boxShadow = '0 0 0 3px rgba(200, 169, 126, 0.35)';
          setTimeout(() => {
            el.style.borderColor = '';
            el.style.boxShadow = '';
          }, 3500);
        }
      }, 300);
    }
  });
</script>

<div class="public-site">
  <section class="cc-banner">
    <div class="cc-container">
      <span class="cc-overline">Devocionales y meditaciones</span>
      <h1>Reflexiones</h1>
      <p>Palabras de aliento y fe para alimentar tu caminar con Dios.</p>
    </div>
  </section>

  <section class="cc-section">
    <div class="cc-container">
      {#if loading}
        <div class="cc-state">
          <i class="fa-solid fa-circle-notch fa-spin"></i>
          <p>Cargando reflexiones...</p>
        </div>
      {:else if errorMsg}
        <div class="cc-state">
          <i class="fa-solid fa-triangle-exclamation"></i>
          <p>{errorMsg}</p>
        </div>
      {:else if reflexiones.length}
        <div class="row g-4">
          {#each reflexiones as r, i (r.id)}
            <div class="col-lg-6">
              <article class="cc-reflection cc-reveal cc-d{(i % 2) + 1}" id="r-{r.id}">
                <header class="cc-reflection__head">
                  <span class="cc-reflection__icon"><i class="fa-solid fa-book-open"></i></span>
                  <div>
                    <h2>{r.titulo}</h2>
                    <div class="cc-reflection__meta">
                      {#if r.autor}<span><i class="fa-solid fa-user-tie"></i>{r.autor}</span>{/if}
                      {#if r.fecha}<span><i class="fa-regular fa-calendar"></i>{r.fecha}</span>{/if}
                    </div>
                  </div>
                  <button
                    class="cc-reflection__share"
                    type="button"
                    title="Compartir"
                    on:click={() => share(r)}
                  >
                    <i class="fa-solid fa-share-nodes"></i>
                  </button>
                </header>

                {#if r.referencia}
                  <p class="cc-reflection__verse"><i class="fa-solid fa-cross"></i>{r.referencia}</p>
                {/if}

                <div class="cc-reflection__body" class:is-expanded={expanded.includes(r.id)}>
                  <p>{r.contenido}</p>
                </div>

                <button class="cc-reflection__toggle" type="button" on:click={() => toggle(r.id)}>
                  {#if expanded.includes(r.id)}
                    <i class="fa-solid fa-chevron-up"></i>Leer menos
                  {:else}
                    <i class="fa-solid fa-chevron-down"></i>Leer más
                  {/if}
                </button>

                <footer class="cc-reflection__foot">
                  <button
                    class:cc-like--active={likedIds.includes(r.id)}
                    class="cc-like"
                    type="button"
                    aria-label="Me gusta"
                    on:click={() => toggleLike(r)}
                  >
                    {#if likedIds.includes(r.id)}
                      <i class="fa-solid fa-heart"></i>
                    {:else}
                      <i class="fa-regular fa-heart"></i>
                    {/if}
                    <span>{likesByReflection[r.id] || 0}</span>
                  </button>

                  <button
                    class="cc-comments-toggle"
                    type="button"
                    on:click={() => toggleComments(r.id)}
                  >
                    <i class="fa-regular fa-comment"></i>
                    <span>Comentarios ({(commentsByReflection[r.id] || []).length})</span>
                  </button>
                </footer>

                {#if commentsOpen.includes(r.id)}
                  <div class="cc-comments">
                    {#if (commentsByReflection[r.id] || []).length}
                      <ul class="cc-comments__list">
                        {#each commentsByReflection[r.id] as c}
                          <li>
                            <div class="cc-comments__head">
                              <strong>{c.nombre}</strong>
                              <time>{formatCommentDate(c.created_at)}</time>
                            </div>
                            <p>{c.texto}</p>
                          </li>
                        {/each}
                      </ul>
                    {:else}
                      <p class="cc-comments__empty">Sé el primero en comentar esta reflexión.</p>
                    {/if}

                    {#if commentErrors[r.id]}
                      <p class="cc-comments__error">{commentErrors[r.id]}</p>
                    {/if}

                    <form class="cc-comments__form" on:submit|preventDefault={() => submitComment(r)}>
                      <input
                        type="text"
                        bind:value={commentDrafts[r.id].nombre}
                        placeholder="Tu nombre"
                        maxlength="60"
                        required
                      />
                      <textarea
                        bind:value={commentDrafts[r.id].texto}
                        placeholder="Escribe tu comentario..."
                        maxlength="1000"
                        required
                      ></textarea>
                      <button type="submit"><i class="fa-regular fa-paper-plane"></i> Publicar</button>
                    </form>
                  </div>
                {/if}
              </article>
            </div>
          {/each}
        </div>
      {:else}
        <div class="cc-state">
          <i class="fa-solid fa-book"></i>
          <p>Próximamente compartiremos nuevas reflexiones.</p>
        </div>
      {/if}
    </div>
  </section>

  <Footer />
</div>

<style>
  .cc-state {
    text-align: center;
    padding: 90px 20px;
    color: var(--cc-muted);
  }

  .cc-state i {
    font-size: 2.6rem;
    color: var(--cc-accent);
    margin-bottom: 16px;
    display: block;
  }

  .cc-reflection {
    background: linear-gradient(160deg, #1d1a15 0%, #16130e 100%);
    border: 1px solid var(--cc-border);
    border-radius: 20px;
    padding: 30px;
    height: 100%;
    display: flex;
    flex-direction: column;
    transition: border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
  }

  .cc-reflection:hover {
    border-color: rgba(200, 169, 126, 0.4);
    transform: translateY(-4px);
    box-shadow: var(--cc-shadow);
  }

  .cc-reflection__head {
    display: flex;
    gap: 16px;
    align-items: flex-start;
    margin-bottom: 16px;
  }

  .cc-reflection__share {
    margin-left: auto;
    border: none;
    background: transparent;
    color: var(--cc-muted);
    cursor: pointer;
    font-size: 1.05rem;
    padding: 6px 8px;
    border-radius: 8px;
    transition: color 0.3s ease, background 0.3s ease;
  }

  .cc-reflection__share:hover {
    color: var(--cc-accent);
    background: rgba(200, 169, 126, 0.1);
  }

  .cc-reflection__icon {
    width: 50px;
    height: 50px;
    flex-shrink: 0;
    border-radius: 14px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: rgba(146, 174, 131, 0.12);
    border: 1px solid var(--cc-border);
    color: var(--cc-accent);
    font-size: 1.15rem;
  }

  .cc-reflection__head h2 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.6rem;
    font-weight: 600;
    line-height: 1.2;
    margin: 0 0 6px;
  }

  .cc-reflection__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
  }

  .cc-reflection__meta span {
    color: var(--cc-muted);
    font-size: 0.83rem;
    display: inline-flex;
    align-items: center;
    gap: 7px;
  }

  .cc-reflection__meta i {
    color: var(--cc-primary);
    font-size: 0.78rem;
  }

  .cc-reflection__verse {
    background: linear-gradient(135deg, rgba(146, 174, 131, 0.1), rgba(200, 169, 126, 0.08));
    border: 1px solid var(--cc-border);
    border-left: 3px solid var(--cc-accent);
    border-radius: 10px;
    padding: 12px 16px;
    color: var(--cc-accent-soft);
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-size: 1.05rem;
    margin-bottom: 18px;
  }

  .cc-reflection__verse i {
    margin-right: 10px;
    color: var(--cc-primary);
    font-size: 0.85rem;
  }

  .cc-reflection__body {
    flex-grow: 1;
  }

  .cc-reflection__body p {
    color: var(--cc-muted);
    font-size: 0.98rem;
    line-height: 1.85;
    margin-bottom: 0;
    white-space: pre-wrap;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .cc-reflection__body.is-expanded p {
    display: block;
  }

  .cc-reflection__toggle {
    margin-top: 20px;
    align-self: flex-start;
    border: none;
    background: transparent;
    cursor: pointer;
    color: var(--cc-primary);
    font-family: 'Jost', sans-serif;
    font-weight: 500;
    font-size: 0.9rem;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 0;
    transition: color 0.3s ease, gap 0.3s ease;
  }

  .cc-reflection__toggle:hover {
    color: var(--cc-accent);
    gap: 12px;
  }

  .cc-reflection__foot {
    margin-top: 20px;
    padding-top: 16px;
    border-top: 1px solid var(--cc-border);
    display: flex;
    gap: 18px;
    align-items: center;
    flex-wrap: wrap;
  }

  .cc-like,
  .cc-comments-toggle {
    border: none;
    background: transparent;
    color: var(--cc-muted);
    cursor: pointer;
    font-family: 'Jost', sans-serif;
    font-size: 0.9rem;
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 4px 6px;
    border-radius: 8px;
    transition: color 0.3s ease, background 0.3s ease;
  }

  .cc-like:hover,
  .cc-comments-toggle:hover {
    color: var(--cc-primary);
    background: rgba(146, 174, 131, 0.08);
  }

  .cc-like--active {
    color: var(--cc-accent);
  }

  .cc-comments {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid var(--cc-border);
  }

  .cc-comments__list {
    list-style: none;
    margin: 0 0 16px;
    padding: 0;
    display: grid;
    gap: 12px;
  }

  .cc-comments__list li {
    background: rgba(146, 174, 131, 0.06);
    border: 1px solid var(--cc-border);
    border-radius: 12px;
    padding: 12px 14px;
  }

  .cc-comments__head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 10px;
    margin-bottom: 6px;
  }

  .cc-comments__head strong {
    color: var(--cc-accent-soft);
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.05rem;
  }

  .cc-comments__head time {
    color: var(--cc-muted);
    font-size: 0.75rem;
  }

  .cc-comments__list p {
    margin: 0;
    color: var(--cc-muted);
    font-size: 0.92rem;
    line-height: 1.6;
    white-space: pre-wrap;
  }

  .cc-comments__empty {
    color: var(--cc-muted);
    font-size: 0.9rem;
    margin: 0 0 16px;
    font-style: italic;
  }

  .cc-comments__error {
    color: #e07a5f;
    font-size: 0.85rem;
    margin: 0 0 10px;
  }

  .cc-comments__form {
    display: grid;
    gap: 10px;
  }

  .cc-comments__form input,
  .cc-comments__form textarea {
    background: rgba(146, 174, 131, 0.06);
    border: 1px solid var(--cc-border);
    border-radius: 10px;
    color: var(--cc-cream);
    font-family: 'Jost', sans-serif;
    font-size: 0.92rem;
    padding: 10px 14px;
    width: 100%;
  }

  .cc-comments__form input::placeholder,
  .cc-comments__form textarea::placeholder {
    color: var(--cc-muted);
    opacity: 0.7;
  }

  .cc-comments__form input:focus,
  .cc-comments__form textarea:focus {
    outline: none;
    border-color: rgba(200, 169, 126, 0.5);
  }

  .cc-comments__form textarea {
    min-height: 74px;
    resize: vertical;
  }

  .cc-comments__form button {
    justify-self: start;
    border: 1px solid var(--cc-accent);
    background: rgba(200, 169, 126, 0.12);
    color: var(--cc-accent-soft);
    font-family: 'Jost', sans-serif;
    font-weight: 500;
    font-size: 0.9rem;
    border-radius: 999px;
    padding: 8px 20px;
    cursor: pointer;
    transition: background 0.3s ease, color 0.3s ease;
  }

  .cc-comments__form button:hover {
    background: var(--cc-accent);
    color: #1d1a15;
  }
</style>
