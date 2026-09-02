---
project: Bergblick – Restaurant in Kassel
stack: Astro 5 + TypeScript (strict) + Tailwind 4 + daisyUI 5 + React 19 (islands)
deploy: Netlify
---

# Bergblick – Restaurant Website (Training Project)

German-traditional + vegetarian + fusion restaurant website with a takeaway/order system. Three languages (DE/RU/EN) on one site with a language switcher.

## Project Rules

- This is a **training project**: content is random/generated, no real booking or payment.
- Types are mandatory (TypeScript strict everywhere).
- Do not download images; use free image URLs (Unsplash/Pexels).
- Use the domain vocabulary in `CONTEXT.md`.
- Follow the workspace SDD workflow: docs live under `docs/sdd/`.
- After finishing, write a retrospective under `docs/sdd/`.

## Commands

- `npm run dev` – dev server (use `astro dev --background` for background mode)
- `npm run build` – production build
- `npm run preview` – preview built site
- `npx astro check` – type/lint check

## What To Read (SDD docs)

- `docs/sdd/spec.md` – the spec (what we build)
- `docs/sdd/tickets/*.md` – vertical-slice tickets
- `CONTEXT.md` – shared domain language
- `docs/adr/` – architecture decisions
