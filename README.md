# Plataforma Educativa e Interactiva sobre Equidad de Género (ODS 5)
### Municipio de Morelia, Michoacán • Modelo de Privacidad por Diseño (Privacy by Design)

Prototipo interactivo y ciberseguro de **Tecnología Cívica (Civic Tech)** y **Green IT**, desarrollado para atender la **Alerta de Violencia de Género contra las Mujeres (AVGM)** en Morelia mediante la gamificación pedagógica en la niñez y juventud.

---

## 🌟 Pilares Arquitectónicos y Éticos

1. **Privacy by Design (Cavoukian, 2011)**:
   - **Arquitectura Stateless**: Cero bases de datos relacionales en backend, cero cuentas de usuario y cero cookies de rastreo comercial.
   - Todo el estado y la interactividad se gestionan en memoria volátil de forma efímera en el navegador del usuario (*Client-Side State Management con React Hooks*).
   - Ningún dato personal, identificador escolar o métrica de comportamiento abandona el dispositivo del menor.
2. **Ciberseguridad OWASP Top 10**:
   - Cabeceras HTTP endurecidas en `next.config.ts`: `Content-Security-Policy (CSP)`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Permissions-Policy`, y `Strict-Transport-Security`.
3. **Inclusión Digital & Green IT**:
   - Tiempos de carga ultra ligeros (< 3 segundos en redes 3G).
   - Estándares de accesibilidad web **WCAG 2.1**.

---

## 🎮 Los 8 Juegos Didácticos Implementados

### Nivel 1: Rango Infantil (6 a 9 años) — Autoconocimiento, Prevención y Empatía
- **1. Semáforo del Contacto (Meta ODS 5.2):**
  - Silueta SVG interactiva con código de semáforo (Verde, Amarillo, Rojo) para la detección de límites corporales, consentimiento y prevención del abuso infantil.
- **2. La Balanza del Tiempo (Meta ODS 5.4):**
  - Distribución interactiva de tareas del hogar y tiempo libre entre personajes femeninos y masculinos. La báscula física se inclina o equilibra según la corresponsabilidad justa.
- **3. Memorama de Mujeres Líderes (Empoderamiento STEM):**
  - Algoritmo de barajado aleatorio (Fisher-Yates) con cápsulas biográficas y síntesis auditiva (SpeechSynthesis) de referentes mexicanas (Katya Echazarreta, Sor Juana Inés de la Cruz, Elvia Carrillo Puerto, Dra. Julieta Fierro).

### Nivel 2: Rango Intermedio (10 a 13 años) — Deconstrucción y Economía de Cuidados
- **4. El Muro de los Mitos (Erradicación de Micromachismos):**
  - Minijuego tipo arcade Breakout en HTML5 Canvas para destruir bloques de estereotipos arraigados y desbloquear verdades formativas.
- **5. El Escudo Emocional (Nuevas Masculinidades):**
  - Dinámica con detección de colisiones 2D: atrapa emociones válidas (tristeza, empatía, pedir ayuda) y desvía mandatos machistas de invulnerabilidad.
- **6. El Valor Invisible (Meta ODS 5.4 & Datos INEGI 2025):**
  - Simulador y calculadora financiera interactiva del trabajo de cuidado no remunerado y su impacto en el Producto Interno Bruto (PIB).

### Nivel 3: Rango Juvenil (14+ años) — Derechos, Brecha Salarial y Redes de Apoyo
- **7. A Igual Trabajo, Igual Salario (Justicia Laboral y Ley Federal del Trabajo Art. 86):**
  - Simulador de auditoría salarial corporativa con sliders dinámicos para eliminar la brecha de género y romper techos de cristal en promociones.
- **8. Círculo de Confianza y Valentía (Violencia Digital & Ley Olimpia):**
  - Novela gráfica basada en máquinas de estado / árbol de decisiones ante situaciones de ciberacoso y difusión no consentida, enlazada a un **directorio oficial de auxilio y denuncia en Morelia y Michoacán** (Centro de Justicia para las Mujeres, SeiMujer, IMMUJERIS, Policía Cibernética del Estado y 911).

---

## 🚀 Requisitos y Puesta en Marcha Local

### Prerrequisitos
- **Node.js** v18+ o v20+ instalado.
- **npm**, **yarn** o **pnpm**.

### Instalación
```bash
# 1. Clonar el repositorio
git clone <URL_DE_TU_REPOSITORIO>
cd ods5-plataforma-morelia

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo local
npm run dev
```
Abre en tu navegador: [http://localhost:3000](http://localhost:3000)

### Compilación para Producción (Deploy en Vercel)
```bash
npm run build
npm run start
```

---

## 📁 Estructura del Código

```text
src/
├── app/
│   ├── globals.css           # Estilos base y Tailwind CSS
│   ├── layout.tsx            # Metadata, viewport accesible y configuración HTML
│   └── page.tsx              # Portal central, filtros cognitivos y fundamentación
├── components/
│   └── games/
│       ├── SemaforoContacto.tsx   # Juego 1 (SVG interactivo)
│       ├── BalanzaDelTiempo.tsx   # Juego 2 (Báscula y corresponsabilidad)
│       ├── MemoramaLideres.tsx    # Juego 3 (Memorama y cápsulas STEM)
│       ├── MuroDeLosMitos.tsx     # Juego 4 (Arcade Canvas Breakout)
│       ├── EscudoEmocional.tsx    # Juego 5 (Físicas 2D y salud emocional)
│       ├── ValorInvisible.tsx     # Juego 6 (Calculadora PIB INEGI)
│       ├── IgualSalario.tsx       # Juego 7 (Auditoría salarial y sliders)
│       └── CirculoConfianza.tsx   # Juego 8 (Novela gráfica y directorio Morelia)
└── data/
    └── educational-content.ts     # Directorio Morelia, biografías y datos oficiales
next.config.ts                     # Blindaje HTTP y políticas CSP (OWASP Top 10)
```

---

## 📄 Licencia
Este proyecto es software libre y de código abierto bajo la licencia **MIT**, destinado a la investigación y beneficio comunitario de escuelas, familias y organizaciones de la sociedad civil.
