const steps = [
  {
    n: "01",
    title: "Выбираете",
    text: "Лот с сайта или подписку — что вам ближе.",
  },
  {
    n: "02",
    title: "Оставляете заявку",
    text: "Менеджер перезванивает и оформляет заказ.",
  },
  {
    n: "03",
    title: "Жарим в четверг",
    text: "Партиями по 5 кг под заказы недели — без запасов на складе.",
  },
  {
    n: "04",
    title: "Привозим в пятницу",
    text: "По Минску — бесплатно от 50 BYN. Самовывоз — ул. Короля, 9.",
  },
];

export function HowItWorks() {
  return (
    <section id="kak" className="border-t border-tan bg-tan/40">
      <div className="mx-auto max-w-5xl px-5 py-20 md:py-28">
        <h2 className="font-display text-3xl font-bold md:text-4xl">
          Как это работает
        </h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div key={s.n}>
              <p className="font-display text-2xl font-extrabold text-accent">
                {s.n}
              </p>
              <h3 className="mt-3 font-semibold">{s.title}</h3>
              <p className="mt-2 text-muted">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
