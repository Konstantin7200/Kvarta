const faq = [
  {
    q: "Кофе будет свежий?",
    a: "Да. Мы жарим по четвергам партиями по 5 кг — зерно доезжает до вас на 1–3 день после обжарки и не ждёт покупателя на складе.",
  },
  {
    q: "Как работает доставка?",
    a: "По Минску возим в пятницу, в день развоза. При заказе от 50 BYN доставка бесплатная.",
  },
  {
    q: "Где забрать самовывозом?",
    a: "Минск, ул. Короля, 9 — наша мастерская. Пн–пт 8:00–20:00, сб–вс 10:00–18:00.",
  },
  {
    q: "Как поставить подписку на паузу или отменить?",
    a: "Напишите нам — поставим на паузу или отключим. Без объяснений и штрафов.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-20 border-t border-tan">
      <div className="mx-auto max-w-5xl px-5 py-20 md:py-28">
        <h2 className="font-display text-3xl font-bold md:text-4xl">
          Частые вопросы
        </h2>
        <div className="mt-8 max-w-2xl">
          {faq.map((item) => (
            <details key={item.q} className="group border-b border-tan py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                {item.q}
                <span
                  aria-hidden
                  className="text-accent transition-transform duration-300 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
