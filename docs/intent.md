# Intent — MON-101

**Ticket:** MON-101 — Invoices: filter by status
**Requested by:** Finance team lead
**Status:** proposed (product owner accepts by committing this file)

## The ask, in the requester's words
> Let me see only invoices with a given status. On the page and in the API.

## Why now
> The list mixes open, paid and cancelled invoices. Finance only works the open ones and scrolls past the rest every morning.

## What "done" looks like for them
> `GET /api/invoices?status=open` returns only open invoices, an unknown status is rejected, and the page has a way to pick a status.
