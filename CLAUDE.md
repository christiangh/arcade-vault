# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

Arcade Vault — plataforma para juegos online, competir por puntuación. Spanish-language product; see README.md.

Fresh `create-next-app` scaffold (App Router, TypeScript, Tailwind v4). No custom routes/components/tests exist yet beyond `app/layout.tsx` and `app/page.tsx`.

## Commands

- `npm run dev` — start dev server (Turbopack)
- `npm run build` — production build
- `npm run start` — run production build
- `npm run lint` — ESLint (flat config, `eslint-config-next` core-web-vitals + typescript)

No test runner configured yet.

## Architecture

- App Router only (`app/`), no `pages/` dir — do not introduce one.
- Path alias `@/*` maps to repo root (`tsconfig.json`).
- Styling: Tailwind CSS v4 via `@tailwindcss/postcss` (no `tailwind.config.js` — v4 is CSS-first, configure in `app/globals.css`).
- Fonts: `next/font/google` (Geist Sans/Mono) wired as CSS variables in `app/layout.tsx`.

## Spec-driven workflow

This repo follows spec-driven design using `/spec` and `/spec-impl` conventions from https://github.com/Klerith/fernando-skills, installed via:

```bash
npx skills@latest add Klerith/fernando-skills
```

## Critical: verify Next.js APIs before use

Installed Next.js is 16.3.1 — APIs/conventions may differ from training data. Before writing routing, data-fetching, or config code, check `node_modules/next/dist/docs/` (sections: `01-app`, `02-pages`, `03-architecture`, `04-community`) for the current API shape and heed deprecation notices.
