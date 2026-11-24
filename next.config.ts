import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";
const isGithubPages = process.env.GITHUB_PAGES === "true";

// En producción: CSP estricta SIN 'unsafe-eval'.
// En desarrollo local (`next dev`): Next/Turbopack requiere eval para HMR únicamente en localhost.
const scriptSrc = isDev ? "'self' 'unsafe-inline' 'unsafe-eval'" : "'self' 'unsafe-inline'";

const cspHeader = `
  default-src 'self';
  script-src ${scriptSrc};
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data:;
  font-src 'self' data:;
  connect-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`
  .replace(/\s{2,}/g, " ")
  .trim();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  turbopack: {
    root: __dirname,
  },
  ...(isGithubPages
    ? {
        output: "export",
        basePath: "/ods5-plataforma-morelia",
        trailingSlash: true,
        images: {
          unoptimized: true,
        },
      }
    : {
        async headers() {
          return [
            {
              source: "/(.*)",
              headers: [
                {
                  key: "Content-Security-Policy",
                  value: cspHeader,
                },
                {
                  key: "X-Frame-Options",
                  value: "DENY",
                },
                {
                  key: "X-Content-Type-Options",
                  value: "nosniff",
                },
                {
                  key: "Referrer-Policy",
                  value: "strict-origin-when-cross-origin",
                },
                {
                  key: "Permissions-Policy",
                  value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
                },
                {
                  key: "Strict-Transport-Security",
                  value: "max-age=63072000; includeSubDomains; preload",
                },
                {
                  key: "Cross-Origin-Opener-Policy",
                  value: "same-origin",
                },
                {
                  key: "Cross-Origin-Resource-Policy",
                  value: "same-origin",
                },
                {
                  key: "X-XSS-Protection",
                  value: "0",
                },
              ],
            },
          ];
        },
      }),
};

export default nextConfig;
