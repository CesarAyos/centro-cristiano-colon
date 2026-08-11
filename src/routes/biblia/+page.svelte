<script>
  import { onMount, tick } from 'svelte';
  import Footer from '../../components/Footer.svelte';
  import { setupReveals } from '$lib/reveal.js';
  import '$lib/public.css';

  const BIBLE_URL = 'https://cdn.jsdelivr.net/gh/thiagobodruk/bible@master/json/es_rvr.json';
  const STORAGE_KEY = 'ccolon-biblia-pos';

  const LIBROS_ES = [
    'Génesis', 'Éxodo', 'Levítico', 'Números', 'Deuteronomio', 'Josué', 'Jueces', 'Rut',
    '1 Samuel', '2 Samuel', '1 Reyes', '2 Reyes', '1 Crónicas', '2 Crónicas', 'Esdras',
    'Nehemías', 'Ester', 'Job', 'Salmos', 'Proverbios', 'Eclesiastés', 'Cantares', 'Isaías',
    'Jeremías', 'Lamentaciones', 'Ezequiel', 'Daniel', 'Oseas', 'Joel', 'Amós', 'Abdías',
    'Jonás', 'Miqueas', 'Nahúm', 'Habacuc', 'Sofonías', 'Hageo', 'Zacarías', 'Malaquías',
    'Mateo', 'Marcos', 'Lucas', 'Juan', 'Hechos', 'Romanos', '1 Corintios', '2 Corintios',
    'Gálatas', 'Efesios', 'Filipenses', 'Colosenses', '1 Tesalonicenses', '2 Tesalonicenses',
    '1 Timoteo', '2 Timoteo', 'Tito', 'Filemón', 'Hebreos', 'Santiago', '1 Pedro', '2 Pedro',
    '1 Juan', '2 Juan', '3 Juan', 'Judas', 'Apocalipsis',
  ];

  const ABREV_ES = [
    'Gn', 'Éx', 'Lv', 'Nm', 'Dt', 'Jos', 'Jue', 'Rt', '1 S', '2 S', '1 R', '2 R', '1 Cr',
    '2 Cr', 'Esd', 'Neh', 'Est', 'Job', 'Sal', 'Pr', 'Ec', 'Cnt', 'Is', 'Jer', 'Lm', 'Ez',
    'Dn', 'Os', 'Jl', 'Am', 'Abd', 'Jon', 'Miq', 'Nah', 'Hab', 'Sof', 'Hag', 'Zac', 'Mal',
    'Mt', 'Mr', 'Lc', 'Jn', 'Hch', 'Ro', '1 Co', '2 Co', 'Gá', 'Ef', 'Fil', 'Col', '1 Ts',
    '2 Ts', '1 Ti', '2 Ti', 'Tit', 'Flm', 'He', 'Stg', '1 P', '2 P', '1 Jn', '2 Jn', '3 Jn',
    'Jud', 'Ap',
  ];

  const OT_COUNT = 39;

  let bibleCache = null;

  let loading = true;
  let loadError = '';
  let books = [];
  let bookIndex = 0;
  let chapterIndex = 0;
  let verses = [];
  let bookName = '';
  let query = '';
  let searchMsg = '';
  let searching = false;

  function normalize(str) {
    return (str || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9 ]/g, '')
      .trim();
  }

  async function loadBible() {
    try {
      if (!bibleCache) {
        const res = await fetch(BIBLE_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        bibleCache = await res.json();
      }
      books = bibleCache;

      let savedBook = 0;
      let savedChapter = 0;
      if (typeof localStorage !== 'undefined') {
        try {
          const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
          if (saved && books[saved.book] && saved.chapter >= 0 && saved.chapter < books[saved.book].chapters.length) {
            savedBook = saved.book;
            savedChapter = saved.chapter;
          }
        } catch (e) {
          /* ignorar posición guardada inválida */
        }
      }

      bookIndex = savedBook;
      chapterIndex = savedChapter;
      openChapter();
    } catch (e) {
      console.error('Error cargando la Biblia:', e);
      loadError = 'No fue posible cargar el texto bíblico. Revisa tu conexión a internet e inténtalo de nuevo.';
    } finally {
      loading = false;
      await tick();
      setupReveals();
    }
  }

  function openChapter() {
    const book = books[bookIndex];
    verses = book.chapters[chapterIndex] || [];
    bookName = LIBROS_ES[bookIndex];
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ book: bookIndex, chapter: chapterIndex }));
      } catch (e) {
        /* almacenamiento no disponible */
      }
    }
  }

  function selectBook() {
    chapterIndex = 0;
    openChapter();
  }

  function nextChapter() {
    if (chapterIndex < books[bookIndex].chapters.length - 1) {
      chapterIndex += 1;
    } else if (bookIndex < books.length - 1) {
      bookIndex += 1;
      chapterIndex = 0;
    }
    openChapter();
  }

  function prevChapter() {
    if (chapterIndex > 0) {
      chapterIndex -= 1;
    } else if (bookIndex > 0) {
      bookIndex -= 1;
      chapterIndex = books[bookIndex].chapters.length - 1;
    }
    openChapter();
  }

  function testamentLabel() {
    return bookIndex < OT_COUNT ? 'Antiguo Testamento' : 'Nuevo Testamento';
  }

  function findBookIndex(raw) {
    const q = normalize(raw);
    const qCompact = q.replace(/\s+/g, '');

    for (let i = 0; i < books.length; i++) {
      const n = normalize(LIBROS_ES[i]);
      const nCompact = n.replace(/\s+/g, '');
      const a = normalize(ABREV_ES[i]);
      if (n === q || a === q || n.startsWith(q) || nCompact === qCompact) return i;
    }
    for (let i = 0; i < books.length; i++) {
      const en = normalize(books[i].name);
      const enAbbrev = normalize(books[i].abbrev);
      if (en === q || enAbbrev === q || en.startsWith(q) || en.replace(/\s+/g, '') === qCompact) return i;
    }
    return -1;
  }

  async function searchPassage() {
    const q = normalize(query);
    searchMsg = '';
    if (!q) return;

    const match = q.match(/^(.+?)\s*(\d+)(?:\s*[:.,]\s*(\d+))?$/);
    if (!match) {
      searchMsg = 'Formato no válido. Ejemplo: Juan 3:16 o Salmos 23';
      return;
    }

    const bookQuery = match[1];
    const chapter = parseInt(match[2], 10) - 1;
    const verse = match[3] ? parseInt(match[3], 10) - 1 : null;

    const found = findBookIndex(bookQuery);

    if (found === -1) {
      searchMsg = `No encontré el libro "${match[1]}".`;
      return;
    }

    const b = books[found];
    if (chapter < 0 || chapter >= b.chapters.length) {
      searchMsg = `"${b.name}" no tiene el capítulo ${match[2]}.`;
      return;
    }

    bookIndex = found;
    chapterIndex = chapter;
    openChapter();
    query = '';

    if (verse !== null) {
      const el = document.getElementById(`v-${bookIndex}-${chapter}-${verse}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.style.background = 'rgba(200, 169, 126, 0.18)';
        el.style.borderRadius = '6px';
        el.style.padding = '2px 6px';
        setTimeout(() => {
          el.style.background = '';
          el.style.borderRadius = '';
          el.style.padding = '';
        }, 2500);
      }
    }
  }

  function handleSearchKey(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      searchPassage();
    }
  }

  onMount(() => {
    loadBible();
  });
</script>

<div class="public-site">
  <section class="cc-banner">
    <div class="cc-container">
      <span class="cc-overline">La palabra de Dios</span>
      <h1>Lee la Biblia</h1>
      <p>Reina Valera · Busca un pasaje y lee la Palabra en cualquier momento.</p>
    </div>
  </section>

  <section class="cc-section">
    <div class="cc-container">
      {#if loading}
        <div class="cc-state">
          <i class="fa-solid fa-circle-notch fa-spin"></i>
          <p>Cargando la Biblia...</p>
        </div>
      {:else if loadError}
        <div class="cc-state">
          <i class="fa-solid fa-triangle-exclamation"></i>
          <p>{loadError}</p>
        </div>
      {:else}
        <!-- Buscador -->
        <div class="cc-bible__search cc-reveal">
          <i class="fa-solid fa-magnifying-glass"></i>
          <input
            type="text"
            placeholder="Busca un pasaje (ej. Juan 3:16, Salmos 23, 1 Juan 1:9)"
            bind:value={query}
            on:keydown={handleSearchKey}
            aria-label="Buscar pasaje bíblico"
          />
          <button type="button" on:click={searchPassage}>Buscar</button>
        </div>
        {#if searchMsg}
          <p class="cc-bible__msg">{searchMsg}</p>
        {/if}

        <!-- Controles -->
        <div class="cc-bible__controls cc-reveal cc-d1">
          <div class="cc-bible__selects">
            <label>
              <span>Libro</span>
              <select bind:value={bookIndex} on:change={selectBook}>
                {#each books as book, i}
                  <option value={i}>{LIBROS_ES[i]}</option>
                {/each}
              </select>
            </label>
            <label>
              <span>Capítulo</span>
              <select bind:value={chapterIndex} on:change={openChapter}>
                {#each books[bookIndex].chapters as _, i}
                  <option value={i}>{i + 1}</option>
                {/each}
              </select>
            </label>
          </div>

          <div class="cc-bible__nav">
            <button type="button" on:click={prevChapter} aria-label="Capítulo anterior">
              <i class="fa-solid fa-arrow-left"></i><span>Anterior</span>
            </button>
            <button type="button" on:click={nextChapter} aria-label="Capítulo siguiente">
              <span>Siguiente</span><i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>

        <!-- Texto -->
        <article class="cc-bible__reader cc-reveal cc-d2">
          <header class="cc-bible__head">
            <span class="cc-bible__testament">{testamentLabel()}</span>
            <h2>
              {bookName} <span class="cc-bible__chapter">{chapterIndex + 1}</span>
            </h2>
          </header>

          <div class="cc-bible__text">
            {#each verses as verseText, vi}
              <p id={`v-${bookIndex}-${chapterIndex}-${vi}`} class="cc-bible__verse">
                <sup>{vi + 1}</sup>
                <span>{verseText}</span>
              </p>
            {/each}
          </div>

          <footer class="cc-bible__foot">
            <button type="button" on:click={prevChapter}>
              <i class="fa-solid fa-arrow-left"></i>{bookName}
              {#if chapterIndex > 0}{chapterIndex}{:else}Inicio{/if}
            </button>
            <button type="button" on:click={nextChapter}>
              {bookName} {chapterIndex + 2}{#if chapterIndex === books[bookIndex].chapters.length - 1}
                Siguiente libro
              {/if}
              <i class="fa-solid fa-arrow-right"></i>
            </button>
          </footer>
        </article>
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

  /* ----- Buscador ----- */
  .cc-bible__search {
    display: flex;
    align-items: center;
    gap: 10px;
    max-width: 640px;
    margin: 0 auto 10px;
    background: #1d1a15;
    border: 1px solid var(--cc-border);
    border-radius: 999px;
    padding: 6px 6px 6px 20px;
    transition: border-color 0.3s ease;
  }

  .cc-bible__search:focus-within {
    border-color: rgba(200, 169, 126, 0.5);
  }

  .cc-bible__search i {
    color: var(--cc-accent);
    font-size: 0.95rem;
  }

  .cc-bible__search input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: var(--cc-cream);
    font-family: 'Jost', sans-serif;
    font-size: 0.98rem;
    padding: 10px 0;
  }

  .cc-bible__search input::placeholder {
    color: #8a847a;
  }

  .cc-bible__search button {
    background: var(--cc-gradient);
    color: #fff;
    border: none;
    border-radius: 999px;
    padding: 10px 24px;
    font-family: 'Jost', sans-serif;
    font-weight: 600;
    font-size: 0.92rem;
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .cc-bible__search button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(95, 125, 82, 0.4);
  }

  .cc-bible__msg {
    text-align: center;
    color: var(--cc-accent);
    margin-top: 12px;
    font-size: 0.95rem;
  }

  /* ----- Controles ----- */
  .cc-bible__controls {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: space-between;
    gap: 20px;
    margin: 40px 0 28px;
  }

  .cc-bible__selects {
    display: flex;
    gap: 14px;
    flex-wrap: wrap;
  }

  .cc-bible__selects label {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-family: 'Jost', sans-serif;
    font-size: 0.78rem;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--cc-accent);
    font-weight: 600;
  }

  .cc-bible__selects select {
    background: #1d1a15;
    color: var(--cc-cream);
    border: 1px solid var(--cc-border);
    border-radius: 12px;
    padding: 10px 34px 10px 14px;
    font-family: 'Jost', sans-serif;
    font-size: 0.98rem;
    cursor: pointer;
    outline: none;
    max-width: 220px;
  }

  .cc-bible__selects select:focus {
    border-color: rgba(200, 169, 126, 0.5);
  }

  .cc-bible__nav {
    display: flex;
    gap: 10px;
  }

  .cc-bible__nav button,
  .cc-bible__foot button {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    background: transparent;
    color: var(--cc-primary);
    border: 1px solid var(--cc-border);
    border-radius: 999px;
    padding: 10px 18px;
    font-family: 'Jost', sans-serif;
    font-weight: 500;
    font-size: 0.9rem;
    cursor: pointer;
    transition: border-color 0.3s ease, color 0.3s ease, background 0.3s ease, transform 0.3s ease;
  }

  .cc-bible__nav button:hover,
  .cc-bible__foot button:hover {
    border-color: var(--cc-accent);
    color: var(--cc-accent);
    transform: translateY(-2px);
  }

  /* ----- Lector ----- */
  .cc-bible__reader {
    background: linear-gradient(160deg, #1d1a15 0%, #16130e 100%);
    border: 1px solid var(--cc-border);
    border-radius: 24px;
    padding: 48px 56px;
    box-shadow: var(--cc-shadow);
  }

  .cc-bible__head {
    text-align: center;
    margin-bottom: 34px;
  }

  .cc-bible__testament {
    color: var(--cc-accent);
    font-size: 0.78rem;
    letter-spacing: 3px;
    text-transform: uppercase;
    font-weight: 600;
    display: block;
    margin-bottom: 10px;
  }

  .cc-bible__head h2 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.4rem;
    margin: 0;
  }

  .cc-bible__chapter {
    color: var(--cc-accent);
    font-style: italic;
  }

  .cc-bible__text {
    columns: 2;
    column-gap: 44px;
    column-rule: 1px solid var(--cc-border);
  }

  .cc-bible__verse {
    margin: 0 0 14px;
    color: var(--cc-cream);
    font-size: 1.02rem;
    line-height: 1.85;
    break-inside: avoid;
    transition: background 0.4s ease;
  }

  .cc-bible__verse sup {
    color: var(--cc-accent);
    font-size: 0.7rem;
    margin-right: 6px;
    font-weight: 600;
  }

  .cc-bible__foot {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    margin-top: 40px;
    padding-top: 24px;
    border-top: 1px solid var(--cc-border);
  }

  @media (max-width: 992px) {
    .cc-bible__text {
      columns: 1;
    }

    .cc-bible__reader {
      padding: 36px 28px;
    }
  }

  @media (max-width: 576px) {
    .cc-bible__controls {
      flex-direction: column;
      align-items: stretch;
    }

    .cc-bible__nav {
      justify-content: center;
    }

    .cc-bible__foot {
      flex-direction: column;
    }
  }
</style>
