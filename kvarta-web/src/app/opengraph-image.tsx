import { renderOgImage } from "@/lib/og";

export const alt = "Кварта — свежая обжарка кофе в Минске";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return renderOgImage();
}
