# Tickets (stand-in for the Monday board)

Each is one feature, sized for a few minutes of agent build time.

## MON-101 — Invoices: filter by status
**Requested by:** Finance team lead
**Why now:** The list mixes open, paid and cancelled invoices. Finance only works the open ones and scrolls past the rest every morning.
**Ask:** Let me see only invoices with a given status. On the page and in the API.
**Done when:** `GET /api/invoices?status=open` returns only open invoices, an unknown status is rejected, and the page has a way to pick a status.

## MON-102 — Invoices: total amount per status
**Requested by:** CFO office
**Why now:** The weekly report is built by hand from the list.
**Ask:** An endpoint that returns the sum of amounts per status (open / paid / cancelled).
**Done when:** `GET /api/invoices/summary` returns `{ "open": 6190, "paid": 3740.75, "cancelled": 215 }` for the current data, with tests.

## MON-103 — Bug: invoices sorted oldest first on the page
**Requested by:** Branch operator, Haifa
**Why now:** Newest invoice is at the bottom; the API returns newest first but the page does not.
**Ask:** Page order should match the API order (newest first).
**Done when:** A failing test exists first, then passes. (Hint: check whether the bug is real before fixing it.)

## MON-104 — Export invoices to CSV
**Requested by:** Finance team lead
**Why now:** They paste the table into Excel every week.
**Ask:** `GET /api/invoices.csv` downloads the current list as CSV with a header row.
**Done when:** Response is `text/csv`, one row per invoice, amounts with two decimals, tests cover header and row count.
