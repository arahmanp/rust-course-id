# 🦀 Belajar Rust

Kursus pemrograman Rust berbahasa Indonesia yang **ramah pemula** — diadaptasi
dari buku resmi [*The Rust Programming Language*](https://doc.rust-lang.org/book/)
tanpa mengurangi kedalaman teknis buku aslinya. Semua aturan, peringatan, dan
contoh kode dari buku asli tetap ada, hanya dibungkus dengan bahasa, analogi,
dan elemen interaktif yang lebih mudah dicerna pemula.

## Fitur

- **Materi lengkap**, mengikuti urutan bab buku asli persis (1–21 + Lampiran),
  dikerjakan bertahap per beberapa bab.
- **Interaktif**: quiz pemahaman di setiap subbab, progress tracking otomatis
  (tersimpan di browser lewat `localStorage`, tanpa perlu akun), tombol salin
  kode, dan pencarian materi di sidebar.
- **Dark mode / light mode.**
- **100% statis, tanpa dependency eksternal.** Tidak ada build step, tidak ada
  framework, tidak ada CDN (font/ikon/syntax highlighter semuanya ditulis
  sendiri) — jadi selalu bisa dibuka offline dan tidak akan rusak karena link
  CDN mati.

## Cara membuka

Tidak perlu instalasi atau server apa pun. Buka `index.html` langsung di
browser (double-click filenya, atau drag ke jendela browser).

## Status pengerjaan

- ✅ **Bab 1–5** — selesai (Memulai, Membuat Permainan Tebak Angka, Konsep
  Pemrograman Dasar, Memahami Ownership, Struct).
- ⏳ **Bab 6–21 + Lampiran** — belum dikerjakan, sudah terdaftar di sidebar
  situs sebagai "Segera Hadir" supaya progres keseluruhan kursus terlihat.

Proyek ini sengaja dikerjakan bertahap (beberapa bab per sesi). Detail
lengkap konvensi proyek, peta penamaan seluruh 21 bab, dan status pengerjaan
terkini ada di [`CLAUDE.md`](CLAUDE.md) — dokumen itu jadi manual kerja
supaya pengerjaan bab-bab berikutnya tetap konsisten walau dikerjakan lain
waktu.

## Struktur proyek

```
/
├── CLAUDE.md              ← manual kerja & konvensi proyek (baca ini dulu sebelum melanjutkan)
├── index.html             ← halaman utama / daftar isi
├── assets/
│   ├── css/style.css      ← seluruh styling situs
│   ├── js/chapters-data.js← sumber data struktur seluruh bab
│   ├── js/main.js         ← sidebar, dark mode, progress, quiz, navigasi
│   ├── js/rust-highlight.js ← syntax highlighter Rust buatan sendiri
│   └── img/                ← diagram (SVG) dari buku asli
└── chapters/
    └── chNN-slug/
        └── *.html          ← halaman tiap subbab
```

## Melanjutkan pengerjaan

Ingin melanjutkan ke bab berikutnya (misalnya Bab 6–9)? Minta saja ke Claude
Code — instruksi dan konvensi lengkapnya sudah didokumentasikan di
[`CLAUDE.md`](CLAUDE.md), jadi konsistensi materi akan tetap terjaga tidak
peduli kapan pengerjaannya dilanjutkan.

## Sumber & lisensi

Diadaptasi dari [*The Rust Programming Language*](https://doc.rust-lang.org/book/)
oleh Steve Klabnik, Carol Nichols, Chris Krycho, dan para kontributor,
didistribusikan di bawah lisensi MIT/Apache-2.0. Rust dan logo Rust adalah
merek dagang Rust Foundation.
