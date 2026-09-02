# 02: Menu content schema and shared menu module

**What to build:** Structured `menu` data (sections → dishes, name/description/price/photo per locale) under `src/content/menu/` with a typed schema, plus a pure module that reads the menu for a given locale.

**Blocked by:** 01

**Status:** ready-for-agent

- [ ] JSON files exist for all menu sections (Vorspeisen, Hauptgerichte, Vegetarisch, Fusion, Desserts, Getränke) in de/ru/en
- [ ] `dish` / `menu section` types exist and validate the data
- [ ] Pure `src/lib/menu.ts` returns the localized menu for a locale
- [ ] Prices are numbers; photo field is an optional external URL
