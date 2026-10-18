const facts = [
  { value: "2019", label: "обжариваем с" },
  { value: "5 кг", label: "партия обжарки" },
  { value: "1–3 день", label: "от обжарки до вашей чашки" },
];

export function About() {
  return (
    <section id="o-nas" className="mx-auto max-w-5xl px-5 py-20 md:py-28">
      <h2 className="font-display text-3xl font-bold md:text-4xl">
        Кварта — это Аня и Дмитрий
      </h2>
      <div className="mt-6 grid gap-8 md:grid-cols-2 md:gap-16">
        <p className="text-lg leading-relaxed text-ink/90">
          Оба раньше работали бариста и знают: вкус решают свежесть и
          простота. С 2019 года обжариваем кофе в Минске партиями по
          5 кг — маленькими, чтобы зерно не ждало покупателя на складе.
        </p>
        <p className="text-lg leading-relaxed text-muted">
          Свежесть — главное, что мы продаём. Зерно приходит к вам на
          1–3 день после обжарки: мы жарим по четвергам, а в пятницу
          развозим по Минску. Так и родился наш ритм.
        </p>
      </div>

      <dl className="mt-12 grid gap-6 sm:grid-cols-3">
        {facts.map((f) => (
          <div key={f.value} className="border-t-2 border-accent pt-4">
            <dt className="font-display text-2xl font-extrabold text-accent">
              {f.value}
            </dt>
            <dd className="mt-1 text-sm text-muted">{f.label}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
