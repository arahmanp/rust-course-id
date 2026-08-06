/*
 * rust-highlight.js — syntax highlighter Rust ringan, tanpa dependency.
 * Bukan tokenizer sempurna (tidak memakai full parser Rust), tapi cukup
 * akurat untuk kode contoh level kursus. Lihat CLAUDE.md §10 kenapa proyek
 * ini sengaja tidak memakai highlight.js/Prism dari CDN.
 */
(function () {
  "use strict";

  var KEYWORDS = [
    "as", "async", "await", "break", "const", "continue", "crate", "dyn",
    "else", "enum", "extern", "false", "fn", "for", "if", "impl", "in",
    "let", "loop", "match", "mod", "move", "mut", "pub", "ref", "return",
    "self", "Self", "static", "struct", "super", "trait", "true", "type",
    "union", "unsafe", "use", "where", "while", "yield"
  ];

  var TOKEN_RE = new RegExp(
    "(?<comment>//.*?$|/\\*[\\s\\S]*?\\*/)" +
    "|(?<string>r#*\"[\\s\\S]*?\"#*|b?\"(?:\\\\.|[^\"\\\\])*\"|b?'(?:\\\\.|[^'\\\\])')" +
    "|(?<lifetime>'[a-zA-Z_]\\w*\\b)" +
    "|(?<attribute>#!?\\[[^\\]]*\\])" +
    "|(?<macro>\\b[a-zA-Z_]\\w*!)" +
    "|(?<number>\\b(?:0x[0-9a-fA-F_]+|0o[0-7_]+|0b[01_]+|\\d[\\d_]*(?:\\.\\d[\\d_]*)?(?:[eE][+-]?\\d+)?(?:_?(?:i8|i16|i32|i64|i128|isize|u8|u16|u32|u64|u128|usize|f32|f64))?)\\b)" +
    "|(?<keyword>\\b(?:" + KEYWORDS.join("|") + ")\\b)" +
    "|(?<type>\\b[A-Z]\\w*\\b)" +
    "|(?<call>\\b[a-zA-Z_]\\w*(?=\\s*\\())",
    "gm"
  );

  function escapeHtml(s) {
    return s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function highlightRust(code) {
    var out = "";
    var lastIndex = 0;
    var m;
    TOKEN_RE.lastIndex = 0;
    while ((m = TOKEN_RE.exec(code)) !== null) {
      out += escapeHtml(code.slice(lastIndex, m.index));
      var g = m.groups || {};
      var cls =
        (g.comment !== undefined && "tok-comment") ||
        (g.string !== undefined && "tok-string") ||
        (g.lifetime !== undefined && "tok-lifetime") ||
        (g.attribute !== undefined && "tok-attribute") ||
        (g.macro !== undefined && "tok-macro") ||
        (g.number !== undefined && "tok-number") ||
        (g.keyword !== undefined && "tok-keyword") ||
        (g.type !== undefined && "tok-type") ||
        (g.call !== undefined && "tok-call") ||
        null;
      out += cls ? '<span class="' + cls + '">' + escapeHtml(m[0]) + "</span>" : escapeHtml(m[0]);
      lastIndex = TOKEN_RE.lastIndex;
      if (m.index === TOKEN_RE.lastIndex) TOKEN_RE.lastIndex++;
    }
    out += escapeHtml(code.slice(lastIndex));
    return out;
  }

  window.RustHighlight = { highlightRust: highlightRust };
})();
