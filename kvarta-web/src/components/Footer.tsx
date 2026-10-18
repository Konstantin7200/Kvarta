export function Footer() {
  return (
    <footer className="bg-espresso text-paper">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-5 py-12 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display font-extrabold tracking-[0.07em] uppercase">
            Кварта
          </p>
          <p className="mt-2 text-sm text-paper/60">
            Обжарка кофе в Минске. Жарим по четвергам — привозим в пятницу.
          </p>
        </div>
        <div className="text-sm text-paper/60">
          <p>Минск, ул. Короля, 9</p>
          <p className="mt-1">пн–пт 8:00–20:00 · сб–вс 10:00–18:00</p>
          <p className="mt-4">© 2026 Кварта</p>
        </div>
      </div>
    </footer>
  );
}
