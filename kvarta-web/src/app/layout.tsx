import type { Metadata } from "next";
import { Onest, Unbounded } from "next/font/google";
import "./globals.css";

const unbounded = Unbounded({
  subsets: ["latin", "cyrillic"],
  weight: ["700", "800"],
  variable: "--font-unbounded",
  display: "swap",
});

const onest = Onest({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-onest",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Кварта — свежая обжарка кофе в Минске",
  description:
    "Обжарка «Кварта», Минск: жарим по четвергам партиями по 5 кг — привозим в пятницу. Лоты по 250 г, дрип-пакеты, подписка. Зерно на 1–3 день после обжарки.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className={`${unbounded.variable} ${onest.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
