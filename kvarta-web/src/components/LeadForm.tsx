"use client";

import { useState } from "react";
import {
  HONEYPOT_FIELD,
  INTERESTS,
  type Interest,
} from "@/lib/constants";

const INTEREST_LABELS: Record<Interest, string> = {
  subscription: "Подписка",
  order: "Разовый заказ",
  question: "Другой вопрос",
};

type FieldKey =
  | "name"
  | "phone"
  | "interest"
  | "comment"
  | "consent"
  | "origin";

type FieldErrors = Partial<Record<FieldKey, string>>;

function readOrigin() {
  const p = new URLSearchParams(window.location.search);
  return {
    source: p.get("utm_source") ?? "",
    medium: p.get("utm_medium") ?? "",
    campaign: p.get("utm_campaign") ?? "",
    content: p.get("utm_content") ?? "",
    term: p.get("utm_term") ?? "",
    page: window.location.href,
    referrer: document.referrer,
  };
}

const inputClass =
  "w-full rounded-lg border bg-surface px-4 py-3 text-ink placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/40";

export function LeadForm() {
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [consent, setConsent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  if (sent) {
    return (
      <div
        role="status"
        className="rounded-2xl border border-tan bg-surface p-8"
      >
        <h3 className="font-display text-xl font-bold">Заявка принята</h3>
        <p className="mt-3 text-muted">
          Менеджер вам перезвонит, чтобы договариться о деталях.
        </p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pending) return;
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      interest: String(fd.get("interest") ?? ""),
      comment: String(fd.get("comment") ?? ""),
      consent: fd.get("consent") === "on",
      [HONEYPOT_FIELD]: String(fd.get(HONEYPOT_FIELD) ?? ""),
      origin: readOrigin(),
    };

    setPending(true);
    setServerError(null);
    setFieldErrors({});
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data: {
        ok?: boolean;
        error?: string;
        field?: string;
      } = await res.json().catch(() => ({}));

      if (res.ok && data.ok) {
        setSent(true);
        form.reset();
        return;
      }
      if (res.status === 400 && data.field) {
        setFieldErrors({ [data.field]: data.error ?? "Проверьте поле" });
        return;
      }
      setServerError(
        data.error ?? "Не удалось отправить заявку. Попробуйте позже.",
      );
    } catch {
      setServerError(
        "Нет связи — проверьте интернет и попробуйте ещё раз.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border border-tan bg-surface p-6 md:p-8"
    >
      {serverError && (
        <p
          role="alert"
          className="mb-6 rounded-lg border border-error/40 bg-error/5 px-4 py-3 text-sm text-error"
        >
          {serverError}
        </p>
      )}

      <input
        type="text"
        name={HONEYPOT_FIELD}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            Имя
          </label>
          <input
            id="name"
            name="name"
            required
            minLength={2}
            maxLength={100}
            autoComplete="name"
            className={`${inputClass} ${fieldErrors.name ? "border-error" : "border-line-strong"}`}
          />
          {fieldErrors.name && (
            <p className="mt-1 text-sm text-error">{fieldErrors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium">
            Телефон
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            inputMode="tel"
            autoComplete="tel"
            placeholder="+375 XX XXX XX XX"
            className={`${inputClass} ${fieldErrors.phone ? "border-error" : "border-line-strong"}`}
          />
          {fieldErrors.phone && (
            <p className="mt-1 text-sm text-error">{fieldErrors.phone}</p>
          )}
        </div>
      </div>

      <fieldset className="mt-5">
        <legend className="text-sm font-medium">Что интересует</legend>
        <div className="mt-2 flex flex-wrap gap-4">
          {INTERESTS.map((value) => (
            <label key={value} className="flex items-center gap-2">
              <input
                type="radio"
                name="interest"
                value={value}
                required
                className="accent-accent"
              />
              {INTEREST_LABELS[value]}
            </label>
          ))}
        </div>
        {fieldErrors.interest && (
          <p className="mt-1 text-sm text-error">{fieldErrors.interest}</p>
        )}
      </fieldset>

      <div className="mt-5">
        <label htmlFor="comment" className="block text-sm font-medium">
          Комментарий{" "}
          <span className="font-normal text-muted">
            (необязательно: удобное время)
          </span>
        </label>
        <textarea
          id="comment"
          name="comment"
          rows={3}
          maxLength={1000}
          className={`${inputClass} border-line-strong resize-y`}
        />
        {fieldErrors.comment && (
          <p className="mt-1 text-sm text-error">{fieldErrors.comment}</p>
        )}
      </div>

      <label className="mt-5 flex items-start gap-3 text-sm">
        <input
          type="checkbox"
          name="consent"
          required
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 accent-accent"
        />
        <span>
          Согласен на обработку персональных данных — иначе мы не сможем
          перезвонить.
        </span>
      </label>
      {fieldErrors.consent && (
        <p className="mt-1 text-sm text-error">{fieldErrors.consent}</p>
      )}

      <button
        type="submit"
        disabled={pending || !consent}
        className="mt-8 w-full rounded-full bg-accent px-6 py-3 font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Отправляем…" : "Отправить заявку"}
      </button>
    </form>
  );
}
