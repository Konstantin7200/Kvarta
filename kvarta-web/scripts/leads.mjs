#!/usr/bin/env node
import { createClient } from "@libsql/client/web";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function loadLocalEnv() {
  const path = join(root, ".env");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    const key = m[1];
    let value = m[2];
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadLocalEnv();

const url = process.env.DATABASE_URL?.trim();
if (!url) {
  console.error(
    "DATABASE_URL is not set. Заполните kvarta-web/.env или переменные Vercel.",
  );
  process.exit(1);
}

const remote = url.startsWith("libsql:") || url.startsWith("https:");
if (remote && !process.env.DATABASE_AUTH_TOKEN?.trim()) {
  console.error("DATABASE_AUTH_TOKEN is not set — токен обязателен для удалённой базы.");
  process.exit(1);
}

const args = process.argv.slice(2).filter((a) => a.length > 0);
const srcFilter = args[0] ?? null;
const campFilter = args[1] ?? null;

const db = createClient({
  url,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

const res = await db.execute({
  sql: `SELECT id, name, phone, interest, origin, created_at
        FROM leads
        WHERE ($src IS NULL OR json_extract(origin, '$.source') = $src)
          AND ($camp IS NULL OR json_extract(origin, '$.campaign') = $camp)
        ORDER BY created_at DESC`,
  args: { src: srcFilter, camp: campFilter },
});

const rows = res.rows.map((r) => ({
  id: Number(r.id),
  name: String(r.name),
  phone: String(r.phone),
  interest: String(r.interest),
  origin: JSON.parse(String(r.origin)),
  created_at: String(r.created_at),
}));

if (rows.length === 0) {
  console.log("Заявок нет.");
  process.exit(0);
}

const groups = new Map();
for (const row of rows) {
  const key = `${row.origin.source || "(прямой)"} / ${row.origin.campaign || "—"}`;
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push(row);
}

for (const [key, list] of groups) {
  console.log(`\n${key} — ${list.length}`);
  for (const r of list) {
    const comment = r.origin.content ? ` [${r.origin.content}]` : "";
    console.log(`  #${r.id} ${r.name} ${r.phone} (${r.interest})${comment} — ${r.created_at}`);
  }
}
