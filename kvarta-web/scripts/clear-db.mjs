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
  console.error(
    "DATABASE_AUTH_TOKEN is not set — токен обязателен для удалённой базы.",
  );
  process.exit(1);
}

const args = process.argv.slice(2);
const force = args.includes("--yes");

const db = createClient({
  url,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

const countRes = await db.execute("SELECT COUNT(*) AS n FROM leads");
const total = Number(countRes.rows[0]?.n ?? 0);

if (total === 0) {
  console.log("Таблица leads уже пуста. Нечего удалять.");
  process.exit(0);
}

if (!force) {
  console.error(
    `Будут удалены ${total} записей из таблицы leads на ${url}.\n` +
      "Запускайте с флагом --yes для подтверждения: npm run db:clear -- --yes",
  );
  process.exit(1);
}

await db.execute("DELETE FROM leads");
console.log(`Готово. Удалено ${total} записей из таблицы leads.`);
