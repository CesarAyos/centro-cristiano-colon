const fs = require('fs');
const path = require('path');

const sourceDir = process.argv[2];
if (!sourceDir) {
  console.error('Uso: node scripts/convert-rv1909.cjs <directorio-extraido>');
  process.exit(1);
}

const expectedCodes = [
  'GEN', 'EXO', 'LEV', 'NUM', 'DEU', 'JOS', 'JDG', 'RUT', '1SA', '2SA', '1KI', '2KI',
  '1CH', '2CH', 'EZR', 'NEH', 'EST', 'JOB', 'PSA', 'PRO', 'ECC', 'SNG', 'ISA', 'JER',
  'LAM', 'EZK', 'DAN', 'HOS', 'JOL', 'AMO', 'OBA', 'JON', 'MIC', 'NAM', 'HAB', 'ZEP',
  'HAG', 'ZEC', 'MAL', 'MAT', 'MRK', 'LUK', 'JHN', 'ACT', 'ROM', '1CO', '2CO', 'GAL',
  'EPH', 'PHP', 'COL', '1TH', '2TH', '1TI', '2TI', 'TIT', 'PHM', 'HEB', 'JAS', '1PE',
  '2PE', '1JN', '2JN', '3JN', 'JUD', 'REV',
];

const filePattern = /^spaRV1909_(\d{3})_([A-Z0-9]+)_(\d+)_read\.txt$/;
const files = fs.readdirSync(sourceDir)
  .map((name) => {
    const match = name.match(filePattern);
    return match ? { name, id: Number(match[1]), code: match[2], chapter: Number(match[3]) } : null;
  })
  .filter((file) => file && file.id !== 0)
  .sort((a, b) => a.id - b.id || a.chapter - b.chapter);

const grouped = new Map();
for (const file of files) {
  if (!grouped.has(file.id)) grouped.set(file.id, { code: file.code, files: [] });
  const book = grouped.get(file.id);
  if (book.code !== file.code) throw new Error(`Código de libro inconsistente: ${file.name}`);
  book.files.push(file);
}

const sourceBooks = [...grouped.values()];
if (sourceBooks.length !== expectedCodes.length) {
  throw new Error(`Se esperaban ${expectedCodes.length} libros y se encontraron ${sourceBooks.length}.`);
}

const bible = sourceBooks.map((book, bookIndex) => {
  if (book.code !== expectedCodes[bookIndex]) {
    throw new Error(`Libro ${bookIndex + 1}: se esperaba ${expectedCodes[bookIndex]} y llegó ${book.code}.`);
  }

  let name = '';
  const chapters = book.files.map((file, chapterIndex) => {
    const lines = fs.readFileSync(path.join(sourceDir, file.name), 'utf8').replace(/^\uFEFF/, '').split(/\r?\n/);
    const chapterHeader = lines[1]?.match(/^(\d+)\.$/);
    if (!chapterHeader || Number(chapterHeader[1]) !== chapterIndex + 1 || file.chapter !== chapterIndex + 1) {
      throw new Error(`Cabecera de capítulo inválida en ${file.name}.`);
    }
    if (chapterIndex === 0) name = lines[0].trim().replace(/\.$/, '');

    const verses = lines.slice(2).map((line) => line.trim()).filter(Boolean);
    if (!verses.length) throw new Error(`No hay versículos en ${file.name}.`);
    return verses;
  });

  return { abbrev: book.code, name, chapters };
});

const outputPath = path.join(__dirname, '..', 'static', 'bible', 'reina-valera-1909.json');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(bible)}\n`, 'utf8');
const chapterCount = bible.reduce((total, book) => total + book.chapters.length, 0);
const verseCount = bible.reduce(
  (total, book) => total + book.chapters.reduce((bookTotal, chapter) => bookTotal + chapter.length, 0),
  0
);

console.log(`Biblia convertida: ${bible.length} libros, ${chapterCount} capítulos, ${verseCount} versículos.`);
console.log(`Archivo: ${outputPath}`);