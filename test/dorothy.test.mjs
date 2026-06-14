// Dorothy production tests — node:test, zero extra dependencies.
// Run: node --test test/dorothy.test.mjs

import { test, describe } from "node:test";
import assert from "node:assert/strict";

// ──────────────────────────────────────────────────────────────────────────────
// Helpers extracted from tool/learn.js (copy-sync, do not deviate from source)
// ──────────────────────────────────────────────────────────────────────────────
function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function mdToHtml(md) {
  const lines = md.split("\n");
  let html = "", listType = null, inQuote = false, inCode = false, code = "";
  const inline = (t) =>
    esc(t)
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      .replace(/\[(established|exploratory|speculative|unverifiable)\]/gi, '<span class="tierflag t-$1">$1</span>');
  const closeList = () => { if (listType) { html += `</${listType}>`; listType = null; } };
  const closeQuote = () => { if (inQuote) { html += "</blockquote>"; inQuote = false; } };
  for (const raw of lines) {
    if (raw.trim().startsWith("```")) {
      if (inCode) { html += `<pre><code>${esc(code)}</code></pre>`; inCode = false; code = ""; }
      else { closeList(); closeQuote(); inCode = true; code = ""; }
      continue;
    }
    if (inCode) { code += (code ? "\n" : "") + raw; continue; }
    const l = raw.trim();
    let m;
    if (!l) { closeList(); closeQuote(); continue; }
    if (l.startsWith("## ")) { closeList(); closeQuote(); html += `<h3>${inline(l.slice(3))}</h3>`; }
    else if (l.startsWith("> ")) { closeList(); if (!inQuote) { html += "<blockquote>"; inQuote = true; } html += `<p>${inline(l.slice(2))}</p>`; }
    else if ((m = l.match(/^(\d+)\.\s+(.*)/))) { closeQuote(); if (listType !== "ol") { closeList(); html += "<ol>"; listType = "ol"; } html += `<li>${inline(m[2])}</li>`; }
    else if (l.startsWith("- ") || l.startsWith("• ") || l.startsWith("— ")) { closeQuote(); if (listType !== "ul") { closeList(); html += "<ul>"; listType = "ul"; } html += `<li>${inline(l.slice(2))}</li>`; }
    else { closeList(); closeQuote(); html += `<p>${inline(l)}</p>`; }
  }
  closeList(); closeQuote();
  if (inCode) html += `<pre><code>${esc(code)}</code></pre>`;
  return html;
}

// completionStatus extracted from api/argue.js
function completionStatus(stopReason, errored) {
  if (errored) return "error";
  switch (stopReason) {
    case "max_tokens":
    case "length":
    case "pause_turn": return "incomplete";
    case "refusal": return "refusal";
    default: return "complete";
  }
}

// Minimal SSE chunk assembler extracted from the learn.js stream loop (pure fn).
// Parses a full SSE text (multi-event) into an ordered list of { ev, data } events,
// then applies them to a message object — same logic as the client, stripped of DOM.
function parseSSE(raw) {
  const events = [];
  const chunks = raw.split("\n\n");
  for (const chunk of chunks) {
    if (!chunk.trim()) continue;
    let ev = "message", dataStr = "";
    for (const line of chunk.split("\n")) {
      const l = line.trimStart();
      if (l.startsWith("event:")) ev = l.slice(6).trim();
      else if (l.startsWith("data:")) dataStr += l.slice(5).trim();
      // keep-alive SSE comment lines — skip
    }
    if (!dataStr) continue;
    let d; try { d = JSON.parse(dataStr); } catch { continue; }
    events.push({ ev, d });
  }
  return events;
}

function applySSE(events) {
  const pend = { content: "", thinking: "", finish: null, model: null, errorMsg: null, stopReason: null };
  let streamErr = null;
  for (const { ev, d } of events) {
    if (ev === "thinking") pend.thinking += d.delta || "";
    else if (ev === "text") { pend.content += d.delta || ""; pend.pending = false; }
    else if (ev === "meta") { if (d.model) pend.model = d.model; }
    else if (ev === "done") {
      if (d.model) pend.model = d.model;
      pend.stopReason = d.stop_reason || null;
      if (pend.finish !== "error") pend.finish = d.status || "complete";
    }
    else if (ev === "error") {
      streamErr = d.message || "error";
      pend.errorMsg = streamErr; pend.finish = "error";
    }
  }
  if (!pend.finish) pend.finish = "interrupted";
  return pend;
}

function makeSSE(events) {
  return events.map(({ ev, data }) =>
    `event: ${ev}\ndata: ${JSON.stringify(data)}\n\n`
  ).join("");
}

// ──────────────────────────────────────────────────────────────────────────────
// Tests
// ──────────────────────────────────────────────────────────────────────────────

describe("completionStatus", () => {
  test("errored → error regardless of stopReason", () => {
    assert.equal(completionStatus("end_turn", true), "error");
    assert.equal(completionStatus(null, true), "error");
  });
  test("max_tokens → incomplete (the key bug this fixes)", () => {
    assert.equal(completionStatus("max_tokens", false), "incomplete");
  });
  test("length → incomplete (Ollama equivalent)", () => {
    assert.equal(completionStatus("length", false), "incomplete");
  });
  test("end_turn → complete", () => {
    assert.equal(completionStatus("end_turn", false), "complete");
  });
  test("stop_sequence → complete", () => {
    assert.equal(completionStatus("stop_sequence", false), "complete");
  });
  test("null → complete (clean close with no explicit stop)", () => {
    assert.equal(completionStatus(null, false), "complete");
  });
  test("refusal → refusal", () => {
    assert.equal(completionStatus("refusal", false), "refusal");
  });
});

describe("SSE stream assembly", () => {
  test("normal complete stream builds content and sets finish=complete", () => {
    const raw = makeSSE([
      { ev: "meta", data: { model: "claude-sonnet-4-6", routed: { tier: "medium" } } },
      { ev: "text", data: { delta: "Hello " } },
      { ev: "text", data: { delta: "world." } },
      { ev: "done", data: { model: "claude-sonnet-4-6", stop_reason: "end_turn", status: "complete" } },
    ]);
    const pend = applySSE(parseSSE(raw));
    assert.equal(pend.content, "Hello world.");
    assert.equal(pend.finish, "complete");
    assert.equal(pend.model, "claude-sonnet-4-6");
  });

  test("max_tokens stream finishes as incomplete not complete", () => {
    const raw = makeSSE([
      { ev: "text", data: { delta: "This is truncated mid" } },
      { ev: "done", data: { model: "claude-opus-4-8", stop_reason: "max_tokens", status: "incomplete" } },
    ]);
    const pend = applySSE(parseSSE(raw));
    assert.equal(pend.content, "This is truncated mid");
    assert.equal(pend.finish, "incomplete");
    assert.equal(pend.stopReason, "max_tokens");
  });

  test("stream error mid-text sets finish=error and preserves partial content", () => {
    const raw = makeSSE([
      { ev: "text", data: { delta: "Partial answer here" } },
      { ev: "error", data: { message: "upstream connection lost" } },
    ]);
    const pend = applySSE(parseSSE(raw));
    assert.equal(pend.content, "Partial answer here");
    assert.equal(pend.finish, "error");
    assert.equal(pend.errorMsg, "upstream connection lost");
  });

  test("error THEN done does not overwrite finish=error", () => {
    const raw = makeSSE([
      { ev: "text", data: { delta: "some text" } },
      { ev: "error", data: { message: "stream error" } },
      { ev: "done", data: { model: "claude-sonnet-4-6", stop_reason: "end_turn", status: "complete" } },
    ]);
    const pend = applySSE(parseSSE(raw));
    assert.equal(pend.finish, "error");
  });

  test("no done event at all → finish=interrupted (dropped connection)", () => {
    const raw = makeSSE([
      { ev: "meta", data: { model: "claude-sonnet-4-6" } },
      { ev: "text", data: { delta: "Started but" } },
    ]);
    const pend = applySSE(parseSSE(raw));
    assert.equal(pend.finish, "interrupted");
    assert.equal(pend.content, "Started but");
  });

  test("thinking delta accumulates separately from text", () => {
    const raw = makeSSE([
      { ev: "thinking", data: { delta: "Let me reason about this..." } },
      { ev: "text", data: { delta: "Answer." } },
      { ev: "done", data: { status: "complete" } },
    ]);
    const pend = applySSE(parseSSE(raw));
    assert.equal(pend.thinking, "Let me reason about this...");
    assert.equal(pend.content, "Answer.");
    assert.equal(pend.finish, "complete");
  });

  test("SSE keep-alive comment lines are silently ignored", () => {
    // keep-alive lines are `: keep-alive\n\n` — no data: prefix, should not crash
    const raw = `: keep-alive\n\n` + makeSSE([
      { ev: "text", data: { delta: "hi" } },
      { ev: "done", data: { status: "complete" } },
    ]);
    const pend = applySSE(parseSSE(raw));
    assert.equal(pend.content, "hi");
    assert.equal(pend.finish, "complete");
  });
});

describe("mdToHtml — markdown rendering", () => {
  test("plain paragraph", () => {
    assert.match(mdToHtml("Hello world."), /^<p>Hello world\.<\/p>$/);
  });

  test("bold", () => {
    assert.match(mdToHtml("**bold** text"), /<strong>bold<\/strong>/);
  });

  test("italic", () => {
    assert.match(mdToHtml("*italic* text"), /<em>italic<\/em>/);
  });

  test("inline code", () => {
    const h = mdToHtml("use `npm install`");
    assert.match(h, /<code>npm install<\/code>/);
  });

  test("fenced code block renders as pre>code", () => {
    const h = mdToHtml("```\nconst x = 1;\n```");
    assert.match(h, /<pre><code>/);
    assert.match(h, /const x = 1;/);
    assert.match(h, /<\/code><\/pre>/);
  });

  test("fenced code block escapes HTML special chars", () => {
    const h = mdToHtml("```\n<script>alert(1)</script>\n```");
    assert.ok(!h.includes("<script>"), "raw <script> must be escaped");
    assert.match(h, /&lt;script&gt;/);
  });

  test("unterminated code fence still renders (mid-stream safety)", () => {
    const h = mdToHtml("```\nconst x = 1;");
    assert.match(h, /<pre><code>/);
    assert.match(h, /const x = 1;/);
  });

  test("heading ## → h3", () => {
    assert.match(mdToHtml("## My Header"), /<h3>My Header<\/h3>/);
  });

  test("unordered list", () => {
    const h = mdToHtml("- one\n- two\n- three");
    assert.match(h, /<ul>/);
    assert.match(h, /<li>one<\/li>/);
    assert.match(h, /<li>three<\/li>/);
    assert.match(h, /<\/ul>/);
  });

  test("ordered list", () => {
    const h = mdToHtml("1. first\n2. second");
    assert.match(h, /<ol>/);
    assert.match(h, /<li>first<\/li>/);
  });

  test("blockquote", () => {
    const h = mdToHtml("> a quote");
    assert.match(h, /<blockquote>/);
    assert.match(h, /<p>a quote<\/p>/);
  });

  test("tier flag spans render correctly", () => {
    const h = mdToHtml("this claim is [established]");
    assert.match(h, /class="tierflag t-established"/);
  });

  test("link renders with target=_blank and rel=noopener", () => {
    const h = mdToHtml("[example](https://example.com)");
    assert.match(h, /href="https:\/\/example\.com"/);
    assert.match(h, /target="_blank"/);
    assert.match(h, /rel="noopener"/);
  });

  test("XSS: angle brackets in plain text are escaped", () => {
    const h = mdToHtml("a <script>bad()</script> thing");
    assert.ok(!h.includes("<script>"), "raw <script> must not survive");
  });

  test("XSS: bold content is escaped", () => {
    const h = mdToHtml("**<b>injected</b>**");
    assert.ok(!h.includes("<b>injected</b>"), "raw HTML inside bold must be escaped");
  });

  test("empty string → empty output", () => {
    assert.equal(mdToHtml(""), "");
  });

  test("multiple empty lines don't create extra tags", () => {
    const h = mdToHtml("para one\n\n\n\npara two");
    assert.match(h, /<p>para one<\/p>/);
    assert.match(h, /<p>para two<\/p>/);
    assert.ok(!h.includes("<p></p>"), "empty paragraphs must not appear");
  });
});
