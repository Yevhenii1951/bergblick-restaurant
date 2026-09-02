# Bergblick – Domain Glossary

Shared language for this project. Agents and humans use these terms exactly; files, variables, routes and components are named from this vocabulary.

## Terms

- **dish** — a single menu item (one line on the menu with a name, description, price, optional photo).
- **menu section** — a named category on the menu (Vorspeisen, Hauptgerichte, Desserts, Getränke, Vegetarisch, Fusion).
- **menu** — the ordered collection of menu sections. Sourced from `src/content/menu/*.json`.
- **takeaway** — the restaurant's order-for-pickup/delivery product: a customer assembles a **cart** of dishes and submits an **order**.
- **cart** — the customer's current selection of dishes (quantities) held in the browser (localStorage), no server.
- **order** — a submitted takeaway request: cart contents + customer contact (name, phone, pickup time) + free-delivery threshold check. Delivered as a Telegram notification; never persisted server-side (training project).
- **free delivery threshold** — order total at or above which delivery is free (configurable; default €25).
- **locale** — one of `de` (default), `ru`, `en`. The site renders the same content in all three.
- **translation** — a single phrase mapped across `de`/`ru`/`en` in `src/i18n/`.
- **hero** — the landing section at the top of the home page.
- **reservation** — dining-table booking; for a training project this is a stub form (no real backend), separate from **takeaway**.
- **defer** — a helper that loads a heavy third-party embed (map) only after cookie consent.

## Architecture vocabulary (from codebase-design)

- **module** — a self-contained unit with one responsibility and a small, deep interface.
- **seam** — the boundary where a module can be tested/replaced (here: the i18n dictionary and the content/menu schema).
- **adapter** — code that wraps an external provider (Telegram, image CDN) behind a stable interface.

## Naming conventions

- Components: `PascalCase.astro` / `PascalCase.tsx`.
- Routes: kebab-case, one file per locale under `src/pages/<locale>/`.
- Menu data: one file per menu section under `src/content/menu/`.
