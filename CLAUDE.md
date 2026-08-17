# CLAUDE.md — Panduan Proyek "Belajar Rust" (Adaptasi Indonesia dari The Rust Programming Language)

Dokumen ini adalah **manual kerja** untuk Claude Code. Baca dokumen ini secara penuh
setiap kali diminta melanjutkan proyek ini — jarak waktu antar sesi pengerjaan
tidak masalah, karena semua keputusan desain & konvensi didokumentasikan di sini,
bukan di kepala siapa pun.

## 1. Apa proyek ini

Situs kursus statis (HTML + Bootstrap 5.3.8 + jQuery 4.0.0, tanpa build step,
tanpa package manager/npm, tanpa CDN — Bootstrap & jQuery di-vendor lokal di
`assets/vendor/`, lihat §10) yang mengadaptasi buku resmi
**[The Rust Programming Language](https://doc.rust-lang.org/book/)** ("the Book")
menjadi materi belajar berbahasa Indonesia yang **sangat ramah pemula** tanpa
mengorbankan kedalaman teknis buku aslinya.

> **Riwayat migrasi:** situs ini awalnya ditulis dengan CSS/JS vanilla murni
> (tanpa framework apa pun), lalu dimigrasikan ke Bootstrap 5.3.8 + jQuery
> 4.0.0 pada 2026-08-17. Prinsip "tanpa CDN, tanpa build step" tetap
> dipertahankan — Bootstrap & jQuery jadi dependency, tapi di-vendor sebagai
> file statis lokal, bukan diambil dari CDN.

Prinsip inti (jangan dilanggar saat menambah materi baru):

- **Jangan mendangkalkan.** Semua aturan teknis, semua peringatan/gotcha, semua
  contoh kode di buku asli harus tetap ada. Menyederhanakan bahasa ≠ menghapus
  substansi. Ownership rules, borrowing rules, dll. harus dijelaskan selengkap
  buku aslinya, hanya dengan bahasa & analogi yang lebih mudah dicerna pemula.
- **Ramah pemula = banyak analogi, contoh konkret, dan penjelasan bertahap** —
  bukan versi "ringkasan" yang lebih pendek dari aslinya. Halaman boleh panjang.
- **Jangan membosankan.** Setiap subbab sebaiknya punya minimal satu elemen
  interaktif (quiz, callout "Coba Sendiri", dsb.) — lihat §5.
- Istilah teknis Inggris yang sudah baku di komunitas Rust (ownership, borrowing,
  crate, trait, lifetime, slice, closure, dst.) **tidak diterjemahkan paksa** —
  tulis istilah aslinya lalu jelaskan maknanya dalam Bahasa Indonesia saat
  pertama kali muncul di suatu halaman.
- Kode program **tidak diterjemahkan** (tetap valid Rust!), tapi komentar `//`
  di dalam kode dan string yang ditampilkan ke "pengguna" program contoh boleh
  diterjemahkan ke Bahasa Indonesia bila itu membantu pemahaman dan tidak
  mengubah perilaku/logika program.
- Sumber kebenaran teknis: markdown asli dari repo
  `https://github.com/rust-lang/book` (branch `main`), file `src/chXX-YY-*.md`,
  diambil lewat `https://raw.githubusercontent.com/rust-lang/book/main/src/<file>`.
  **Selalu ambil ulang sumber ini saat mengerjakan bab baru** (jangan mengarang
  dari ingatan) supaya konten tetap akurat & sinkron dengan buku terbaru.

## 2. Cara kerja parsial (lintas sesi)

Proyek ini SENGAJA dikerjakan bertahap (beberapa bab per sesi). Supaya tetap
konsisten walau dikerjakan berbulan-bulan kemudian:

1. Baca dokumen ini dari awal sampai akhir sebelum menulis apa pun.
2. Lihat §8 "Status Pengerjaan" untuk tahu bab mana yang sudah selesai.
3. Lihat §7 "Peta Bab Lengkap" untuk penamaan folder/file/judul Indonesia yang
   SUDAH DITETAPKAN untuk seluruh 21 bab + lampiran (bukan cuma yang sudah
   dikerjakan). Jangan mengubah slug/penomoran yang sudah ditetapkan di sana —
   itu kontrak yang menjaga konsistensi link antar sesi.
4. Ikuti pola halaman di §4 dan komponen di §5 persis seperti bab-bab yang
   sudah ada — buka salah satu file di `chapters/ch03-konsep-dasar/` sebagai
   contoh konkret sebelum menulis halaman baru.
5. Setelah selesai satu batch bab: update `assets/js/chapters-data.js` (ubah
   `status` dari `"soon"` ke `"available"` dan isi array `pages`), update §8 di
   dokumen ini, lalu jalankan pengecekan §9.

## 3. Struktur direktori

```
/
├── CLAUDE.md                     ← dokumen ini
├── index.html                    ← landing page / daftar isi
├── assets/
│   ├── vendor/bootstrap/css/bootstrap.min.css   ← Bootstrap 5.3.8 (vendored, bukan CDN)
│   ├── vendor/bootstrap/js/bootstrap.bundle.min.js ← Bootstrap JS + Popper (vendored)
│   ├── vendor/jquery/jquery-4.0.0.min.js        ← jQuery 4.0.0 (vendored)
│   ├── css/style.css             ← SATU file CSS custom, dimuat SETELAH bootstrap.min.css
│   │                                (override variable tema Bootstrap + styling komponen custom)
│   ├── js/chapters-data.js       ← SUMBER KEBENARAN TUNGGAL struktur bab (roadmap 21 bab)
│   ├── js/main.js                ← jQuery: render sidebar, dark mode, progress, quiz, prev/next, search
│   └── js/rust-highlight.js      ← syntax highlighter Rust buatan sendiri (tanpa dependency)
└── chapters/
    └── chNN-slug/
        ├── 01-nama-file.html     ← selalu PERSIS 2 level dari root (chapters/<folder>/<file>.html)
        └── ...                   ← atau index.html jika bab tidak punya subbab (mis. Bab 2)
```

**Aturan path relatif:** karena semua halaman bab berada persis 2 level di
bawah root, semua referensi asset di dalam `chapters/**/*.html` SELALU pakai
prefix `../../` (mis. `../../assets/css/style.css`, `../../index.html`).
Jangan buat kedalaman folder lain — ini menjaga semua halaman bisa memakai
template head/prev-next yang identik tanpa berpikir soal kedalaman.

## 4. Template setiap halaman subbab (WAJIB diikuti persis)

Setiap file `chapters/chNN-slug/*.html` punya kerangka berikut. Salin dari
halaman lain yang sudah ada, jangan menulis dari nol supaya boilerplate tetap
identik.

```html
<!doctype html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>N.M Judul Subbab — Belajar Rust</title>
<meta name="description" content="Deskripsi singkat 1 kalimat untuk SEO/preview.">
<link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🦀</text></svg>">
<link rel="stylesheet" href="../../assets/vendor/bootstrap/css/bootstrap.min.css">
<link rel="stylesheet" href="../../assets/css/style.css">
</head>
<body>
<a class="skip-link visually-hidden-focusable" href="#main-content">Langsung ke konten</a>
<header class="site-header navbar navbar-expand-lg px-3">
  <button id="sidebar-toggle" class="btn icon-btn d-lg-none" type="button" data-bs-toggle="offcanvas" data-bs-target="#sidebar" aria-controls="sidebar" aria-label="Buka menu navigasi">☰</button>
  <a href="../../index.html" class="site-title navbar-brand">🦀 Belajar Rust</a>
  <div class="header-progress progress flex-grow-1 mx-2" role="progressbar" aria-label="Progres belajar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
    <div class="header-progress-bar progress-bar" id="progress-bar"></div>
  </div>
  <button id="theme-toggle" class="btn icon-btn" type="button" aria-label="Ganti tema terang/gelap">🌙</button>
</header>
<div class="layout">
  <nav id="sidebar" class="sidebar offcanvas-lg offcanvas-start" tabindex="-1" aria-label="Navigasi bab">
    <div class="offcanvas-header d-lg-none">
      <span class="offcanvas-title fw-bold">🦀 Belajar Rust</span>
      <button type="button" class="btn-close" data-bs-dismiss="offcanvas" data-bs-target="#sidebar" aria-label="Tutup menu"></button>
    </div>
    <div class="offcanvas-body">
      <div class="sidebar-search">
        <input id="search-input" type="search" class="form-control" placeholder="Cari materi...">
      </div>
      <div id="sidebar-nav"><!-- diisi otomatis oleh main.js dari chapters-data.js --></div>
    </div>
  </nav>

  <main id="main-content" class="content" data-page-id="chNN-MM">
    <nav class="site-breadcrumb"><a href="../../index.html">Beranda</a> / Bab N: Judul Bab</nav>
    <article>
      <p class="chapter-label">Bab N.M</p>
      <h1>Judul Subbab</h1>

      <!-- KONTEN DI SINI: lihat §5 untuk komponen yang tersedia -->

    </article>
    <div class="page-complete">
      <div class="form-check">
        <input class="form-check-input" type="checkbox" id="mark-complete">
        <label class="form-check-label" for="mark-complete">Tandai sudah dibaca</label>
      </div>
    </div>
    <nav class="page-nav" id="page-nav"><!-- diisi otomatis oleh main.js --></nav>
  </main>
</div>
<script>window.COURSE_BASE = { root: "../..", chapters: ".." };</script>
<script src="../../assets/vendor/jquery/jquery-4.0.0.min.js"></script>
<script src="../../assets/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
<script src="../../assets/js/chapters-data.js"></script>
<script src="../../assets/js/rust-highlight.js"></script>
<script src="../../assets/js/main.js"></script>
</body>
</html>
```

Untuk `index.html` di root, ganti baris `COURSE_BASE` menjadi
`window.COURSE_BASE = { root: ".", chapters: "chapters" };` dan semua `src`/`href`
asset tidak pakai prefix `../../` (langsung `assets/...`, `chapters/...`).

Poin penting:

- Urutan 5 `<script>` di akhir body **HARUS** persis seperti di atas: jQuery
  dulu, lalu Bootstrap bundle (butuh jQuery? tidak — Bootstrap JS berdiri
  sendiri, tapi urutan ini konsisten di semua halaman), baru
  `chapters-data.js` → `rust-highlight.js` → `main.js` (yang butuh jQuery &
  `window.bootstrap` sudah ada saat file-nya dieksekusi).
- Script inline `COURSE_BASE` **HARUS** ada sebelum `chapters-data.js` di
  SETIAP halaman — `main.js` memakainya untuk membangun semua href sidebar dan
  prev/next secara dinamis (lihat §3 kenapa kedalaman folder harus konsisten).
- `data-page-id` pada `<main>` **HARUS** cocok persis dengan `id` halaman di
  `chapters-data.js` — dari situ `main.js` tahu halaman aktif, menghitung
  prev/next, dan kunci localStorage untuk status "selesai".
- Jangan menulis markup sidebar atau prev/next secara manual — semua digenerate
  oleh `main.js` dari `chapters-data.js`. Ini alasan utama proyek mudah
  dimaintain: menambah bab baru = update satu file data, bukan N file HTML.
- `.site-header` di-set `position: fixed` (bukan `sticky-top` Bootstrap) di
  `style.css` supaya navbar selalu menempel di atas viewport tanpa syarat;
  `body` diberi `padding-top: var(--header-h)` untuk mengkompensasi supaya
  konten tidak tertutup. **Jangan tambahkan class `sticky-top`** ke
  `<header>` — utility itu memakai `!important` dan akan mengalahkan
  override `position: fixed` di CSS.
- Sidebar `#sidebar` memakai komponen **Offcanvas responsif Bootstrap**
  (`offcanvas-lg offcanvas-start`): di bawah breakpoint `lg` (<992px) ia
  menjadi panel slide-in dengan backdrop & tombol close bawaan Bootstrap
  (tidak perlu JS/CSS custom untuk overlay); di ≥992px ia otomatis menjadi
  kolom statis sticky di sisi kiri. Jangan tambahkan lagi elemen
  `.sidebar-overlay` manual — sudah digantikan backdrop Bootstrap.
- Heading hierarchy dalam `<article>`: `<h1>` = judul subbab (satu-satunya per
  halaman), `<h2>` untuk seksi besar (biasanya mengikuti heading `##` di
  markdown asli), `<h3>` untuk sub-seksi.
- Halaman index bab (mis. `chapters/ch03-konsep-dasar/index.html` kalau ada)
  bersifat opsional — Bab 1,3,4,5 di kursus ini TIDAK punya halaman index bab
  tersendiri, subbab pertama langsung jadi pintu masuk. Bab tanpa subbab
  (Bab 2) hanya punya satu `index.html` di folder babnya.

## 5. Komponen konten yang tersedia (pakai class ini, jangan bikin baru tanpa alasan)

Kontrak class di bawah ini **TIDAK BERUBAH** oleh migrasi ke Bootstrap — tulis
markup persis seperti contoh, jangan menambahkan class Bootstrap (`alert`,
`card`, `btn`, dst.) secara manual. `main.js` (fungsi
`applyBootstrapEnhancements`, dipanggil lewat jQuery saat halaman dimuat)
otomatis menambahkan class Bootstrap yang sesuai ke elemen `.callout`
(→ `alert`), `.quiz` (→ `card card-body shadow-sm`), `.quiz-option`
(→ `btn text-start`), dan `.summary-box` (→ `card card-body`) saat runtime.
Ini menjaga authoring tetap sederhana sekaligus membuat komponennya benar-benar
memakai styling Bootstrap di baliknya.

### Callout box
```html
<div class="callout callout-tip">
  <p class="callout-title">💡 Tips</p>
  <p>Isi tips...</p>
</div>
```
Varian class: `callout-note` (ℹ️ Catatan — info tambahan/istilah baru),
`callout-tip` (💡 Tips — trik/kebiasaan baik), `callout-warning`
(⚠️ Perhatian — jebakan umum/error yang sering terjadi, ini SERING dipakai
buku asli lewat blockquote `>` — jangan sampai hilang saat adaptasi),
`callout-exercise` (🏋️ Coba Sendiri — latihan singkat opsional).

### Blok kode
```html
<pre><code class="language-rust">fn main() {
    println!("Halo, dunia!");
}</code></pre>
```
`main.js` otomatis menambahkan tombol salin & (untuk `language-rust`) syntax
highlighting lewat `rust-highlight.js`. Untuk output terminal / shell / TOML
pakai `class="language-shell"` / `language-toml` / `language-text` — tidak
di-highlight warna, tapi tetap dapat styling monospace + tombol salin. Kalau
sebuah blok kode merepresentasikan **output program** (bukan kode yang
dijalankan), gunakan `language-text` supaya tidak keliru dianggap kode Rust
yang valid.

Untuk kode yang ditandai buku asli sebagai **tidak bisa dikompilasi** (contoh
error yang disengaja), tambahkan badge PERSIS SEBELUM `<pre>` (`main.js`
otomatis mendeteksi & membungkusnya bersama blok kode):
```html
<div class="code-badge code-badge-error">❌ Tidak bisa dikompilasi</div>
<pre><code class="language-rust">...</code></pre>
```
Untuk kode yang di buku asli diberi label nama berkas (mis. "Filename:
src/main.rs"), tambahkan PERSIS SEBELUM `<pre>` (boleh dikombinasikan dengan
badge di atas, filename selalu ditulis lebih dulu):
```html
<p class="filename-label">Nama berkas: src/main.rs</p>
<pre><code class="language-rust">...</code></pre>
```

### Quiz (minimal 1 per subbab, taruh sebelum ringkasan penutup)
```html
<div class="quiz">
  <p class="quiz-question">Pertanyaan pemahaman singkat?</p>
  <div class="quiz-options">
    <button class="quiz-option" data-explain="Penjelasan kenapa salah/benar.">Opsi A</button>
    <button class="quiz-option" data-correct="true" data-explain="Penjelasan kenapa ini benar.">Opsi B</button>
  </div>
  <p class="quiz-feedback" aria-live="polite"></p>
</div>
```
Tepat satu `.quiz-option` per quiz boleh punya `data-correct="true"`. `main.js`
menangani klik, styling benar/salah, dan menampilkan `data-explain`.

### Diagram (SVG dari buku asli, mis. diagram stack/heap di Bab 4)
```html
<figure class="diagram">
  <img src="../../assets/img/trpl04-01.svg" alt="Deskripsi alt text yang jelas untuk pembaca screen reader.">
  <figcaption>Gambar 4-1: Keterangan singkat diagram.</figcaption>
</figure>
```
SVG diagram resmi buku (folder `assets/img/`, diunduh dari
`raw.githubusercontent.com/rust-lang/book/main/src/img/`) punya latar putih
hardcoded — class `.diagram` selalu memberi kartu berlatar putih supaya tetap
terbaca di dark mode. Label di dalam SVG (name/value/ptr/len/capacity/index)
sengaja TIDAK diterjemahkan karena itu istilah field yang dipakai dalam
penjelasan teksnya juga.

### Ringkasan penutup (taruh di akhir setiap subbab)
```html
<div class="summary-box">
  <p class="summary-title">Ringkasan</p>
  <ul>
    <li>Poin kunci 1</li>
    <li>Poin kunci 2</li>
  </ul>
</div>
```

## 6. Gaya visual (design tokens di `assets/css/style.css`)

- Font: system font stack, dipasang lewat override variable
  `--bs-body-font-family` (tanpa font eksternal, supaya cepat & offline-safe).
- Situs ini adalah **Bootstrap yang di-reskin**, bukan Bootstrap default:
  warna aksen rust/oranye diterapkan dengan meng-override CSS custom
  property milik Bootstrap sendiri (`--bs-primary`, `--bs-body-bg`,
  `--bs-body-color`, `--bs-border-color`, `--bs-secondary-bg`, dst.) di
  `:root` (mode terang) dan `[data-bs-theme="dark"]` (mode gelap) — **selalu
  override variable Bootstrap yang relevan, jangan hardcode hex baru** atau
  bikin token warna custom kecuali benar-benar tidak ada padanan variable
  Bootstrap-nya (contoh: `--accent`, `--ok`/`--danger`/`--info`/`--warn` untuk
  callout & quiz, `.tok-*` untuk warna syntax highlighting). Efeknya: hampir
  semua komponen Bootstrap (button, form, navbar, offcanvas, card, alert,
  badge, progress) otomatis ikut bertema rust tanpa CSS komponen custom.
- Mode gelap/terang lewat atribut **`data-bs-theme`** (milik Bootstrap 5.3) di
  `<html>`, diatur oleh `main.js` dan disimpan di `localStorage` key `theme`.
- Layout: sidebar kiri berupa komponen **Offcanvas responsif Bootstrap**
  (`offcanvas-lg`, lihat §4) + konten utama dengan `max-width` agar nyaman
  dibaca (bukan full-width).
- Filosofi: sederhana & minimalis (banyak whitespace, tanpa gradient/shadow
  berlebihan), tapi tidak kaku — pakai emoji sebagai aksen ikon (bukan icon
  font/SVG library eksternal), dan warna aksen konsisten untuk menandai
  progres/interaktivitas.
- **Gotcha penting:** tidak semua komponen Bootstrap benar-benar
  variable-driven di CSS terkompilasi. Class dasar seperti `a`, `.card`,
  `.form-control`, `.alert` (base) memang memakai `var(--bs-*)` sehingga
  otomatis ikut tema saat variable di-override. Tapi varian warna seperti
  `.btn-primary`, `.btn-success`, dll. di-compile Bootstrap dengan nilai hex
  **hardcoded** (bukan `var(--bs-primary)`) — override `--bs-primary` TIDAK
  akan mengubah warnanya. Untuk varian begini, override local custom
  property komponennya langsung (contoh: `.btn-primary{--bs-btn-bg:var(--accent);...}`,
  lihat `.btn-primary` di `style.css`). Kalau menambah komponen Bootstrap
  baru yang butuh warna aksen, cek dulu isi `bootstrap.min.css` (cari
  `.nama-class{` di file itu) untuk tahu apakah propertinya `var(--bs-*)`
  atau hex literal sebelum asumsi override variable saja cukup.

## 7. Peta Bab Lengkap (kontrak penamaan — jangan diubah)

Sumber: SUMMARY.md resmi the Book. Kolom "Folder/File" adalah nama yang WAJIB
dipakai persis seperti ini saat bab tersebut dikerjakan, supaya penomoran
tidak pernah bentrok antar sesi pengerjaan.

| Bab | Judul Indonesia | Folder | File subbab |
|---|---|---|---|
| 1 | Memulai | `ch01-memulai` | `01-instalasi.html`, `02-hello-world.html`, `03-hello-cargo.html` |
| 2 | Membuat Permainan Tebak Angka | `ch02-tebak-angka` | `index.html` (tanpa subbab) |
| 3 | Konsep Pemrograman Dasar | `ch03-konsep-dasar` | `01-variabel-dan-mutabilitas.html`, `02-tipe-data.html`, `03-fungsi.html`, `04-komentar.html`, `05-alur-kontrol.html` |
| 4 | Memahami Ownership | `ch04-ownership` | `01-apa-itu-ownership.html`, `02-referensi-dan-borrowing.html`, `03-tipe-slice.html` |
| 5 | Menggunakan Struct untuk Menyusun Data Terkait | `ch05-struct` | `01-mendefinisikan-struct.html`, `02-contoh-program-struct.html`, `03-method-syntax.html` |
| 6 | Enum dan Pattern Matching | `ch06-enum` | `01-mendefinisikan-enum.html`, `02-match.html`, `03-if-let.html` |
| 7 | Package, Crate, dan Module | `ch07-modules` | `01-package-dan-crate.html`, `02-mendefinisikan-module.html`, `03-path.html`, `04-keyword-use.html`, `05-modul-berbeda-berkas.html` |
| 8 | Koleksi Umum | `ch08-koleksi` | `01-vector.html`, `02-string.html`, `03-hash-map.html` |
| 9 | Penanganan Error | `ch09-error-handling` | `01-panic.html`, `02-result.html`, `03-panic-atau-tidak.html` |
| 10 | Tipe Generik, Trait, dan Lifetime | `ch10-generik-trait-lifetime` | `01-tipe-generik.html`, `02-trait.html`, `03-lifetime.html` |
| 11 | Menulis Automated Test | `ch11-testing` | `01-menulis-test.html`, `02-menjalankan-test.html`, `03-organisasi-test.html` |
| 12 | Proyek I/O: Command Line Program | `ch12-proyek-io` | `01-argumen-cli.html`, `02-membaca-berkas.html`, `03-refactoring.html`, `04-tdd.html`, `05-environment-variable.html`, `06-stderr.html` |
| 13 | Iterator dan Closure | `ch13-iterator-closure` | `01-closure.html`, `02-iterator.html`, `03-menyempurnakan-proyek-io.html`, `04-performa.html` |
| 14 | Lebih Lanjut tentang Cargo dan Crates.io | `ch14-cargo-lanjutan` | `01-release-profile.html`, `02-publish-crate.html`, `03-workspace.html`, `04-install-binary.html`, `05-extending-cargo.html` |
| 15 | Smart Pointer | `ch15-smart-pointer` | `01-box.html`, `02-deref.html`, `03-drop.html`, `04-rc.html`, `05-refcell.html`, `06-reference-cycle.html` |
| 16 | Concurrency Tanpa Rasa Takut | `ch16-concurrency` | `01-thread.html`, `02-message-passing.html`, `03-shared-state.html`, `04-send-sync.html` |
| 17 | Async, Await, Future, dan Stream | `ch17-async` | `01-future-dan-sintaks-async.html`, `02-concurrency-dengan-async.html`, `03-banyak-future.html`, `04-stream.html`, `05-trait-untuk-async.html`, `06-future-task-thread.html` |
| 18 | Fitur Object-Oriented Programming | `ch18-oop` | `01-karakteristik-oo.html`, `02-trait-object.html`, `03-design-pattern-oo.html` |
| 19 | Pattern dan Matching | `ch19-pattern` | `01-tempat-pattern.html`, `02-refutability.html`, `03-sintaks-pattern.html` |
| 20 | Fitur Tingkat Lanjut | `ch20-lanjutan` | `01-unsafe-rust.html`, `02-trait-lanjutan.html`, `03-tipe-lanjutan.html`, `04-fungsi-closure-lanjutan.html`, `05-macro.html` |
| 21 | Proyek Akhir: Web Server Multithreaded | `ch21-proyek-akhir` | `01-single-threaded.html`, `02-multithreaded.html`, `03-graceful-shutdown.html` |
| Lampiran | Lampiran (Keywords, Operator, Trait Derivable, Tools, Editions, dll.) | `lampiran` | `index.html` |

Setiap bab di atas punya entri terkait di `assets/js/chapters-data.js` dengan
`status: "soon"` sampai dikerjakan (lihat §8). Saat mengerjakan sebuah bab:
1. Ambil markdown asli via raw.githubusercontent.com (lihat §1) untuk bab itu.
2. Buat folder + file HTML sesuai tabel di atas persis.
3. Ubah entri bab itu di `chapters-data.js`: `status: "available"` + isi
   array `pages`.
4. Update tabel status di §8 di bawah ini.

## 8. Status Pengerjaan (update setiap selesai satu batch)

- ✅ **Bab 1–5**: SELESAI (Memulai, Tebak Angka, Konsep Dasar, Ownership, Struct).
- ⏳ **Bab 6–21 + Lampiran**: belum dikerjakan, terdaftar di sidebar sebagai
  "Segera Hadir" (lihat `status: "soon"` di `chapters-data.js`).
- Urutan pengerjaan berikutnya yang disarankan (ikuti urutan buku, jangan
  loncat, karena tiap bab mengasumsikan bab sebelumnya sudah dipahami):
  Bab 6–9 berikutnya, lalu 10–14, lalu 15–21 + Lampiran.

## 9. Checklist verifikasi sebelum menganggap sebuah batch bab "selesai"

- [ ] Semua file HTML baru mengikuti template §4 persis (path `../../` benar,
      `data-page-id` cocok dengan `chapters-data.js`).
- [ ] `chapters-data.js` sudah diupdate (status + pages) untuk bab yang baru
      selesai — cek sidebar menampilkan bab tsb sebagai link aktif, bukan
      "Segera Hadir".
- [ ] Tombol prev/next di halaman pertama & terakhir dari batch baru nyambung
      benar ke bab sebelum/sesudahnya (termasuk ke batch yang lama).
- [ ] Semua blok kode Rust pakai `class="language-rust"` supaya ter-highlight.
- [ ] Setiap subbab punya minimal 1 quiz dan 1 ringkasan penutup.
- [ ] Buka `index.html` di browser (`file://` langsung, tanpa server, HARUS
      tetap berfungsi penuh — tidak ada `fetch()` ke file lain di proyek ini),
      cek dark mode toggle (atribut `data-bs-theme` di `<html>` berubah), cek
      sidebar (offcanvas slide-in di mobile width, kolom statis di ≥992px),
      cek beberapa halaman baru.
- [ ] Urutan script di akhir `<body>` benar: jQuery → Bootstrap bundle →
      `chapters-data.js` → `rust-highlight.js` → `main.js` (lihat §4).
- [ ] Update §8 di dokumen ini.

## 10. Batasan teknis yang disengaja

- **Tidak ada build step / bundler / package.json.** Buka `index.html`
  langsung di browser harus selalu berfungsi. Semua JS ditulis sebagai script
  biasa (bukan ES modules dengan `import`), supaya tidak kena blokir CORS saat
  dibuka dari `file://`.
- **Tidak ada fetch() ke file lokal lain.** Semua data lintas-halaman (daftar
  bab) hidup di `chapters-data.js` sebagai variabel global JS biasa, di-load
  lewat `<script src>`, bukan lewat `fetch()`.
- **Bootstrap 5.3.8 & jQuery 4.0.0, tapi tanpa CDN.** Proyek ini SENGAJA
  memakai framework (beda dari versi awalnya yang vanilla murni), tapi
  filosofi "selalu bisa dibuka offline, tidak rusak karena link CDN mati"
  tetap dipertahankan — kedua library di-vendor sebagai file statis di
  `assets/vendor/bootstrap/` dan `assets/vendor/jquery/` (lihat §3), dimuat
  lewat `<script src>`/`<link href>` biasa, bukan dari `cdn.jsdelivr.net` atau
  sejenisnya. **Jangan ganti jadi link CDN** dan jangan tambah dependency
  eksternal lain (icon font, plugin jQuery, tema Bootstrap pihak ketiga) tanpa
  vendor lokal serupa. Syntax highlighter Rust (`rust-highlight.js`) tetap
  buatan sendiri tanpa dependency — tidak ada padanannya di Bootstrap/jQuery.
- Class/komponen custom proyek (`callout`, `quiz`, `summary-box`, `code-wrap`,
  dll. — lihat §5) tetap dipertahankan sebagai kontrak authoring; jQuery hanya
  menambahkan class Bootstrap di atasnya saat runtime, bukan menggantikannya.
