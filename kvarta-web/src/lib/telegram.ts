import type { Interest } from "./constants";
import type { NewLead } from "./leads";

const INTEREST_LABELS: Record<Interest, string> = {
  subscription: "Подписка",
  order: "Разовый заказ",
  question: "Другой вопрос",
};

const TELEGRAM_TIMEOUT_MS = 5_000;
const TELEGRAM_MESSAGE_MAX_LEN = 4_000;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function originLine(lead: NewLead): string {
  const o = lead.origin;
  const parts = [
    o.source && `source=${o.source}`,
    o.medium && `medium=${o.medium}`,
    o.campaign && `campaign=${o.campaign}`,
    o.content && `content=${o.content}`,
    o.term && `term=${o.term}`,
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "(нет utm)";
}

export function formatLeadMessage(id: number, lead: NewLead): string {
  const lines = [
    `<b>Новая заявка #${id}</b>`,
    ``,
    `<b>Имя:</b> ${escapeHtml(lead.name)}`,
    `<b>Телефон:</b> ${escapeHtml(lead.phone)}`,
    `<b>Интерес:</b> ${escapeHtml(INTEREST_LABELS[lead.interest])}`,
  ];
  if (lead.comment) {
    lines.push(`<b>Комментарий:</b> ${escapeHtml(lead.comment)}`);
  }
  lines.push(
    ``,
    `<b>Реклама:</b> ${escapeHtml(originLine(lead))}`,
    `<b>Страница:</b> ${escapeHtml(lead.origin.page)}`,
  );
  if (lead.origin.referrer) {
    lines.push(`<b>Реферер:</b> ${escapeHtml(lead.origin.referrer)}`);
  }
  return lines.join("\n").slice(0, TELEGRAM_MESSAGE_MAX_LEN);
}

export async function notifyLeadTelegram(
  id: number,
  lead: NewLead,
): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();
  if (!token || !chatId) {
    console.warn(
      "[lead] telegram skipped: TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID not set",
    );
    return;
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: formatLeadMessage(id, lead),
        parse_mode: "HTML",
      }),
      signal: AbortSignal.timeout(TELEGRAM_TIMEOUT_MS),
    });
    if (!res.ok) {
      const body = (await res.text()).slice(0, 300);
      console.error(`[lead] telegram ${res.status}: ${body}`);
      return;
    }
  } catch (err) {
    console.error(
      "[lead] telegram failed:",
      err instanceof Error ? err.message : err,
    );
  }
}
