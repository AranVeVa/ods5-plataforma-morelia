<div align="center">
  <img src="src/app/icon.svg" alt="Logo oficial Plataforma Educativa ODS 5 Morelia" width="84" height="84" />
  <h1>Plataforma Educativa ODS 5 · Morelia, Michoacán</h1>
  <p>
    <strong>Plataforma web interactiva, accesible y cibersegura basada en Next.js para la educación infantil y juvenil sobre equidad de género (Metas 5.2 y 5.4 de la ONU) bajo el modelo de Privacidad por Diseño.</strong>
  </p>

  <p>
    <img src="https://img.shields.io/badge/ODS%205-Equidad%20de%20G%C3%A9nero-e11d48?style=for-the-badge" alt="ODS 5" />
    <img src="https://img.shields.io/badge/Privacy%20by%20Design-Cero%20Datos-10b981?style=for-the-badge" alt="Privacy by Design" />
    <img src="https://img.shields.io/badge/WCAG%202.1-AA%20Accesible-4f46e5?style=for-the-badge" alt="WCAG 2.1 AA" />
    <img src="https://img.shields.io/badge/Green%20IT-Web%20Audio%20%26%20SVG-0284c7?style=for-the-badge" alt="Green IT" />
    <img src="https://img.shields.io/badge/OWASP%20Top%2010-Hardened-0f172a?style=for-the-badge" alt="OWASP Hardened" />
  </p>
</div>

---

## 1. ¿Qué es este proyecto?

Esta plataforma es una aplicación web educativa de **acceso abierto y código libre**, desarrollada en la **Universidad Vasco de Quiroga (UVAQ)** dentro de la asignatura **Desarrollo Sustentable** (Séptimo Semestre de Ingeniería en Sistemas y Seguridad Informática).

Su propósito es atender desde la **prevención primaria y pedagógica** la problemática social que vive el municipio de **Morelia, Michoacán**, el cual opera bajo una declaratoria vigente de **Alerta de Violencia de Género contra las Mujeres (AVGM)** desde 2016 (CONAVIM). En lugar de recurrir a documentos técnicos dirigidos únicamente a adultos, el sistema traduce conceptos fundamentales de derechos humanos, autocuidado, corresponsabilidad en el hogar y justicia laboral en **8 minijuegos interactivos** adaptados a tres rangos de edad (**6–9 años**, **10–13 años** y **14+ años**).

---

## 2. ¿Cómo apoya la Ingeniería en Sistemas al Desarrollo Sustentable desde el ODS 5?

El **Desarrollo Sustentable** no se limita a la ecología; requiere **sustentabilidad social**, equidad estructural y paz comunitaria. Desde la **Ingeniería en Sistemas y Seguridad Informática**, este proyecto materializa el **Objetivo de Desarrollo Sostenible 5 (Igualdad de Género)** —especialmente la **Meta 5.2** (eliminar todas las formas de violencia contra mujeres y niñas) y la **Meta 5.4** (reconocer y valorar el trabajo doméstico y de cuidados no remunerado)— mediante cinco pilares de ingeniería aplicada:

1. **Privacidad por Diseño (*Privacy by Design*) — Protección de la Infancia:**
   - La mayoría de plataformas educativas gratuitas monetizan datos de menores mediante cookies, analítica invasiva y registro obligatorio.
   - Este sistema es **100% *stateless* (sin servidor de base de datos, sin login, sin cookies ni telemetría)**: toda la lógica y el avance viven exclusivamente en la memoria volátil del navegador del usuario (con guardado opcional y manual en `localStorage`).
2. **Tecnología Verde (*Green IT*) e Inclusión Digital:**
   - Diseñada para escuelas públicas y hogares con equipos de gama básica o redes **3G** limitadas.
   - Emplea **división de código (`next/dynamic`)** por minijuego, gráficos vectoriales **SVG** nativos y un **sintetizador acústico procedural en Web Audio API (`src/utils/audio.ts`)** que genera efectos de sonido en tiempo real sin descargar archivos `.mp3`/`.wav`, ahorrando ancho de banda y energía.
3. **Accesibilidad Universal (WCAG 2.1 Nivel AA):**
   - Incluye enlace de salto al contenido principal, navegación íntegra por teclado, modo de **Alto Contraste** real (WCAG AAA/AA oscuro), **Texto Grande**, **Reducción de Movimiento** (sincronizada con `prefers-reduced-motion`), lectura en voz alta con **Web Speech API** y objetivos táctiles $\ge 44\text{ px}$.
4. **Ciberseguridad Defensiva (OWASP Top 10):**
   - Configurada en `next.config.ts` con cabeceras HTTP estrictas: **Content-Security-Policy (CSP)** sin `unsafe-eval` en producción, `X-Frame-Options: DENY` (anti-clickjacking), `Permissions-Policy` bloqueando cámara/micrófono/geolocalización/topics, `Cross-Origin-Opener-Policy`, `Strict-Transport-Security (HSTS)` y eliminación de cabeceras de reconocimiento (`poweredByHeader: false`).
5. **Tecnología Cívica (*Civic Tech*) Territorializada:**
   - Incorpora datos reales de México (**INEGI**, Cuenta Satélite del Trabajo No Remunerado = **23.9% del PIB**), legislación vigente (**Art. 86 LFT** y **Ley Olimpia** en Michoacán) y un **Directorio de Apoyo Local** con líneas de auxilio reales en Morelia (**911 Código Violeta**, **CJM Michoacán**, **SeiMujer**, **IMMUJERIS / Puntos Naranja**, **Policía Cibernética** y **DIF**).

---

## 3. ¿Qué es el programa? (Descripción de módulos y los 8 minijuegos)

La interfaz está guiada por **Axo**, un ajolote michoacano ilustrado en SVG, y se organiza en **3 Mundos Progresivos**:

### 🌱 Mundo 1 · Valle del Respeto (Nivel Infantil: 6 a 9 años)
1. **Semáforo del Respeto (`SemaforoContacto.tsx`):** Clasificación de situaciones cotidianas (verde = respeto y permiso, amarillo = tú decides / alerta, rojo = ¡ALTO! y pedir ayuda), mapa corporal neutro interactivo en SVG y escena de red de adultos de confianza.
2. **La Balanza del Tiempo (`BalanzaDelTiempo.tsx`):** Juego *drag-and-drop* y accesible donde el estudiante distribuye 20 tareas del hogar, empleo y juego entre miembros de la familia. La balanza solo se equilibra cuando tanto el trabajo doméstico como las horas de descanso son justos.
3. **Memorama de Pioneras (`MemoramaLideres.tsx`):** Tableros de memoria 3D (`3x2`, `4x3`, `4x4`) con retratos SVG de referentes mexicanas y michoacanas (Katya Echazarreta, Amalia Solórzano, Sor Juana Inés de la Cruz, Dra. Julieta Fierro, Elvia Carrillo Puerto, Dra. Matilde Montoya, Mariana Navarro y Frida Kahlo) + cápsulas educativas con voz.

### ⚡ Mundo 2 · Ciudad Equidad (Nivel Intermedio: 10 a 13 años)
4. **El Muro de los Mitos (`MuroDeLosMitos.tsx`):** Arcade tipo *Breakout* en HTML5 Canvas con bucle *delta-time* y *power-ups*, donde derribar ladrillos con micromachismos desbloquea argumentos reales sobre igualdad.
5. **El Escudo Emocional (`EscudoEmocional.tsx`):** Juego de acción 2D en Canvas para desmitificar mandatos rígidos de masculinidad: el jugador atrapa emociones válidas (tristeza, empatía, pedir ayuda) mientras un escudo autorrecargable repele presiones machistas.
6. **El Valor Invisible (`ValorInvisible.tsx`):** Simulador socioeconómico familiar (hasta 5 integrantes) que calcula el valor mensual en pesos mexicanos del trabajo doméstico no remunerado y grafica la distribución de género frente al **23.9% del PIB nacional (INEGI)**.

### 🚀 Mundo 3 · Cumbre Justicia (Nivel Juvenil: 14+ años)
7. **A Igual Trabajo, Igual Salario (`IgualSalario.tsx`):** Simulador financiero de auditoría organizacional en 4 sectores laborales. Permite visualizar la pérdida salarial acumulada a 10 años, superar la pirámide del *techo de cristal* y aplicar el **Artículo 86 de la Ley Federal del Trabajo**.
8. **Círculo de Confianza y Valentía (`CirculoConfianza.tsx`):** Novela gráfica interactiva basada en una máquina de estados finitos (`src/content/game8-circulo.ts`) sobre violencia digital (**Ley Olimpia**), control en el noviazgo y acoso escolar, con advertencia previa, botón de **Salida Rápida** inmediata y enlace directo al directorio de auxilio.

### 👩‍🏫 Módulos Transversales de Apoyo
- **Panel Docente (`/docentes`):** Guía pedagógica de solo lectura con objetivos por juego, preguntas detonadoras de diálogo grupal y hoja de estilos optimizada para imprimir en PDF/papel (`@media print`).
- **Directorio de Apoyo (`DirectorioApoyo.tsx`):** Botón permanente *"Necesito ayuda"* con marcado directo y copia de teléfonos de emergencia nacionales, estatales y municipales en Morelia.
- **Álbum de Logros (`AchievementAlbumModal.tsx`):** Colección de estrellas e insignias de equidad con guardado estrictamente voluntario en el propio dispositivo.

---

## 4. Stack tecnológico y estructura del código

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript 5
- **Estilos:** Tailwind CSS 3 + Design Tokens WCAG (`src/app/globals.css`)
- **Gráficos y Audio:** SVG nativo + HTML5 Canvas + Web Audio API + `canvas-confetti`
- **Pruebas unitarias:** Vitest (`src/tests/logic.test.ts`)

```text
src/
├── app/
│   ├── icon.svg             # Emblema/Favicon vectorial oficial
│   ├── manifest.ts          # Manifiesto PWA (instalación local sin rastreo)
│   ├── layout.tsx           # Metadata, Viewport, Skip Link y AppProviders
│   ├── globals.css          # Tokens de diseño, Alto Contraste WCAG AAA/AA y animación 3D
│   ├── page.tsx             # Selector de edad, Mapa de Aventura y carga dinámica
│   └── docentes/page.tsx    # Panel docente imprimible de solo lectura
├── components/
│   ├── DirectorioApoyo.tsx  # Líneas nacionales, Michoacán y Morelia
│   ├── common/              # BrandLogo, TopBar, GameShell, Mascot (Axo), Button3D, modales
│   └── games/               # Los 8 minijuegos interactivos
├── content/                 # Datos educativos y lógica pura desacoplada
├── context/                 # SoundContext, ProgressContext y AccessibilityProvider
├── hooks/                   # useGameLoop, useSound, useReducedMotion, useKeyboardControls
├── tests/                   # 10 pruebas unitarias Vitest de lógica pura
└── utils/audio.ts           # Sintetizador Web Audio API (Green IT)
```

---

## 5. Instalación, pruebas y despliegue

```bash
# 1. Instalar dependencias
npm install

# 2. Ejecutar servidor de desarrollo (http://localhost:3000)
npm run dev

# 3. Ejecutar pruebas unitarias (Vitest)
npm run test

# 4. Verificar reglas de ESLint
npm run lint

# 5. Generar compilación de producción (verificación estricta de TypeScript y rutas)
npm run build
```

### Despliegue público en GitHub Pages
Este repositorio incluye el flujo automático `.github/workflows/deploy-pages.yml`:
1. Cada `push` a la rama `main` ejecuta `vitest`, `eslint` y compila la exportación estática (`GITHUB_PAGES=true npm run build`).
2. En GitHub, ve a **Settings → Pages → Source** y selecciona **GitHub Actions** (si no estaba activado previamente).
3. El sitio quedará publicado en `https://aranveva.github.io/ods5-plataforma-morelia/`.

### Despliegue alternativo en Vercel
1. En **Vercel**, importa este repositorio (sin variables de entorno `.env`).
2. Framework Preset: **Next.js** → **Deploy** (aplica automáticamente las cabeceras CSP/OWASP completas de `next.config.ts`).

---

## 6. Créditos Académicos

- **Institución:** Universidad Vasco de Quiroga (UVAQ) — Facultad de Ingeniería y Ciencias Computacionales
- **Licenciatura:** Ingeniería en Sistemas y Seguridad Informática (Séptimo Semestre)
- **Asignatura:** Desarrollo Sustentable
- **Docente:** Mtra. Liliana Vizcaíno Monroy
- **Autora:** Arantza Venegas Valencia
- **Licencia:** Proyecto educativo de acceso abierto para escuelas y comunidad de Morelia, Michoacán.
