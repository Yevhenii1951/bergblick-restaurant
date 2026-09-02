# 03: Takeaway core (cart + order math), pure & tested

**What to build:** A pure, unit-tested `src/lib/takeaway.ts` covering the cart (add/remove/set quantity), the running total, the free-delivery threshold calc, and the order payload shape. No DOM/localStorage here.

**Blocked by:** 02

**Status:** ready-for-agent

- [ ] addDish / removeDish / setQuantity / cartTotal implemented and unit-tested
- [ ] freeDeliveredWithinThreshold(total) returns correct boolean using the config threshold (default €25)
- [ ] buildOrder(cart, contact) returns the Telegram payload shape
- [ ] Formatted currency helper (€) exists and is tested
