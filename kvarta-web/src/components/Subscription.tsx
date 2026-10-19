import Image from "next/image";

export function Subscription() {
  return (
    <section id="podpiska" className="scroll-mt-20 bg-espresso text-paper">
      <div className="mx-auto max-w-5xl px-5 py-20 md:py-28">
        <div className="grid gap-10 md:grid-cols-2 md:items-center md:gap-16">
        <div>
        <h2 className="font-display text-3xl font-bold md:text-4xl">
          Подписка
        </h2>
        <p className="mt-4 max-w-xl text-paper/80">
          Две пачки по 250 г раз в месяц — свежая обжарка приходит
          сама, думать о заказе не нужно.
        </p>

        <div className="mt-10 max-w-sm rounded-2xl bg-espresso-soft p-8">
          <h3 className="font-semibold">Подписка на месяц</h3>
          <p className="mt-1 text-sm text-paper/60">2 пачки по 250 г</p>
          <p className="mt-6 flex items-baseline gap-2">
            <span className="font-display text-4xl font-extrabold text-honey">
              54
            </span>
            <span className="text-paper/60">BYN / мес</span>
          </p>
          <ul className="mt-6 space-y-2 text-sm text-paper/80">
            <li>Два лота на выбор</li>
            <li>Доставка по Минску бесплатно</li>
            <li>Пауза и отмена — одним сообщением, без штрафов</li>
          </ul>
        </div>

        <a
          href="#zayavka"
          className="mt-10 inline-block rounded-full bg-accent px-6 py-3 font-semibold text-white transition-colors hover:bg-accent-hover"
        >
          Оформить подписку
        </a>
        </div>

        <Image
          src="/images/img3.jpg"
          alt="Чашка свежесваренного кофе с поднимающимся паром"
          width={1600}
          height={2400}
          sizes="(min-width: 768px) 468px, calc(100vw - 40px)"
          className="aspect-[4/3] w-full rounded-2xl object-cover"
        />
        </div>
      </div>
    </section>
  );
}
