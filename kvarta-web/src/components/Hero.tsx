import Link from "next/link";

const navLinks = [
  { href: "#o-nas", label: "Кто мы" },
  { href: "#loty", label: "Лоты" },
  { href: "#podpiska", label: "Подписка" },
  { href: "#dostavka", label: "Доставка" },
  { href: "#faq", label: "FAQ" },
];

export function Hero() {
  return (
    <div className="bg-espresso text-paper">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5">
        <Link
          href="/"
          className="font-display text-lg font-extrabold tracking-[0.07em] uppercase"
        >
          Кварта
        </Link>
        <nav className="hidden gap-6 text-sm text-paper/80 md:flex">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-paper">
              {l.label}
            </a>
          ))}
        </nav>
        <a
          href="#zayavka"
          className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
        >
          Заявка
        </a>
      </header>

      <section className="mx-auto max-w-5xl px-5 pt-14 pb-20 md:pt-24 md:pb-28">
        <p className="text-sm tracking-wide text-paper/60 uppercase">
          Обжарка кофе · Минск
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl leading-tight font-bold md:text-6xl">
          Жарим по четвергам —{" "}
          <span className="text-honey">в пятницу у вас</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-paper/80">
          «Кварта» — небольшая обжарка в Минске. Обжариваем партиями
          по 5 кг под заказы недели — зерно доезжает до вас на 1–3
          день после обжарки, а не лежит месяцами на складе.
        </p>

        <div className="mt-8 flex flex-wrap gap-3 text-sm">
          <span className="rounded-full bg-espresso-soft px-4 py-2">
            Четверг — <span className="text-honey font-semibold">жарим</span>
          </span>
          <span className="rounded-full bg-espresso-soft px-4 py-2">
            Пятница —{" "}
            <span className="text-honey font-semibold">привозим</span>
          </span>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href="#zayavka"
            className="rounded-full bg-accent px-6 py-3 font-semibold text-white transition-colors hover:bg-accent-hover"
          >
            Оставить заявку
          </a>
          <a
            href="#loty"
            className="rounded-full border border-paper/30 px-6 py-3 font-semibold transition-colors hover:bg-espresso-soft"
          >
            Что обжариваем
          </a>
        </div>
      </section>
    </div>
  );
}
