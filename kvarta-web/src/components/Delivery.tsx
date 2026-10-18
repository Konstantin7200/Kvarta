const cards = [
  {
    title: "Доставка по Минску",
    lines: [
      "В пятницу — в день развоза, курьером.",
      "При заказе от 50 BYN — бесплатно.",
    ],
  },
  {
    title: "Самовывоз",
    lines: [
      "Минск, ул. Короля, 9 — наша мастерская.",
      "Пн–пт 8:00–20:00, сб–вс 10:00–18:00.",
    ],
  },
];

export function Delivery() {
  return (
    <section id="dostavka" className="mx-auto max-w-5xl px-5 py-20 md:py-28">
      <h2 className="font-display text-3xl font-bold md:text-4xl">
        Доставка и самовывоз
      </h2>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {cards.map((card) => (
          <article
            key={card.title}
            className="rounded-2xl border border-tan bg-surface p-8"
          >
            <h3 className="font-semibold text-lg">{card.title}</h3>
            <ul className="mt-4 space-y-2 text-muted">
              {card.lines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
