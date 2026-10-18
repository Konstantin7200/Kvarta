import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const OG_ALT = "Кварта — свежая обжарка кофе в Минске";
export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png";

const fontsPromise = Promise.all([
  readFile(join(process.cwd(), "public/fonts/Unbounded-700.ttf")),
  readFile(join(process.cwd(), "public/fonts/Onest-600.ttf")),
  readFile(join(process.cwd(), "public/fonts/Onest-400.ttf")),
]).then(([unbounded700, onest600, onest400]) => [
  { name: "Unbounded", data: unbounded700, weight: 700 as const, style: "normal" as const },
  { name: "Onest", data: onest600, weight: 600 as const, style: "normal" as const },
  { name: "Onest", data: onest400, weight: 400 as const, style: "normal" as const },
]);

const photoPromise = readFile(join(process.cwd(), "public/images/img1.jpg"), "base64").then(
  (data) => `data:image/jpeg;base64,${data}`,
);

const COLORS = {
  espresso: "#2a1f17",
  paper: "#f7f3ea",
  tan: "#e7d8c8",
  line: "#c9b49a",
  honey: "#d99a2b",
} as const;

function OgCard({ photoSrc }: { photoSrc: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: COLORS.espresso,
        color: COLORS.paper,
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px 56px",
        }}
      >
        <div
          style={{
            fontFamily: "Onest",
            fontWeight: 400,
            fontSize: 26,
            letterSpacing: 5,
            textTransform: "uppercase",
            color: COLORS.line,
          }}
        >
          Обжарка кофе · Минск
        </div>
        <div
          style={{
            fontFamily: "Unbounded",
            fontWeight: 700,
            fontSize: 110,
            marginTop: 26,
            color: COLORS.paper,
          }}
        >
          Кварта
        </div>
        <div
          style={{
            fontFamily: "Onest",
            fontWeight: 600,
            fontSize: 46,
            lineHeight: 1.2,
            marginTop: 30,
            color: COLORS.honey,
          }}
        >
          Жарим по четвергам —
        </div>
        <div
          style={{
            fontFamily: "Onest",
            fontWeight: 600,
            fontSize: 46,
            lineHeight: 1.2,
            color: COLORS.honey,
          }}
        >
          в пятницу у вас
        </div>
        <div
          style={{
            fontFamily: "Onest",
            fontWeight: 400,
            fontSize: 30,
            lineHeight: 1.4,
            marginTop: 30,
            color: COLORS.tan,
          }}
        >
          Лоты по 250 г · подписка · зерно на 1–3 день после обжарки
        </div>
      </div>
      <div
        style={{
          width: 430,
          height: "100%",
          overflow: "hidden",
          display: "flex",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- satori не поддерживает next/image */}
        <img
          src={photoSrc}
          alt=""
          width={430}
          height={630}
          style={{ objectFit: "cover" }}
        />
      </div>
    </div>
  );
}

export async function renderOgImage() {
  const [fonts, photoSrc] = await Promise.all([fontsPromise, photoPromise]);

  return new ImageResponse(<OgCard photoSrc={photoSrc} />, {
    ...OG_SIZE,
    fonts,
  });
}
