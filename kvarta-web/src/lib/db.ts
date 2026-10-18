import { createClient, type Client } from "@libsql/client/web";

export class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConfigError";
  }
}

let client: Client | null = null;
let schemaReady: Promise<void> | null = null;

const DDL_TABLE = `CREATE TABLE IF NOT EXISTS leads (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL,
  phone      TEXT NOT NULL,
  interest   TEXT NOT NULL,
  comment    TEXT,
  origin     TEXT NOT NULL,
  consent    INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
)`;

const DDL_INDEX = `CREATE INDEX IF NOT EXISTS leads_dedup ON leads(phone, created_at)`;

export function getDb(): Client {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    throw new ConfigError(
      "DATABASE_URL is not set — скопируйте .env.example в .env",
    );
  }
  const remote = url.startsWith("libsql:") || url.startsWith("https:");
  if (remote && !process.env.DATABASE_AUTH_TOKEN?.trim()) {
    throw new ConfigError(
      "DATABASE_AUTH_TOKEN is not set — токен обязателен для удалённой базы",
    );
  }
  if (!client) {
    client = createClient({
      url,
      authToken: process.env.DATABASE_AUTH_TOKEN,
    });
  }
  return client;
}

export async function initDb(): Promise<void> {
  if (!schemaReady) {
    schemaReady = getDb()
      .batch([DDL_TABLE, DDL_INDEX])
      .then(() => undefined)
      .catch((err) => {
        schemaReady = null;
        throw err;
      });
  }
  return schemaReady;
}
