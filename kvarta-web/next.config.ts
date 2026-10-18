import type { NextConfig } from "next";

function checkEnv(): void {
  const missing: string[] = [];
  const url = process.env.DATABASE_URL?.trim();
  if (!url) missing.push("DATABASE_URL");
  else if (
    (url.startsWith("libsql:") || url.startsWith("https:")) &&
    !process.env.DATABASE_AUTH_TOKEN?.trim()
  ) {
    missing.push("DATABASE_AUTH_TOKEN");
  }
  for (const key of [
    "ALLOWED_ORIGINS",
    "TELEGRAM_BOT_TOKEN",
    "TELEGRAM_CHAT_ID",
  ]) {
    if (!process.env[key]?.trim()) missing.push(key);
  }
  if (missing.length > 0) {
    throw new Error(
      `Missing env vars: ${missing.join(", ")}. ` +
        "Заполните kvarta-web/.env по образцу .env.example " +
        "(в проде — Vercel → Settings → Environment Variables).",
    );
  }
}

checkEnv();

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
