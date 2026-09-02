# 05: Order submit flow + Telegram adapter

**What to build:** An order form (name, phone, pickup time, note) that builds an `order` from the cart + contact, sends it via the `Telegram` adapter, and shows an acknowledgement on success. No server persistence.

**Blocked by:** 04

**Status:** ready-for-agent

- [ ] Order form fields exist and validate (name, phone, time required)
- [ ] buildOrder(cart+contact) is called; total and free-delivery shown
- [ ] `Telegram` adapter (env-config URL) posts the payload; failure surfaces gracefully
- [ ] Success acknowledgement (toast/message) and cart cleared after submission
- [ ] If no Telegram token configured, order falls back to a console/demo confirm (training behaviour)
