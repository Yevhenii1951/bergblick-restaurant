# Bergblick – Retrospective (ticket-08)

Status: implementation complete and verified.

## What went well

- **Vertical-slice tickets from the start.** Working through tickets 01→08 (scaffold → menu → takeaway core → cart UI → order submit → pages → contact/legal → polish) kept every step shippable and reviewable. The build stayed green at almost every stage.
- **Pure takeaway core.** Keeping cart math in a DOM-free module (`src/lib/takeaway.ts`) made the 13 Vitest tests trivial and reliable. No browser mocking needed.
- **Typed i18n.** A typed `Dictionary` interface with per-locale modules (de/ru/en) caught missing/incorrect translation keys at compile time rather than at runtime.
- **Stable dish ids.** Using `dish.id` (instead of array indices) for add-to-cart means reordering menu data can't silently break carts.
- **Strict TS caught real issues.** During wiring, `astro check` surfaced missing modules, `className` vs `class` mistakes, unused variables, and prop-type mismatches before they ever reached the browser.

## What could be better (lessons)

- **Menu data location.** The spec said `src/content/menu/*.json`, but the implementation used a typed TS module (`src/content/menus.ts`). Divergence from the spec; a future pass should reconcile docs with code (or update the spec).
- **Island weight.** Several small islands (add-to-cart per dish, order form, map) each ship React runtime. Fine for a training project, but a lighter hydration strategy (client:load where needed, fewer islands on the menu) would reduce payload.
- **Deployment not yet wired.** Ticket 08 mentions Netlify deploy; CI/deploy config is out of scope for this pass and pending a follow-up.

## Follow-ups

- Wire Netlify deploy + telegram/env in CI (out of scope here).
- Reconcile spec (menu data location) with the implemented module.
- Optional: add a photo gallery page (user story 12).

## Update 2026-09-02

- Reworked prominent section headings from bright gradient text to a calmer warm-brown style with very subtle motion.
- Unified repeated script/tagline labels onto one softer animated style so pages feel more consistent and less flashy.
- Verified with `npx astro check`; no errors introduced by the styling pass.
