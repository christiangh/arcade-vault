# 01 — MVP Pantallas Arcade Vault

**Estado:** Approved
**Depende de:** —
**Fecha:** 2026-08-17

**Objetivo:** Portar a Next.js (App Router + TypeScript + Tailwind v4) las 4 pantallas visuales de la plantilla en `references/templates/` (biblioteca, detalle, reproductor, salón de la fama) como maqueta funcional sin lógica real de juego ni autenticación, con navegación real por rutas y puntuaciones guardadas en localStorage.

## Alcance

**Incluye:**
- Layout raíz con fondo animado (grid + scanlines + noise), navbar sticky (`Nav`) y footer, aplicado a todas las rutas.
- Pantalla **Biblioteca** (`/`): hero, buscador, chips de categoría, grid de tarjetas de juego con efecto tilt, estado "sin resultados".
- Pantalla **Detalle** (`/juego/[id]`): portada, tags, descripción, stats, leaderboard lateral, botones "Jugar ahora" / "Volver".
- Pantalla **Reproductor** (`/juego/[id]/jugar`): HUD (jugador, puntuación, vidas, nivel), pantalla CRT con animación decorativa de "juego" (nave, enemigos, grid), pausa/fin simulados, modal de fin de partida con guardado de puntuación (solo localStorage). Nombre de jugador por defecto `INVITADO`, editable en el modal.
- Pantalla **Salón de la Fama** (`/salon`): tabs por juego, podio top 3, tabla de puntuaciones.
- Datos mock (`GAMES`, `CATS`, `PLAYERS`, `seededScores`) portados a TypeScript.
- Persistencia en `localStorage`: puntuaciones guardadas (`av_scores`).
- Fuentes `Press Start 2P` (pixel) y `JetBrains Mono` (mono) vía `next/font/google`, sustituyendo Geist en `app/layout.tsx`.
- CSS de la plantilla (`styles.css`) portado íntegro a `app/globals.css`, conviviendo con Tailwind v4.

**No incluye:**
- **Autenticación**: no hay pantalla `/auth`, ni sesión de usuario, ni `localStorage` `av_user`, ni login social. Queda diferido a una spec posterior.
- Fila "tu mejor marca" en el salón de la fama (depende de sesión de usuario, diferida con la autenticación).
- Ningún juego jugable de verdad (el "arena" del reproductor es decorativo, sin física ni input del jugador).
- Backend, base de datos o API real.
- Sistema de créditos/monedas funcional (el contador "CRÉDITOS · 03" del nav es estático, como en la plantilla).
- Tests automatizados (no hay test runner configurado en el proyecto).
- Internacionalización (todo en español, como la plantilla).

## Modelo de datos

Todo mock, sin backend. En `lib/data.ts`:

```ts
export type GameCategory = "ARCADE" | "PUZZLE" | "SHOOTER" | "VERSUS";

export interface Game {
  id: string;
  title: string;
  short: string;
  long: string;
  cat: GameCategory;
  cover: string; // clase CSS de portada (cover-bricks, cover-tetro, ...)
  color: "cyan" | "magenta" | "yellow" | "green";
  best: number;
  plays: string;
}

export const GAMES: Game[];
export const CATS: readonly ["TODOS", "ARCADE", "PUZZLE", "SHOOTER", "VERSUS"];
export const PLAYERS: string[];

export interface ScoreRow {
  rank: number;
  name: string;
  score: number;
  date: string;
}
export function seededScores(seed: number, count?: number): ScoreRow[];
```

En `lib/storage.ts`, helper tipado sobre localStorage:

```ts
export interface SavedScore { game: string; score: number; name: string; at: number }

export function saveScore(entry: { game: string; score: number; name: string }): void;
```

## Plan de implementación

1. **Fuentes y CSS base.** Reemplazar Geist por `Press Start 2P` + `JetBrains Mono` en `app/layout.tsx` (variables `--pixel`, `--mono`). Portar `styles.css` completo a `app/globals.css` (clases `.av-*`, `.btn`, `.card`, `.crt`, `.modal`, animaciones, etc.), respetando que Tailwind v4 siga activo vía `@tailwindcss/postcss`. Verificable: `npm run dev` sirve una página en blanco con fondo neón/scanlines ya visible.
2. **Datos y storage.** Crear `lib/data.ts` (GAMES, CATS, PLAYERS, seededScores) y `lib/storage.ts` (`saveScore`), portados 1:1 desde `data.jsx` y la lógica de `app.jsx`.
3. **Layout raíz y Nav.** Crear `components/Nav.tsx` (client component) con logo, links activos por ruta (`usePathname`), contador de créditos estático y menú móvil con panel deslizante. Sin botón de sesión (se añadirá con la spec de autenticación). Integrar en `app/layout.tsx` junto al fondo animado (`.av-bg`, `.av-noise`) y footer. Verificable: navbar visible y funcional (activo resalta ruta, hamburguesa abre panel en móvil) en cualquier pantalla.
4. **Biblioteca (`/`).** `app/page.tsx` + `components/GameCard.tsx` (client, con efecto tilt on mouse move). Hero, buscador, chips de categoría, grid filtrable, estado vacío. Verificable: buscar y filtrar por categoría actualiza el grid en vivo.
5. **Detalle (`/juego/[id]`).** `app/juego/[id]/page.tsx`. Portada, tags, descripción, stat-strip, leaderboard con `seededScores`, botones "Jugar ahora" (navega al reproductor) y "Volver". Verificable: cada juego del catálogo tiene su página de detalle accesible desde la tarjeta.
6. **Reproductor (`/juego/[id]/jugar`).** `app/juego/[id]/jugar/page.tsx` (client). HUD con puntuación que sube sola por `setInterval`, vidas, nivel, pausa/fin, arena CRT decorativa (nave + enemigos animados por CSS), modal de fin de partida con input de iniciales (por defecto `INVITADO`) y botón "Guardar puntuación" que escribe en `av_scores` vía `lib/storage.ts`. Verificable: al pulsar "Fin" aparece el modal, guardar puntuación la persiste en localStorage y lo confirma con el toast.
7. **Salón de la Fama (`/salon`).** `app/salon/page.tsx`. Tabs por juego, podio top 3, tabla completa con `seededScores`. Verificable: cambiar de tab cambia el juego mostrado con podio y tabla coherentes.
8. **Repaso final.** Recorrer las 4 pantallas en `npm run dev`, confirmar que coinciden visualmente con `Arcade Vault.html` de referencia, y que no quedan referencias a Geist ni a los `.jsx` de `references/templates/` en el código nuevo.

## Criterios de aceptación

- [ ] `npm run dev` levanta la app y `/` muestra la biblioteca con hero, buscador y grid de 8 juegos.
- [ ] Buscar por nombre y filtrar por categoría actualiza el grid sin recargar la página.
- [ ] Click en una tarjeta o "JUGAR" navega a `/juego/[id]` con datos correctos del juego.
- [ ] `/juego/[id]` muestra leaderboard con 10 filas ordenadas por puntuación descendente.
- [ ] "JUGAR AHORA" navega a `/juego/[id]/jugar`; el HUD incrementa la puntuación automáticamente cada ~220ms.
- [ ] Pausa detiene el incremento de puntuación; reanudar lo retoma.
- [ ] "FIN" abre el modal de fin de partida con la puntuación final.
- [ ] Guardar puntuación en el modal la persiste en `localStorage` bajo `av_scores` y muestra el toast de confirmación.
- [ ] `/salon` muestra podio y tabla por cada juego del catálogo al cambiar de tab.
- [ ] No existe la ruta `/auth` ni ninguna referencia a sesión de usuario o `av_user` en el código.
- [ ] El diseño visual (colores neón, tipografía pixel/mono, CRT, scanlines) coincide con `references/templates/Arcade Vault.html`.
- [ ] Ningún archivo de `references/templates/` es importado ni referenciado desde el código de `app/`.

## Decisiones tomadas y descartadas

- **Autenticación fuera del MVP**: se elimina la pantalla `/auth`, la sesión en `localStorage` y todo lo que dependa de ella (botón de login en el nav, fila "tu mejor marca" en el salón). Motivo: reducir alcance del primer MVP visual. Se retomará en una spec posterior, que reintroducirá `av_user` y los componentes dependientes.
- **Rutas reales por carpeta** en vez de router por hash: se descarta el enfoque SPA de la plantilla porque el proyecto ya usa App Router y las rutas reales dan URLs compartibles y mejor DX. Costo: reescribir `navigate()` como `useRouter().push()` / `<Link>`.
- **Simulación decorativa en el reproductor** (no una pantalla estática): se mantiene el HUD "vivo" (puntuación que sube sola, pausa, fin) porque es la pieza más vistosa de la plantilla y no requiere lógica de juego real, solo un `setInterval` decorativo — coherente con "no implementar ningún juego".
- **localStorage sin backend** para las puntuaciones: se mantiene igual que la plantilla para no introducir infraestructura fuera del alcance de un MVP visual.
- **Portar `styles.css` tal cual** en vez de reescribir a utilidades Tailwind: prioriza fidelidad visual exacta a la plantilla sobre "pureza" Tailwind; Tailwind v4 y CSS custom conviven sin conflicto vía `@tailwindcss/postcss`.
- **Sustituir fuentes Geist por Press Start 2P / JetBrains Mono**: requerido por el diseño de la plantilla (`--pixel`, `--mono`); Geist no estaba anclado a ningún requisito previo, solo era el default del scaffold.

## Riesgos identificados

- El nav de la plantilla reserva espacio para el botón de sesión; al quitarlo hay que revisar que el layout (spacer, contador de créditos, hamburguesa) no quede descompensado en escritorio ni en móvil.
- El efecto tilt 3D de las tarjetas (`GameCard`) usa refs y eventos de mouse directamente sobre el DOM; debe marcarse como client component (`"use client"`) igual que el resto de pantallas interactivas.
- `Press Start 2P` es una fuente muy densa a tamaños pequeños; verificar legibilidad en textos largos (descripción de detalle) igual que en la plantilla original antes de darlo por bueno.
- `localStorage` no existe en SSR: `lib/storage.ts` solo debe invocarse desde cliente (handler de evento o `useEffect`) para evitar errores de hidratación.
