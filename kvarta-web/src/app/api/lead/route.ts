import { NextResponse } from "next/server";
import { ConfigError, initDb } from "@/lib/db";
import { MAX_BODY_BYTES } from "@/lib/constants";
import {
  addLead,
  isSpamPayload,
  validateLead,
  ValidationError,
  type NewLead,
} from "@/lib/leads";

function allowedOrigins(): string[] {
  return (process.env.ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((entry) => {
      try {
        return new URL(entry).origin;
      } catch {
        return entry;
      }
    });
}

function requestOrigin(req: Request): string | null {
  const raw = req.headers.get("origin") ?? req.headers.get("referer");
  if (!raw) return null;
  try {
    return new URL(raw).origin;
  } catch {
    return raw;
  }
}

function errorResponse(
  status: number,
  error: string,
  field?: string,
): NextResponse {
  return NextResponse.json({ ok: false, error, field }, { status });
}

export async function POST(req: Request) {
  const allowed = allowedOrigins();
  if (allowed.length === 0) {
    console.error("[lead] ALLOWED_ORIGINS is empty");
    return errorResponse(
      503,
      "Сервис заявок временно не настроен. Попробуйте позже.",
    );
  }

  const contentType = (req.headers.get("content-type") ?? "")
    .split(";")[0]
    .trim()
    .toLowerCase();
  if (contentType !== "application/json") {
    return errorResponse(415, "Ожидается application/json");
  }

  const contentLength = Number(req.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return errorResponse(413, "Запрос слишком большой");
  }

  const origin = requestOrigin(req);
  if (!origin || !allowed.includes(origin)) {
    console.warn(`[lead] origin rejected: ${origin ?? "none"}`);
    return errorResponse(403, "Источник запроса не разрешён");
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return errorResponse(400, "Некорректный JSON");
  }

  if (isSpamPayload(body)) {
    return NextResponse.json({
      ok: true,
      duplicate: false,
      id: null,
    });
  }

  let lead: NewLead;
  try {
    lead = validateLead(body, req.headers.get("referer") ?? "");
  } catch (err) {
    if (err instanceof ValidationError) {
      return errorResponse(400, err.message, err.field);
    }
    throw err;
  }

  try {
    await initDb();
    const result = await addLead(lead);
    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    if (err instanceof ConfigError) {
      console.error(`[lead] config: ${err.message}`);
      return errorResponse(
        503,
        "Сервис заявок временно не настроен. Попробуйте позже.",
      );
    }
    console.error("[lead] insert failed:", err);
    return errorResponse(
      500,
      "Не удалось сохранить заявку. Попробуйте ещё раз позже.",
    );
  }
}
