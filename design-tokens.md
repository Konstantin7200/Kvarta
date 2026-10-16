# Кварта — design tokens (decision log)

## Fonts — LOCKED
- **Display / logo / H1 / H2 / prices:** Unbounded — 700, 800 (Cyrillic ✓)
- **Body / UI / forms:** Onest — 400, 500, 600, 700 (Cyrillic ✓)
- Third fonts: **none** (Caveat — cut by decision; scripts rejected)

### Logo — LOCKED
- Text wordmark (no image asset), per ТЗ «логотип можно сделать текстом»
- **Plain word, no extra marks** (rust dot idea dropped)
- Header/nav: `КВАРТА` — Unbounded **800, CAPS, letter-spacing ~0.07em**
- Hero/footer large: `Кварта` — Unbounded **700, mixed case**
- Mock: `logo-mock.html`

### Rejected (with reasons)
- Lobster — dated 2013 template script, single weight
- Great Vibes — wedding calligraphy, pathos
- Caveat — third font, cut
- Serif direction (Oranienbaum, Prata, Yeseva One, Alegreya) — high-contrast serifs read "newspaper/premium gloss", against «тёплый и простой»
- Nunito — body too thin vs Onest (user); El Messiri, Dela Gothic One — not selected

## Colors — PROPOSED (from unat/nico/rand warm direction)
| Role | Hex | Contrast |
|---|---|---|
| `--paper` page bg | `#F7F3EA` | — |
| `--surface` cards | `#FFFDF8` | — |
| `--ink` text | `#221B14` | 15.4:1 on paper ✓ AAA |
| `--espresso` dark sections | `#2A1F17` | paper on it 14.5:1 ✓ |
| `--brown` secondary/links | `#6B4429` | 7.6:1 ✓ |
| `--tan` borders/alt bg | `#E7D8C8` | ink on it 12.5:1 ✓ |
| `--accent` CTA/price | `#B14A2A` | 4.9:1 on paper ✓, white on it ✓ |
| `--honey` accent on dark only | `#D99A2B` | 6.6:1 on espresso ✓ (2.2 on cream ✗) |

Pending: light-first vs dark hero; final accent confirmation.

## Reference material
- `links.md` — 16 similar sites
- `analysis.md` — comparative analysis (structure, palette, forms, stacks)
- `font-specimen.html` — rejected candidates archive
- `font-pairing.html` — final pairing mocks A/B (B = Unbounded + Onest = chosen)
