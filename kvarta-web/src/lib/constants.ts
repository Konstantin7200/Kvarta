export const HONEYPOT_FIELD = "website";

export const DEDUP_WINDOW_MS = 10 * 60_000;

export const MAX_BODY_BYTES = 50_000;

export const MAX_ORIGIN_FIELD_LEN = 500;

export const INTERESTS = ["subscription", "order", "question"] as const;

export type Interest = (typeof INTERESTS)[number];

export const BY_PHONE_PREFIXES: readonly string[] = [
  "15",
  "16",
  "17",
  "18",
  "19",
  "21",
  "22",
  "23",
  "24",
  "25",
  "29",
  "31",
  "33",
  "44",
];
