/*
 * main.js — logika situs: sidebar dari chapters-data.js, dark mode, progress
 * (localStorage), quiz, syntax highlight & tombol salin kode, prev/next,
 * search. Ditulis dengan jQuery, dan memakai komponen JS Bootstrap
 * (Offcanvas) untuk sidebar mobile. Tidak ada fetch() dan tidak ada ES
 * module — lihat CLAUDE.md §10.
 */
(function ($) {
  "use strict";

  var PROGRESS_KEY = "rustCourseProgress";
  var THEME_KEY = "theme";

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
    var main = $("main[data-page-id]").first();
    return main.length ? main.attr("data-page-id") : null;
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

  /* ---------- Tema terang/gelap (data-bs-theme milik Bootstrap) ---------- */
  function initTheme() {
    var $root = $("html");
    var saved = localStorage.getItem(THEME_KEY);
    var $btn = $("#theme-toggle");

    function systemPrefersDark() {
      return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    function apply(theme) {
      $root.attr("data-bs-theme", theme);
      if ($btn.length) $btn.text(theme === "dark" ? "☀️" : "🌙");
    }

    apply(saved || (systemPrefersDark() ? "dark" : "light"));

    if (window.matchMedia) {
      window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (e) {
        if (!localStorage.getItem(THEME_KEY)) apply(e.matches ? "dark" : "light");
      });
    }

    $btn.on("click", function () {
      var next = $root.attr("data-bs-theme") === "dark" ? "light" : "dark";
      localStorage.setItem(THEME_KEY, next);
      apply(next);
    });
  }

  /* ---------- Sidebar mobile: tutup offcanvas saat sebuah link diklik ---------- */
  function initSidebarClose() {
    var sidebarEl = document.getElementById("sidebar");
    if (!sidebarEl || !window.bootstrap) return;
    $(document).on("click", "#sidebar-nav a, .sidebar-search a", function () {
      var instance = bootstrap.Offcanvas.getInstance(sidebarEl);
      if (instance) instance.hide();
    });
  }

  /* ---------- Sidebar navigasi ---------- */
  function renderSidebar() {
    var $nav = $("#sidebar-nav");
    if (!$nav.length || typeof RUST_COURSE_CHAPTERS === "undefined") return;
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
          '</span><span class="nav-chapter-title">' +
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
              '"></span><span class="nav-page-title">' +
              escapeHtml(p.title) +
              "</span></a></li>";
          });
          html += "</ul>";
        }
      } else {
        html +=
          '<span class="nav-chapter-link"><span class="nav-chapter-num">' +
          ch.number +
          '</span><span class="nav-chapter-title">' +
          escapeHtml(ch.title) +
          '</span><span class="soon-badge badge text-bg-secondary">Segera Hadir</span></span>';
      }
      html += "</div>";
    });

    $nav.html(html);
  }

  /* ---------- Prev / next ---------- */
  function renderPageNav() {
    var $container = $("#page-nav");
    if (!$container.length) return;
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
    $container.html(html);
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

    $("#progress-bar").css("width", pct + "%").attr("aria-valuenow", pct);
    $("#home-progress-bar").css("width", pct + "%").attr("aria-valuenow", pct);

    var $homeText = $("#home-progress-text");
    if ($homeText.length) {
      $homeText.text(
        total ? done + " dari " + total + " halaman selesai (" + pct + "%)" : "Mulai belajar untuk melihat progresmu di sini."
      );
    }
  }

  function initMarkComplete() {
    var $checkbox = $("#mark-complete");
    if (!$checkbox.length) return;
    var pageId = getCurrentPageId();
    if (!pageId) return;
    var completed = getCompletedSet();
    $checkbox.prop("checked", completed.has(pageId));
    $checkbox.on("change", function () {
      var set = getCompletedSet();
      if ($checkbox.is(":checked")) set.add(pageId);
      else set.delete(pageId);
      saveCompletedSet(set);
      renderSidebar();
      updateProgressUI();
    });
  }

  /* ---------- Grid bab di landing page (kartu Bootstrap) ---------- */
  function renderChapterGrid() {
    var $grid = $("#chapter-grid");
    if (!$grid.length || typeof RUST_COURSE_CHAPTERS === "undefined") return;
    var base = getBase();
    var completed = getCompletedSet();
    var html = "";

    RUST_COURSE_CHAPTERS.forEach(function (ch) {
      var isAvailable = ch.status === "available" && ch.pages.length > 0;
      html += '<div class="col">';
      if (isAvailable) {
        var href = base.chapters + "/" + ch.slug + "/" + ch.pages[0].file;
        var doneCount = ch.pages.filter(function (p) {
          return completed.has(p.id);
        }).length;
        html +=
          '<a class="chapter-card card card-body shadow-sm text-decoration-none" href="' +
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
          '<div class="chapter-card is-soon card card-body"><span class="chapter-card-num">Bab ' +
          ch.number +
          '</span><span class="chapter-card-title">' +
          escapeHtml(ch.title) +
          '</span><span class="chapter-card-desc">' +
          escapeHtml(ch.desc || "") +
          '</span><span class="soon-badge badge text-bg-secondary align-self-start">Segera Hadir</span></div>';
      }
      html += "</div>";
    });

    $grid.html(html);
  }

  /* ---------- Blok kode: highlight + label + tombol salin ---------- */
  function enhanceCodeBlocks() {
    $("article pre").each(function () {
      var $pre = $(this);
      var $code = $pre.find("code").first();
      if (!$code.length) return;

      if ($code.hasClass("language-rust") && window.RustHighlight) {
        $code.html(window.RustHighlight.highlightRust($code.text()));
      }

      var $members = $pre;
      var $sib = $pre.prev();
      while ($sib.length && ($sib.hasClass("filename-label") || $sib.hasClass("code-badge"))) {
        $members = $sib.add($members);
        $sib = $sib.prev();
      }

      var $wrap = $('<div class="code-wrap"></div>');
      $members.first().before($wrap);
      $wrap.append($members);

      var $btn = $(
        '<button type="button" class="copy-btn btn btn-sm btn-outline-secondary" aria-label="Salin kode">Salin</button>'
      );
      $btn.on("click", function () {
        var text = $code.text();
        var done = function () {
          $btn.text("Tersalin!").addClass("copied");
          setTimeout(function () {
            $btn.text("Salin").removeClass("copied");
          }, 1500);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done, done);
        } else {
          done();
        }
      });
      $wrap.append($btn);
    });
  }

  /* ---------- Perkaya komponen konten dengan class Bootstrap ---------- */
  function applyBootstrapEnhancements() {
    $(".callout").addClass("alert");
    $(".quiz").addClass("card card-body shadow-sm");
    $(".quiz-option").addClass("btn text-start");
    $(".summary-box").addClass("card card-body");
  }

  /* ---------- Quiz ---------- */
  function setupQuizzes() {
    $(".quiz").each(function () {
      var $quiz = $(this);
      var $options = $quiz.find(".quiz-option");
      var $feedback = $quiz.find(".quiz-feedback");
      $options.on("click", function () {
        var $opt = $(this);
        $options.prop("disabled", true);
        var correct = $opt.attr("data-correct") === "true";
        $opt.addClass(correct ? "is-correct" : "is-incorrect");
        if (!correct) {
          $quiz.find('.quiz-option[data-correct="true"]').addClass("is-correct");
        }
        if ($feedback.length) {
          $feedback.text((correct ? "✅ Benar! " : "❌ Belum tepat. ") + ($opt.attr("data-explain") || ""));
        }
      });
    });
  }

  /* ---------- Pencarian sidebar ---------- */
  function initSearch() {
    var $input = $("#search-input");
    if (!$input.length) return;
    $input.on("input", function () {
      var q = $input.val().trim().toLowerCase();
      $("#sidebar-nav .nav-chapter").each(function () {
        var $chEl = $(this);
        if (!q) {
          $chEl.show();
          $chEl.find(".nav-pages li").show();
          return;
        }
        var chapterMatches = ($chEl.attr("data-search-title") || "").indexOf(q) !== -1;
        var anyPageMatch = false;
        $chEl.find(".nav-pages li").each(function () {
          var $li = $(this);
          var $link = $li.find(".nav-page-link");
          var match = ($link.attr("data-search-title") || "").indexOf(q) !== -1;
          $li.toggle(match);
          if (match) anyPageMatch = true;
        });
        $chEl.toggle(chapterMatches || anyPageMatch);
      });
    });
  }

  $(function () {
    initTheme();
    initSidebarClose();
    renderSidebar();
    renderPageNav();
    initMarkComplete();
    updateProgressUI();
    renderChapterGrid();
    applyBootstrapEnhancements();
    enhanceCodeBlocks();
    setupQuizzes();
    initSearch();
  });
})(jQuery);
