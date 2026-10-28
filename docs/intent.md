---
ticket: MON-101
source: docs/tickets.md
accepted-by: <product owner>
---

# Intent — MON-101: Invoices: filter by status

**Who asked:** Finance team lead.

**The ask, in their words:**
> Let me see only invoices with a given status. On the page and in the API.

**Why now:**
> The list mixes open, paid and cancelled invoices. Finance only works the open ones and scrolls past the rest every morning.

**Done, for them:**
> `GET /api/invoices?status=open` returns only open invoices, an unknown status is rejected, and the page has a way to pick a status.
