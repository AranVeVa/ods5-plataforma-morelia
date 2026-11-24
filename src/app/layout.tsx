import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppProviders } from "@/context/AppProviders";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#4f46e5" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export const metadata: Metadata = {
  title: "Plataforma Educativa ODS 5 · Morelia, Michoacán",
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
    "WCAG 2.1",
  ],
  authors: [{ name: "Arantza Venegas Valencia · UVAQ · Desarrollo Sustentable" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-MX">
      <body className="antialiased min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white pattern-mich">
        <a
          href="#main-content"
          className="skip-link sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2.5 focus:rounded-xl focus:bg-indigo-700 focus:text-white focus:font-black focus:text-sm focus:shadow-xl"
        >
          Saltar al contenido principal
        </a>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
