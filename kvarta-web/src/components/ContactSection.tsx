import { LeadForm } from "./LeadForm";

const contacts = [
  { label: "Адрес", value: "Минск, ул. Короля, 9 — мастерская" },
  { label: "Часы", value: "пн–пт 8:00–20:00, сб–вс 10:00–18:00" },
  { label: "Доставка", value: "по Минску в пятницу, от 50 BYN бесплатно" },
];

export function ContactSection() {
  return (
    <section id="zayavka" className="scroll-mt-20 border-t border-tan bg-tan/40">
      <div className="mx-auto max-w-5xl px-5 py-20 md:py-28">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              Оставить заявку
            </h2>
            <p className="mt-4 text-muted">
              Менеджер вам перезвонит, чтобы договориться о деталях.
            </p>
            <ul className="mt-8 space-y-3 text-sm">
              {contacts.map((c) => (
                <li key={c.label}>
                  <span className="text-muted">{c.label}: </span>
                  <span className="font-medium">{c.value}</span>
                </li>
              ))}
            </ul>
          </div>
          <LeadForm />
        </div>
      </div>
    </section>
  );
}
