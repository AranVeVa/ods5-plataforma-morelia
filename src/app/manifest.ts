import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  const prefix = process.env.GITHUB_PAGES === "true" ? "/ods5-plataforma-morelia" : "";

  return {
    name: "ODS 5 · Morelia — Plataforma Educativa por la Igualdad",
    short_name: "ODS 5 Morelia",
    description:
      "Plataforma web educativa, accesible y cibersegura bajo Privacy by Design para enseñar equidad de género (Metas 5.2 y 5.4) en Morelia, Michoacán.",
    start_url: `${prefix}/`,
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#4f46e5",
    lang: "es-MX",
    icons: [
      {
        src: `${prefix}/icon.svg`,
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
