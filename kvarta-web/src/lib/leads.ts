import { getDb } from "./db";
import {
  BY_PHONE_PREFIXES,
  DEDUP_WINDOW_MS,
  HONEYPOT_FIELD,
  INTERESTS,
  MAX_ORIGIN_FIELD_LEN,
  type Interest,
} from "./constants";

export type LeadOrigin = {
  source: string;
  medium: string;
  campaign: string;
  content: string;
  term: string;
  page: string;
  referrer: string;
};

export type NewLead = {
  name: string;
  phone: string;
  interest: Interest;
  comment: string | null;
  consent: true;
  origin: LeadOrigin;
};

export type AddLeadResult = {
  ok: true;
  duplicate: boolean;
  id: number | null;
};

export class ValidationError extends Error {
  field: string;

  constructor(field: string, message: string) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
  }
}

export function isSpamPayload(body: unknown): boolean {
  const value = (body as Record<string, unknown> | null)?.[HONEYPOT_FIELD];
  return typeof value === "string" && value.trim() !== "";
}

export function normalizePhone(raw: string): string {
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("80")) d = d.slice(2);
  else if (d.startsWith("8375")) d = d.slice(4);
  else if (d.startsWith("375")) d = d.slice(3);
  else if (d.startsWith("8") && d.length === 11) d = d.slice(1);
  if (d.startsWith("0")) d = d.slice(1);
  if (d.length !== 9 || !BY_PHONE_PREFIXES.includes(d.slice(0, 2))) {
    throw new ValidationError(
      "phone",
      "Введите белорусский номер: +375 XX XXX XX XX",
    );
  }
  return "+375" + d;
}

function stripControl(s: string): string {
  return s.replace(/[\u0000-\u001F\u007F]/g, " ");
}

function str(v: unknown): string {
  return typeof v === "string" ? v.slice(0, MAX_ORIGIN_FIELD_LEN) : "";
}

function sanitizeOrigin(value: unknown): LeadOrigin {
  const o = (value ?? {}) as Record<string, unknown>;
  return {
    source: str(o.source),
    medium: str(o.medium),
    campaign: str(o.campaign),
    content: str(o.content),
    term: str(o.term),
    page: str(o.page),
    referrer: str(o.referrer),
  };
}

export function validateLead(
  body: unknown,
  serverReferrer = "",
): NewLead {
  const b = (body ?? {}) as Record<string, unknown>;

  const name =
    typeof b.name === "string" ? stripControl(b.name).trim() : "";
  if (name.length < 2 || name.length > 100) {
    throw new ValidationError(
      "name",
      "Укажите имя (от 2 до 100 символов)",
    );
  }

  if (typeof b.phone !== "string" || b.phone.trim() === "") {
    throw new ValidationError("phone", "Введите телефон");
  }
  const phone = normalizePhone(b.phone);

  const interestRaw = b.interest;
  if (
    typeof interestRaw !== "string" ||
    !(INTERESTS as readonly string[]).includes(interestRaw)
  ) {
    throw new ValidationError("interest", "Выберите, что вас интересует");
  }
  const interest = interestRaw as Interest;

  let comment: string | null = null;
  if (b.comment !== undefined && b.comment !== null && b.comment !== "") {
    if (typeof b.comment !== "string" || b.comment.length > 1000) {
      throw new ValidationError(
        "comment",
        "Комментарий — не длиннее 1000 символов",
      );
    }
    comment = stripControl(b.comment).trim() || null;
  }

  if (b.consent !== true) {
    throw new ValidationError(
      "consent",
      "Нужно согласие на обработку персональных данных",
    );
  }

  const origin = sanitizeOrigin(b.origin);
  if (!origin.referrer) {
    origin.referrer = str(serverReferrer);
  }
  if (!origin.page) {
    throw new ValidationError(
      "origin",
      "Не удалось определить страницу входа. Обновите страницу и повторите отправку.",
    );
  }

  return { name, phone, interest, comment, consent: true, origin };
}

export async function addLead(lead: NewLead): Promise<AddLeadResult> {
  const db = getDb();
  const now = new Date().toISOString();
  const cutoff = new Date(Date.now() - DEDUP_WINDOW_MS).toISOString();

  const tx = await db.transaction("write");
  try {
    const res = await tx.execute({
      sql: `INSERT INTO leads (name, phone, interest, comment, origin, consent, created_at)
            SELECT $name, $phone, $interest, $comment, $origin, $consent, $now
            WHERE NOT EXISTS (
              SELECT 1 FROM leads
              WHERE phone = $phone AND created_at > $cutoff
            )
            RETURNING id`,
      args: {
        name: lead.name,
        phone: lead.phone,
        interest: lead.interest,
        comment: lead.comment,
        origin: JSON.stringify(lead.origin),
        consent: 1,
        now,
        cutoff,
      },
    });
    await tx.commit();
    if (res.rows.length === 0) {
      return { ok: true, duplicate: true, id: null };
    }
    return {
      ok: true,
      duplicate: false,
      id: Number(res.rows[0].id),
    };
  } finally {
    try {
      tx.close();
    } catch {
      // tx уже закрыт после commit
    }
  }
}
