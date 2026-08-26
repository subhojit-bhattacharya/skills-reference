/**
 * Generate src/data.ts from public/Skills-For-Real-Engineers-Reference.md.
 *
 * The Markdown is the source of truth. This script is the only thing that
 * should ever write src/data.ts, which is why that file carries a generated
 * header. Run it with `npm run data` after editing the Markdown.
 *
 * Usage:
 *   node scripts/generate-data.mjs           write src/data.ts
 *   node scripts/generate-data.mjs --check   exit 1 if the file is out of date
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = join(root, "public", "Skills-For-Real-Engineers-Reference.md");
const TARGET = join(root, "src", "data.ts");

// Each skill's card shows its actual upstream SKILL.md, not this site's
// paraphrase of it. Those files are vendored here (fetched from
// github.com/mattpocock/skills) rather than fetched at build time, so a
// build never depends on GitHub being reachable.
const SKILL_SOURCES = join(root, "scripts", "skill-sources");

const md = readFileSync(SOURCE, "utf8");
const lines = md.split("\n");

/* ---------------------------------------------------------------- helpers */

/** Rows of the first Markdown table that follows a heading match. */
function tableAfter(headingRe) {
  const start = lines.findIndex((l) => headingRe.test(l));
  if (start === -1) throw new Error(`heading not found: ${headingRe}`);

  const rows = [];
  let seenTable = false;
  for (let i = start + 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith("|")) {
      seenTable = true;
      const cells = line.slice(1, -1).split("|").map((c) => c.trim());
      if (cells.every((c) => /^-+$/.test(c))) continue; // separator
      rows.push(cells);
    } else if (seenTable && line === "") {
      break;
    }
  }
  return rows.slice(1); // drop the header row
}

/**
 * Parse a run of Markdown list items into labelled fields.
 * Top-level `- **Label:** text` becomes a field. Indented `  - text` becomes
 * an item under the field above it. Wrapped lines rejoin onto whichever of
 * the two they belong to.
 */
function parseFields(body) {
  const out = [];
  let field = null;
  let item = null;

  for (const raw of body) {
    const line = raw.replace(/\s+$/, "");
    if (!line.trim()) {
      continue;
    }

    const top = line.match(/^- \*\*(.+?):\*\*\s*(.*)$/);
    if (top) {
      field = { label: top[1], value: top[2], items: [] };
      out.push(field);
      item = null;
      continue;
    }

    const nested = line.match(/^ {2}- (.*)$/);
    if (nested && field) {
      item = { text: nested[1] };
      field.items.push(item);
      continue;
    }

    const cont = line.match(/^\s+(.*)$/);
    if (cont && field) {
      if (item) item.text += " " + cont[1];
      else field.value += (field.value ? " " : "") + cont[1];
    }
  }

  return out;
}

/* ----------------------------------------------------------------- skills */

// The appendix is the authority on which bucket each skill sits in and
// whether the plugin ships it.
const appendix = new Map(
  tableAfter(/^## 14\. Appendix: Full Skill Index/).map((r) => [
    r[1],
    { bucket: r[2], mode: r[3].toLowerCase(), plugin: r[4] === "Yes" },
  ])
);

const skills = [];
for (let i = 0; i < lines.length; i++) {
  const heading = lines[i].match(/^#### 6\.\d+\.\d+ (.+)$/);
  if (!heading) continue;

  const name = heading[1].trim();

  // The record runs to the horizontal rule that closes it.
  let end = i + 1;
  while (end < lines.length && lines[end].trim() !== "---") end++;

  const body = lines.slice(i + 1, end);
  const fields = parseFields(body);
  const take = (label) => fields.find((f) => f.label === label)?.value ?? "";

  const path = take("Path").replace(/`/g, "");
  const meta = appendix.get(name);
  if (!meta) throw new Error(`skill missing from the appendix: ${name}`);

  const modeWord = take("Mode");
  const mode = modeWord.startsWith("User") ? "user" : "model";
  if (mode !== meta.mode) {
    throw new Error(`mode disagrees for ${name}: record ${mode}, appendix ${meta.mode}`);
  }

  // misc and in-progress records carry no Invocation line, because those
  // skills are not promoted in the plugin. The slash form is still the name.
  const invocation = take("Invocation").replace(/`/g, "") || `/${name}`;

  const skipped = new Set(["Invocation", "Mode", "Path", "Purpose"]);
  const rest = fields
    .filter((f) => !skipped.has(f.label))
    .map((f) => {
      const out = { label: f.label, value: f.value };
      if (f.items.length) out.items = f.items.map((it) => it.text);
      return out;
    });

  // The exact contents of the skill's own SKILL.md, vendored under
  // scripts/skill-sources/, so a reader can copy the authoritative upstream
  // text rather than this page's paraphrase of it.
  let source;
  try {
    source = readFileSync(join(SKILL_SOURCES, `${name}.md`), "utf8").trim();
  } catch {
    throw new Error(`no vendored SKILL.md for ${name} (expected scripts/skill-sources/${name}.md)`);
  }

  skills.push({
    name,
    bucket: meta.bucket,
    invocation,
    mode,
    path,
    purpose: take("Purpose"),
    fields: rest,
    plugin: meta.plugin,
    source,
  });

  i = end;
}

if (skills.length !== appendix.size) {
  throw new Error(`parsed ${skills.length} skills but the appendix lists ${appendix.size}`);
}

/* ------------------------------------------------------------------ vocab */

const vocab = [];
let group = null;
for (let i = 0; i < lines.length; i++) {
  const section = lines[i].match(/^### 4\.\d+ (.+)$/);
  if (section) {
    group = section[1].trim();
    continue;
  }
  if (/^## 5\./.test(lines[i])) group = null;
  if (!group) continue;

  const term = lines[i].match(/^\*\*(.+)\*\*$/);
  if (!term || !lines[i + 1]?.startsWith(": ")) continue;

  let definition = lines[i + 1].slice(2).trim();
  let j = i + 2;
  while (j < lines.length && lines[j].trim() && !lines[j].startsWith("**")) {
    definition += " " + lines[j].trim();
    j++;
  }

  vocab.push({ term: term[1].replace(/`/g, ""), group, definition });
  i = j - 1;
}

/* ----------------------------------------------------------------- tables */

const failures = tableAfter(/^### 1\.4 Four failure modes and their fixes/);
const flow = tableAfter(/^### 5\.1 The main flow: idea to shipped/);
const onramps = tableAfter(/^### 5\.3 On-ramps/);
const books = tableAfter(/^## 11\. Source Library/);

/* ------------------------------------------------------------------ emit */

const file = `// Generated from Skills-For-Real-Engineers-Reference.md. Do not edit by hand.
// Run \`npm run data\` after editing the Markdown.

export type Field = { label: string; value: string; items?: string[] };
export type Skill = {
  name: string; bucket: string; invocation: string;
  mode: string; path: string; purpose: string; plugin: boolean;
  fields: Field[]; source: string;
};

export const skills: Skill[] = ${JSON.stringify(skills, null, 1)};

export const failures: string[][] = ${JSON.stringify(failures)};

export const flow: string[][] = ${JSON.stringify(flow)};

export const onramps: string[][] = ${JSON.stringify(onramps)};

export const books: string[][] = ${JSON.stringify(books)};

export type Term = { term: string; group: string; definition: string };
export const vocab: Term[] = ${JSON.stringify(vocab, null, 1)};
`;

if (process.argv.includes("--check")) {
  const current = readFileSync(TARGET, "utf8");
  if (current !== file) {
    console.error("src/data.ts is out of date. Run: npm run data");
    process.exit(1);
  }
  console.log("src/data.ts is up to date.");
} else {
  mkdirSync(dirname(TARGET), { recursive: true });
  writeFileSync(TARGET, file);
  console.log(
    `Wrote src/data.ts: ${skills.length} skills, ${vocab.length} terms, ` +
      `${failures.length} failure modes, ${flow.length} flow steps, ` +
      `${onramps.length} on-ramps, ${books.length} books.`
  );
}
