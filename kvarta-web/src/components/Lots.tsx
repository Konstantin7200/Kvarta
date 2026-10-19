const lots = [
  {
    origin: "Эфиопия Иргачеффе",
    notes: "цветочный, бергамот",
    detail: "светлая обжарка",
    price: "32",
    unit: "BYN / 250 г",
  },
  {
    origin: "Колумбия Уила",
    notes: "карамель, красное яблоко",
    detail: "средняя обжарка",
    price: "29",
    unit: "BYN / 250 г",
  },
  {
    origin: "Бразилия Серрадо",
    notes: "орех, шоколад",
    detail: "под эспрессо",
    price: "26",
    unit: "BYN / 250 г",
  },
  {
    origin: "Дрип-пакеты, ассорти",
    notes: "разные лоты в одной пачке",
    detail: "10 штук",
    price: "18",
    unit: "BYN / упаковка",
  },
];

export function Lots() {
  return (
    <section id="loty" className="scroll-mt-20 border-t border-tan">
      <div className="mx-auto max-w-5xl px-5 py-20 md:py-28">
        <h2 className="font-display text-3xl font-bold md:text-4xl">
          Что обжариваем
        </h2>
        <p className="mt-4 max-w-xl text-muted">
          Три зерна и дрип-пакеты для тех, кто ценит скорость. Меняем
          лоты вместе с сезоном.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {lots.map((lot) => (
            <article
              key={lot.origin}
              className="flex flex-col rounded-2xl border border-tan bg-surface p-6"
            >
              <h3 className="font-semibold text-lg">{lot.origin}</h3>
              <p className="mt-1 text-sm text-muted">{lot.detail}</p>
              <p className="mt-4 text-ink/90">{lot.notes}</p>
              <p className="mt-6 flex items-baseline gap-2">
                <span className="font-display text-3xl font-extrabold text-accent">
                  {lot.price}
                </span>
                <span className="text-sm text-muted">{lot.unit}</span>
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
