/*
 * main.js — logika situs: sidebar dari chapters-data.js, dark mode, progress
 * (localStorage), quiz, syntax highlight & tombol salin kode, prev/next, search.
 * Tidak ada fetch() dan tidak ada ES module — lihat CLAUDE.md §10.
 */
(function () {
  "use strict";

  var PROGRESS_KEY = "rustCourseProgress";

  function escapeHtml(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function escapeAttr(s) {
    return escapeHtml(s).replace(/"/g, "&quot;");
  }
  function getBase() {
    return window.COURSE_BASE || { root: ".", chapters: "chapters" };
  }
  function getCurrentPageId() {
    var main = document.querySelector("main[data-page-id]");
    return main ? main.getAttribute("data-page-id") : null;
  }
  function getCompletedSet() {
    try {
      var raw = localStorage.getItem(PROGRESS_KEY);
      return new Set(raw ? JSON.parse(raw) : []);
    } catch (e) {
      return new Set();
    }
  }
  function saveCompletedSet(set) {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(Array.from(set)));
  }
  function getAvailablePagesFlat() {
    var flat = [];
    if (typeof RUST_COURSE_CHAPTERS === "undefined") return flat;
    RUST_COURSE_CHAPTERS.forEach(function (ch) {
      if (ch.status !== "available") return;
      ch.pages.forEach(function (p, idx) {
        flat.push({
          pageId: p.id,
          title: p.title,
          file: p.file,
          chapterId: ch.id,
          chapterSlug: ch.slug,
          chapterNumber: ch.number,
          label: ch.pages.length > 1 ? ch.number + "." + (idx + 1) : "Bab " + ch.number
        });
      });
    });
    return flat;
  }

  /* ---------- Tema terang/gelap ---------- */
  function initTheme() {
    var root = document.documentElement;
    var saved = localStorage.getItem("theme");
    if (saved) root.setAttribute("data-theme", saved);
    var btn = document.getElementById("theme-toggle");
    function isDark() {
      var attr = root.getAttribute("data-theme");
      if (attr) return attr === "dark";
      return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    function updateIcon() {
      if (btn) btn.textContent = isDark() ? "☀️" : "🌙";
    }
    updateIcon();
    if (btn) {
      btn.addEventListener("click", function () {
        var next = isDark() ? "light" : "dark";
        root.setAttribute("data-theme", next);
        localStorage.setItem("theme", next);
        updateIcon();
      });
    }
  }

  /* ---------- Sidebar mobile toggle ---------- */
  function initSidebarToggle() {
    var toggle = document.getElementById("sidebar-toggle");
    var overlay = document.getElementById("sidebar-overlay");
    function close() {
      document.body.classList.remove("sidebar-open");
    }
    if (toggle) {
      toggle.addEventListener("click", function () {
        document.body.classList.toggle("sidebar-open");
      });
    }
    if (overlay) overlay.addEventListener("click", close);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
    document.addEventListener("click", function (e) {
      if (e.target.closest && e.target.closest("#sidebar-nav a")) close();
    });
  }

  /* ---------- Sidebar navigasi ---------- */
  function renderSidebar() {
    var nav = document.getElementById("sidebar-nav");
    if (!nav || typeof RUST_COURSE_CHAPTERS === "undefined") return;
    var currentPageId = getCurrentPageId();
    var currentChapterId = currentPageId ? currentPageId.split("-")[0] : null;
    var completed = getCompletedSet();
    var base = getBase();
    var html = "";

    RUST_COURSE_CHAPTERS.forEach(function (ch) {
      var isActiveChapter = ch.id === currentChapterId;
      var isAvailable = ch.status === "available" && ch.pages.length > 0;
      html +=
        '<div class="nav-chapter' +
        (isActiveChapter ? " is-active-chapter" : "") +
        (isAvailable ? "" : " nav-chapter-soon") +
        '" data-search-title="' +
        escapeAttr((ch.number + " " + ch.title).toLowerCase()) +
        '">';

      if (isAvailable) {
        var firstHref = base.chapters + "/" + ch.slug + "/" + ch.pages[0].file;
        html +=
          '<a class="nav-chapter-link" href="' +
          firstHref +
          '"><span class="nav-chapter-num">' +
          ch.number +
          "</span><span>" +
          escapeHtml(ch.title) +
          "</span></a>";

        if (ch.pages.length > 1) {
          html += '<ul class="nav-pages">';
          ch.pages.forEach(function (p) {
            var href = base.chapters + "/" + ch.slug + "/" + p.file;
            var isActive = p.id === currentPageId;
            var isDone = completed.has(p.id);
            html +=
              '<li><a class="nav-page-link' +
              (isActive ? " is-active" : "") +
              '" href="' +
              href +
              '" data-search-title="' +
              escapeAttr(p.title.toLowerCase()) +
              '"><span class="nav-check' +
              (isDone ? " is-done" : "") +
              '"></span>' +
              escapeHtml(p.title) +
              "</a></li>";
          });
          html += "</ul>";
        }
      } else {
        html +=
          '<span class="nav-chapter-link"><span class="nav-chapter-num">' +
          ch.number +
          "</span><span>" +
          escapeHtml(ch.title) +
          '</span><span class="soon-badge">Segera Hadir</span></span>';
      }
      html += "</div>";
    });

    nav.innerHTML = html;
  }

  /* ---------- Prev / next ---------- */
  function renderPageNav() {
    var container = document.getElementById("page-nav");
    if (!container) return;
    var currentPageId = getCurrentPageId();
    if (!currentPageId) return;
    var flat = getAvailablePagesFlat();
    var idx = flat.findIndex(function (p) {
      return p.pageId === currentPageId;
    });
    if (idx === -1) return;
    var base = getBase();
    var html = "<span></span>";

    if (idx > 0) {
      var prev = flat[idx - 1];
      html =
        '<a class="page-nav-link prev" href="' +
        base.chapters +
        "/" +
        prev.chapterSlug +
        "/" +
        prev.file +
        '"><span class="page-nav-dir">← Sebelumnya</span><span class="page-nav-title">' +
        escapeHtml(prev.label + " " + prev.title) +
        "</span></a>";
    }
    if (idx < flat.length - 1) {
      var next = flat[idx + 1];
      html +=
        '<a class="page-nav-link next" href="' +
        base.chapters +
        "/" +
        next.chapterSlug +
        "/" +
        next.file +
        '"><span class="page-nav-dir">Selanjutnya →</span><span class="page-nav-title">' +
        escapeHtml(next.label + " " + next.title) +
        "</span></a>";
    }
    container.innerHTML = html;
  }

  /* ---------- Tandai selesai + progress ---------- */
  function updateProgressUI() {
    var flat = getAvailablePagesFlat();
    var completed = getCompletedSet();
    var total = flat.length;
    var done = flat.filter(function (p) {
      return completed.has(p.pageId);
    }).length;
    var pct = total ? Math.round((done / total) * 100) : 0;

    var bar = document.getElementById("progress-bar");
    if (bar) bar.style.width = pct + "%";

    var homeBar = document.getElementById("home-progress-bar");
    if (homeBar) homeBar.style.width = pct + "%";

    var homeText = document.getElementById("home-progress-text");
    if (homeText) {
      homeText.textContent = total
        ? done + " dari " + total + " halaman selesai (" + pct + "%)"
        : "Mulai belajar untuk melihat progresmu di sini.";
    }
  }

  function initMarkComplete() {
    var checkbox = document.getElementById("mark-complete");
    if (!checkbox) return;
    var pageId = getCurrentPageId();
    if (!pageId) return;
    var completed = getCompletedSet();
    checkbox.checked = completed.has(pageId);
    checkbox.addEventListener("change", function () {
      var set = getCompletedSet();
      if (checkbox.checked) set.add(pageId);
      else set.delete(pageId);
      saveCompletedSet(set);
      renderSidebar();
      updateProgressUI();
    });
  }

  /* ---------- Grid bab di landing page ---------- */
  function renderChapterGrid() {
    var grid = document.getElementById("chapter-grid");
    if (!grid || typeof RUST_COURSE_CHAPTERS === "undefined") return;
    var base = getBase();
    var completed = getCompletedSet();
    var html = "";

    RUST_COURSE_CHAPTERS.forEach(function (ch) {
      var isAvailable = ch.status === "available" && ch.pages.length > 0;
      if (isAvailable) {
        var href = base.chapters + "/" + ch.slug + "/" + ch.pages[0].file;
        var doneCount = ch.pages.filter(function (p) {
          return completed.has(p.id);
        }).length;
        html +=
          '<a class="chapter-card" href="' +
          href +
          '"><span class="chapter-card-num">Bab ' +
          ch.number +
          '</span><span class="chapter-card-title">' +
          escapeHtml(ch.title) +
          '</span><span class="chapter-card-desc">' +
          escapeHtml(ch.desc || "") +
          "</span>" +
          (doneCount
            ? '<span class="chapter-card-desc">✅ ' + doneCount + "/" + ch.pages.length + " selesai</span>"
            : "") +
          "</a>";
      } else {
        html +=
          '<div class="chapter-card is-soon"><span class="chapter-card-num">Bab ' +
          ch.number +
          '</span><span class="chapter-card-title">' +
          escapeHtml(ch.title) +
          '</span><span class="chapter-card-desc">' +
          escapeHtml(ch.desc || "") +
          '</span><span class="soon-badge">Segera Hadir</span></div>';
      }
    });

    grid.innerHTML = html;
  }

  /* ---------- Blok kode: highlight + label + tombol salin ---------- */
  function enhanceCodeBlocks() {
    document.querySelectorAll("article pre").forEach(function (pre) {
      var codeEl = pre.querySelector("code");
      if (!codeEl) return;

      if (codeEl.className.indexOf("language-rust") !== -1 && window.RustHighlight) {
        codeEl.innerHTML = window.RustHighlight.highlightRust(codeEl.textContent);
      }

      var members = [pre];
      var sib = pre.previousElementSibling;
      while (sib && (sib.classList.contains("filename-label") || sib.classList.contains("code-badge"))) {
        members.unshift(sib);
        sib = sib.previousElementSibling;
      }

      var wrap = document.createElement("div");
      wrap.className = "code-wrap";
      members[0].parentNode.insertBefore(wrap, members[0]);
      members.forEach(function (el) {
        wrap.appendChild(el);
      });

      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "copy-btn";
      btn.textContent = "Salin";
      btn.setAttribute("aria-label", "Salin kode");
      btn.addEventListener("click", function () {
        var text = codeEl.textContent;
        var done = function () {
          btn.textContent = "Tersalin!";
          btn.classList.add("copied");
          setTimeout(function () {
            btn.textContent = "Salin";
            btn.classList.remove("copied");
          }, 1500);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done, done);
        } else {
          done();
        }
      });
      wrap.appendChild(btn);
    });
  }

  /* ---------- Quiz ---------- */
  function setupQuizzes() {
    document.querySelectorAll(".quiz").forEach(function (quiz) {
      var options = quiz.querySelectorAll(".quiz-option");
      var feedback = quiz.querySelector(".quiz-feedback");
      options.forEach(function (opt) {
        opt.addEventListener("click", function () {
          options.forEach(function (o) {
            o.disabled = true;
          });
          var correct = opt.getAttribute("data-correct") === "true";
          opt.classList.add(correct ? "is-correct" : "is-incorrect");
          if (!correct) {
            var correctOpt = quiz.querySelector('.quiz-option[data-correct="true"]');
            if (correctOpt) correctOpt.classList.add("is-correct");
          }
          if (feedback) {
            feedback.textContent = (correct ? "✅ Benar! " : "❌ Belum tepat. ") + (opt.getAttribute("data-explain") || "");
          }
        });
      });
    });
  }

  /* ---------- Pencarian sidebar ---------- */
  function initSearch() {
    var input = document.getElementById("search-input");
    if (!input) return;
    input.addEventListener("input", function () {
      var q = input.value.trim().toLowerCase();
      var chapters = document.querySelectorAll("#sidebar-nav .nav-chapter");
      chapters.forEach(function (chEl) {
        if (!q) {
          chEl.style.display = "";
          chEl.querySelectorAll(".nav-pages li").forEach(function (li) {
            li.style.display = "";
          });
          return;
        }
        var chapterMatches = (chEl.getAttribute("data-search-title") || "").indexOf(q) !== -1;
        var pageItems = chEl.querySelectorAll(".nav-pages li");
        var anyPageMatch = false;
        pageItems.forEach(function (li) {
          var link = li.querySelector(".nav-page-link");
          var match = !!(link && (link.getAttribute("data-search-title") || "").indexOf(q) !== -1);
          li.style.display = match ? "" : "none";
          if (match) anyPageMatch = true;
        });
        chEl.style.display = chapterMatches || anyPageMatch ? "" : "none";
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initTheme();
    initSidebarToggle();
    renderSidebar();
    renderPageNav();
    initMarkComplete();
    updateProgressUI();
    renderChapterGrid();
    enhanceCodeBlocks();
    setupQuizzes();
    initSearch();
  });
})();
