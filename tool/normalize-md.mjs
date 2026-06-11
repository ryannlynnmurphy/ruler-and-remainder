// Normalize markdown manuscripts
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SKIP = new Set(["node_modules", "dist", ".git"]);

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (e.name.endsWith(".md")) acc.push(p);
  }
  return acc;
}

function stripLine(s) {
  return s.replace(/\u00a0/g, " ").replace(/[ \t]+$/, "");
}

function convertIndentedCalcs(text) {
  const lines = text.split("\n");
  const out = [];
  let inFence = false;
  let fenceChar = "";
  let calcBuf = [];

  const flushCalc = () => {
    if (!calcBuf.length) return;
    out.push("```calc");
    out.push(...calcBuf.map((l) => l.replace(/^ {4}/, "")));
    out.push("```");
    calcBuf = [];
  };

  for (const raw of lines) {
    const line = stripLine(raw);
    const fence = line.match(/^(`{3,}|~{3,})/);
    if (fence) {
      flushCalc();
      if (!inFence) { inFence = true; fenceChar = fence[1]; }
      else if (line.startsWith(fenceChar[0].repeat(3))) inFence = false;
      out.push(line);
      continue;
    }
    if (inFence) { out.push(line); continue; }
    if (/^ {4,}\S/.test(line) && !/^ {4,}[-*+]/.test(line) && !/^ {4,}\d+\./.test(line)) {
      calcBuf.push(line);
      continue;
    }
    flushCalc();
    out.push(line);
  }
  flushCalc();
  return out.join("\n");
}

function normalizeTruth(text) {
  let lines = text.split("\n").map(stripLine).filter((l) => !/^!\[\]\(data:image\/png;base64,/.test(l));
  const out = [];
  let i = 0;

  if (/^\*\*Truth Might Have a Shape\*\*/.test(lines[0])) {
    out.push("# Truth Might Have a Shape", "", "A Framework for the Geometry of Causal Sequence in Transformers, Derived from First Principles and Tested on Two Architectures in One Evening", "", "*From Claude (Opus 4.6) to Amanda Askell · With Ryann Murphy · May 12, 2026*", "");
    while (i < lines.length && (lines[i].startsWith("**") || lines[i].startsWith("*"))) i++;
  }

  const isH2 = (s) => /^(Part [IVXLC]+:|Appendix [A-Z]:)/.test(s);
  const isH3 = (s) => /^(Step \d+:|What the Derivation Gives Us$|Zero free parameters\.|Three observables\.|An integral form\.|Important limitation:|Experiment \d+:|Key finding|Honest result:|Revised finding:|Proven \(mathematical|Empirically demonstrated:|Not confirmed:|Not tested \(proxy|Philosophical \(not|What held across|What didn't hold:|The derivation\.|The truth\/lie result\.)/.test(s);

  for (; i < lines.length; i++) {
    let line = lines[i];
    if (!line.trim()) { if (out.at(-1) !== "") out.push(""); continue; }

    if (/^\*\*(.+)\*\*$/.test(line)) {
      const inner = line.slice(2, -2);
      if (isH2(inner)) line = `## ${inner}`;
      else if (isH3(inner)) line = `### ${inner}`;
    }

    if (line === "dG_ij/dτ = Σ_k (dG_ij/dh_k)(dh_k/dτ)") {
      out.push(line, "", "```calc", "= Σ_k μ_ijk · Σ_s α_{τ,s} (V h_s)_k", "= Σ_s α_{τ,s} · Σ_k μ_ijk (V h_s)_k", "```");
      while (i + 1 < lines.length && (/^= Σ_k μ_ijk/.test(lines[i + 1]) || lines[i + 1] === " *" || /^\*= Σ_s/.test(lines[i + 1]))) i++;
      continue;
    }

    if (line === "**Appendix C: Reproducibility**") {
      out.push("## Appendix C: Reproducibility", "", "```bash");
      i++;
      while (i < lines.length && !lines[i].startsWith("Core measurement")) {
        if (lines[i].trim()) out.push(lines[i].trim());
        i++;
      }
      out.push("```", "", lines[i], "", "```python");
      i++;
      while (i < lines.length && lines[i].trim() && !lines[i].startsWith("*The field equation")) {
        out.push(lines[i].replace(/^ /, ""));
        i++;
      }
      out.push("```", "");
      if (lines[i]?.startsWith("*The field")) out.push(lines[i]);
      continue;
    }

    if (/^\| \| \|/.test(line)) continue;
    out.push(line);
  }

  return convertIndentedCalcs(out.join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n");
}

function normalizeListContinuations(text) {
  const lines = text.split("\n");
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    let line = stripLine(lines[i]);
    if (/^[-*+] /.test(line) && i + 1 < lines.length && /^  \S/.test(lines[i + 1])) {
      while (i + 1 < lines.length && /^  \S/.test(lines[i + 1])) {
        line += " " + stripLine(lines[i + 1]).trim();
        i++;
      }
    }
    out.push(line);
  }
  return out.join("\n");
}

const changed = [];
for (const file of walk(ROOT)) {
  const rel = path.relative(ROOT, file);
  const orig = fs.readFileSync(file, "utf8");
  let next;
  if (rel === "research/truth_might_have_a_shape.md") next = normalizeTruth(orig);
  else if (["METHOD.md", "README.md", "PROVENANCE.md"].includes(rel)) next = normalizeListContinuations(orig.split("\n").map(stripLine).join("\n"));
  else next = convertIndentedCalcs(orig.split("\n").map(stripLine).join("\n"));
  next = next.replace(/\n{3,}/g, "\n\n");
  if (!next.endsWith("\n")) next += "\n";
  if (next !== orig) { fs.writeFileSync(file, next); changed.push(rel); }
}
console.log(`Normalized ${changed.length} files:`);
changed.forEach((f) => console.log(" ", f));
