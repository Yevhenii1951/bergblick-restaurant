# Bergblick – Spec

## Problem Statement

A restaurant (training project) in Kassel needs a multilingual website that shows its menu and lets German visitors order takeaway, so they can learn what the kitchen offers and place a pickup/delivery order without calling.

## Solution

A static Astro website (DE/RU/EN) with a menu sourced from structured JSON, a takeaway cart + order flow (submitted via Telegram notification, no server persistence), reservation stub, opening hours, location map (cookie-consent gated), and German legal pages. Images loaded from free image URLs only.

## User Stories

1. As a visitor, I want to switch the whole site between Deutsch / Русский / English, so that I can read it in my language.
2. As a visitor, I want to see the menu grouped into sections (Vorspeisen, Hauptgerichte, Vegetarisch, Fusion, Desserts, Getränke), so that I can browse by course.
3. As a visitor, I want each dish to show a name, description, price and optional photo, so that I can choose.
4. As a visitor, I want to add dishes to a cart and adjust quantities, so that I can compose a takeaway order.
5. As a visitor, I want to see (and remove) my cart contents and the running total, so that I know what I'm ordering and what it costs.
6. As a visitor, I want to submit an order with my name, phone and pickup time, so that the restaurant can prepare it.
7. As a visitor, I want free delivery to be shown clearly once my order reaches the threshold, so that I know the deal.
8. As a visitor, I want the order to reach the restaurant by Telegram notification, so that they actually receive it (training stub).
9. As a visitor, I want to my submitted order to be acknowledged, so that I know it went through.
10. As a visitor, I want to request a table reservation via a stub form, so that I can express intent (training only).
11. As a visitor, I want to see the address, opening hours, phone, and an interactive map, so that I can find and contact the restaurant.
12. As a visitor, I want to see a photo gallery of dishes and the interior, so that I trust the kitchen.
13. As a visitor, I want to read Impressum and Datenschutz from every page, so that the site is German-legal.
14. As a visitor, I want the location map to load only after cookie consent, so that privacy is respected.
15. As a visitor, I want to see Story/About content about "Bergblick"/Kassel, so that I connect with the restaurant.

## Implementation Decisions

- **Stack**: Astro 5 (static) + React 19 islands + TypeScript strict + Tailwind 4 + daisyUI 5. `@tailwindcss/vite` plugin; daisyUI via `@plugin` in `global.css`.
- **Theme**: single daisyUI `mytheme` (light) from the user's config; blue primary, teal secondary, green accent.
- **i18n**: locale-driven routing under `src/pages/<locale>/` with `de` default. Localized UI strings in `src/i18n/<locale>.ts` (typed dictionary); page content/menu translated inline in content files.
- **Menu data**: structured content under `src/content/menu/*.json` with the `dish`/`menu section` schema. Translated names/descriptions supplied per locale in the same file.
- **Takeaway**: `cart` is a React context persisted to localStorage on the client only (no server). `order` is built from the cart + contact fields and sent via a `Telegram` adapter (config in env); it is not stored server-side.
- **Free delivery threshold**: single config constant (default €25) referenced by the cart "total" logic and displayed next to the order CTA.
- **Reservation**: standalone stub `reservation` form (contact fields + preferred time), no backend; shows a confirmation toast only.
- **Map**: Leaflet + OpenStreetMap loaded through a `defer` helper only after cookie consent.
- **Images**: external Unsplash/Pexels URLs only; hotlinked via `<img src=...>` (no downloaded assets). Poster/hero uses a free image URL.
- **Legal**: static Impressum + Datenschutz pages for each locale.

## Testing Decisions

- Good tests assert external behaviour (rendered content, cart math, order shape), not implementation details.
- Unit-test the takeaway core: cart add/remove/quantity, total + free-delivery threshold calc, and order payload shape (pure module).
- Framework: Vitest. Tests live beside the module they test (`*.test.ts`).
- Seam: cart/order logic kept in a pure module (`src/lib/takeaway.ts`) free of DOM/localStorage so it is testable without a browser.

## Out of Scope

- Real online payment.
- Server-side order/database persistence.
- Real reservation backend / table management.
- Real Telegram bot secret provisioning (config value only).
- Auth, admin panel, CMS.
- Downloading or generating images.
- SEO beyond per-locale meta tags and basic sitemap/robots.

## Further Notes

- Training project: all business content (dishes, prices, hours, story) is random but realistic German restaurant data.
- `de` is the primary locale; `ru` / `en` are full translations.
