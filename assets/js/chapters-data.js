/*
 * chapters-data.js — SUMBER KEBENARAN TUNGGAL struktur kursus.
 *
 * Menambah / melanjutkan bab baru? Lihat CLAUDE.md §7-8:
 *   1. Ubah status: "soon" -> "available" untuk bab yang baru selesai.
 *   2. Isi array `pages` dengan { id, title, file } sesuai file HTML yang dibuat.
 * Jangan ubah `id` atau `slug` bab yang sudah ada — dipakai sebagai kunci
 * localStorage & di semua href relatif halaman yang sudah ditulis.
 */
const RUST_COURSE_CHAPTERS = [
  {
    id: "ch01", number: 1, title: "Memulai", slug: "ch01-memulai",
    desc: "Instal Rust, tulis program pertamamu, dan berkenalan dengan Cargo.",
    status: "available",
    pages: [
      { id: "ch01-01", title: "Instalasi", file: "01-instalasi.html" },
      { id: "ch01-02", title: "Hello, World!", file: "02-hello-world.html" },
      { id: "ch01-03", title: "Hello, Cargo!", file: "03-hello-cargo.html" }
    ]
  },
  {
    id: "ch02", number: 2, title: "Membuat Permainan Tebak Angka", slug: "ch02-tebak-angka",
    desc: "Praktik langsung: bangun game tebak angka dari nol.",
    status: "available",
    pages: [
      { id: "ch02-00", title: "Membuat Permainan Tebak Angka", file: "index.html" }
    ]
  },
  {
    id: "ch03", number: 3, title: "Konsep Pemrograman Dasar", slug: "ch03-konsep-dasar",
    desc: "Variabel, tipe data, fungsi, komentar, dan alur kontrol.",
    status: "available",
    pages: [
      { id: "ch03-01", title: "Variabel dan Mutabilitas", file: "01-variabel-dan-mutabilitas.html" },
      { id: "ch03-02", title: "Tipe Data", file: "02-tipe-data.html" },
      { id: "ch03-03", title: "Fungsi", file: "03-fungsi.html" },
      { id: "ch03-04", title: "Komentar", file: "04-komentar.html" },
      { id: "ch03-05", title: "Alur Kontrol", file: "05-alur-kontrol.html" }
    ]
  },
  {
    id: "ch04", number: 4, title: "Memahami Ownership", slug: "ch04-ownership",
    desc: "Fitur paling unik Rust: mengelola memori tanpa garbage collector.",
    status: "available",
    pages: [
      { id: "ch04-01", title: "Apa itu Ownership?", file: "01-apa-itu-ownership.html" },
      { id: "ch04-02", title: "Referensi dan Borrowing", file: "02-referensi-dan-borrowing.html" },
      { id: "ch04-03", title: "Tipe Slice", file: "03-tipe-slice.html" }
    ]
  },
  {
    id: "ch05", number: 5, title: "Menggunakan Struct untuk Menyusun Data Terkait", slug: "ch05-struct",
    desc: "Menyusun data terkait ke dalam tipe custom milikmu sendiri.",
    status: "available",
    pages: [
      { id: "ch05-01", title: "Mendefinisikan dan Membuat Instance Struct", file: "01-mendefinisikan-struct.html" },
      { id: "ch05-02", title: "Contoh Program Menggunakan Struct", file: "02-contoh-program-struct.html" },
      { id: "ch05-03", title: "Sintaks Method", file: "03-method-syntax.html" }
    ]
  },
  {
    id: "ch06", number: 6, title: "Enum dan Pattern Matching", slug: "ch06-enum",
    desc: "Memodelkan data yang punya beberapa kemungkinan bentuk.",
    status: "soon", pages: []
  },
  {
    id: "ch07", number: 7, title: "Package, Crate, dan Module", slug: "ch07-modules",
    desc: "Mengatur kode agar tetap rapi saat proyek membesar.",
    status: "soon", pages: []
  },
  {
    id: "ch08", number: 8, title: "Koleksi Umum", slug: "ch08-koleksi",
    desc: "Vector, String, dan HashMap untuk menyimpan banyak data.",
    status: "soon", pages: []
  },
  {
    id: "ch09", number: 9, title: "Penanganan Error", slug: "ch09-error-handling",
    desc: "Menangani kegagalan dengan panic! dan Result.",
    status: "soon", pages: []
  },
  {
    id: "ch10", number: 10, title: "Tipe Generik, Trait, dan Lifetime", slug: "ch10-generik-trait-lifetime",
    desc: "Menulis kode yang fleksibel tanpa duplikasi.",
    status: "soon", pages: []
  },
  {
    id: "ch11", number: 11, title: "Menulis Automated Test", slug: "ch11-testing",
    desc: "Memastikan kodemu benar dengan test otomatis.",
    status: "soon", pages: []
  },
  {
    id: "ch12", number: 12, title: "Proyek I/O: Command Line Program", slug: "ch12-proyek-io",
    desc: "Membangun clone grep versi sederhana dari command line.",
    status: "soon", pages: []
  },
  {
    id: "ch13", number: 13, title: "Iterator dan Closure", slug: "ch13-iterator-closure",
    desc: "Fitur gaya functional programming di Rust.",
    status: "soon", pages: []
  },
  {
    id: "ch14", number: 14, title: "Lebih Lanjut tentang Cargo dan Crates.io", slug: "ch14-cargo-lanjutan",
    desc: "Release profile, publish crate, workspace, dan lainnya.",
    status: "soon", pages: []
  },
  {
    id: "ch15", number: 15, title: "Smart Pointer", slug: "ch15-smart-pointer",
    desc: "Box, Rc, RefCell, dan pola kepemilikan tingkat lanjut.",
    status: "soon", pages: []
  },
  {
    id: "ch16", number: 16, title: "Concurrency Tanpa Rasa Takut", slug: "ch16-concurrency",
    desc: "Menulis kode multithreaded yang aman dijamin compiler.",
    status: "soon", pages: []
  },
  {
    id: "ch17", number: 17, title: "Async, Await, Future, dan Stream", slug: "ch17-async",
    desc: "Pemrograman asynchronous di Rust.",
    status: "soon", pages: []
  },
  {
    id: "ch18", number: 18, title: "Fitur Object-Oriented Programming", slug: "ch18-oop",
    desc: "Trait object dan pola OOP di Rust.",
    status: "soon", pages: []
  },
  {
    id: "ch19", number: 19, title: "Pattern dan Matching", slug: "ch19-pattern",
    desc: "Semua cara pattern bisa dipakai untuk mencocokkan data.",
    status: "soon", pages: []
  },
  {
    id: "ch20", number: 20, title: "Fitur Tingkat Lanjut", slug: "ch20-lanjutan",
    desc: "Unsafe Rust, trait lanjutan, tipe lanjutan, dan macro.",
    status: "soon", pages: []
  },
  {
    id: "ch21", number: 21, title: "Proyek Akhir: Web Server Multithreaded", slug: "ch21-proyek-akhir",
    desc: "Membangun web server multithreaded dari nol.",
    status: "soon", pages: []
  },
  {
    id: "lampiran", number: "A", title: "Lampiran", slug: "lampiran",
    desc: "Keyword, operator, trait derivable, dan referensi lainnya.",
    status: "soon", pages: []
  }
];

if (typeof module !== "undefined") { module.exports = RUST_COURSE_CHAPTERS; }
