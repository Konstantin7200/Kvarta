#!/usr/bin/env node
const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
if (!token) {
  console.error(
    "TELEGRAM_BOT_TOKEN is not set. Заполните kvarta-web/.env или переменные Vercel.",
  );
  process.exit(1);
}

const deleteWebhook = process.argv.includes("--delete-webhook");

async function api(method, params) {
  const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params ?? {}),
    signal: AbortSignal.timeout(10_000),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.ok) {
    const err = new Error(
      `${method}: ${data?.description ?? res.status} (error_code=${data?.error_code ?? "?"})`,
    );
    err.description = data?.description;
    throw err;
  }
  return data.result;
}

let me;
try {
  me = await api("getMe");
} catch (err) {
  console.error(
    `Не удалось подключиться к боту: ${err.message}. ` +
      "Проверьте TELEGRAM_BOT_TOKEN в .env (токен выдаёт @BotFather).",
  );
  process.exit(1);
}
console.log(`Бот: @${me.username} (${me.first_name})\n`);

if (deleteWebhook) {
  await api("deleteWebhook");
  console.log("Webhook снят — бот снова принимает getUpdates.\n");
}

let updates;
try {
  updates = await api("getUpdates");
} catch (err) {
  if (String(err.description).includes("terminated by other getUpdates")) {
    console.error(
      "Кто-то другой поллит getUpdates этого бота. Завершите другой процесс и повторите.",
    );
    process.exit(1);
  }
  if (String(err.description).includes("webhook is active")) {
    console.error(
      "У бота включён webhook. Повторите с флагом --delete-webhook, чтобы снять его.",
    );
    process.exit(1);
  }
  console.error(`getUpdates failed: ${err.message}`);
  process.exit(1);
}

const chats = new Map();
for (const u of updates) {
  const chat =
    u.message?.chat ??
    u.channel_post?.chat ??
    u.edited_channel_post?.chat ??
    u.my_chat_member?.chat;
  if (!chat) continue;
  if (!chats.has(chat.id)) chats.set(chat.id, chat);
}

if (chats.size === 0) {
  console.log("Бот пока не видел ни одного чата. Как получить chat_id:");
  console.log("  1. Личный чат: напишите боту /start в Telegram.");
  console.log("  2. Группа: создайте приватную группу, добавьте бота, напишите в ней что-нибудь.");
  console.log("  3. Приватный канал: создайте канал, добавьте бота админом, напишите пост.");
  console.log("\nЗатем запустите скрипт ещё раз и скопируйте id в TELEGRAM_CHAT_ID.");
  process.exit(0);
}

console.log("Найденные чаты (id → TELEGRAM_CHAT_ID):");
for (const chat of chats.values()) {
  const title = chat.title ?? [chat.first_name, chat.last_name].filter(Boolean).join(" ");
  const type =
    chat.type === "private"
      ? "личный чат"
      : chat.type === "supergroup" || chat.type === "group"
        ? "группа"
        : "канал";
  console.log(`  ${chat.id}  — ${type}: ${title}`);
}
console.log(
  "\nДля зеркалирования заявок в приватный канал: id должен быть отрицательным (вида -100…).",
);
console.log("Скопируйте нужный id в TELEGRAM_CHAT_ID (.env и Vercel).");
