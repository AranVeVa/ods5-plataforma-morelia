import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Plataforma Educativa ODS 5 • Morelia, Michoacán",
  description:
    "Plataforma interactiva y cibersegura bajo Privacy by Design para la educación infantil y juvenil sobre equidad de género (ODS 5) en Morelia, Michoacán.",
  keywords: [
    "ODS 5",
    "Equidad de Género",
    "Morelia",
    "Michoacán",
    "Educación Infantil",
    "Privacy by Design",
    "Tecnología Cívica",
    "Green IT",
  ],
  authors: [{ name: "Proyecto Académico Desarrollo Sustentable" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
