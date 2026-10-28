---
ticket: MON-101
status: draft        # draft → accepted (a human changes this)
owner: Finance team lead
---

# Invoice status filter

## Problem
Finance works only the open invoices, but the list shows open, paid and cancelled together. Every morning they scroll past rows they do not need.

## Change
A user can ask for invoices of one status. The API accepts an optional `status` query param and returns only matching invoices, still newest first. An unknown status is rejected with an error instead of silently returning everything or nothing. The invoices page gets a control to pick a status, and the table shows only that status.

## Scope
- In: `status` filter on `GET /api/invoices`, validation of the value, a status picker on `/`, tests for all of it.
- In: no `status` param keeps today's behaviour (all invoices).
- Out: filtering by any other field, multiple statuses in one request, sorting changes, persisting the chosen filter.

## Acceptance
- [ ] `GET /api/invoices?status=open` returns only invoices with status `open`, newest first.
- [ ] Same for `paid` and `cancelled`.
- [ ] `GET /api/invoices` with no `status` still returns all 6 invoices.
- [ ] `GET /api/invoices?status=bogus` returns `400` with a JSON `{ "error": ... }` body.
- [ ] `GET /?status=open` renders a table containing only open invoices.
- [ ] `GET /` renders a status picker (a form with a `<select name="status">` and an "All" option) above the table.
- [ ] `npm test` passes; every bullet above has a test in `test/`.

## Constraints
- Filtering logic lives in `src/invoices.js`; `src/server.js` only parses the query and renders.
- Query param is camelCase (`status`), response is JSON.
- Existing tests stay untouched and green.
- Work on branch `feature/MON-101-status-filter`, commits prefixed `MON-101:`.

## Open questions
- Unknown status: `400 Bad Request` with `{ "error": "unknown status: bogus" }`, listing the allowed values? Or a different code/shape?
- Case handling: should `status=Open` be accepted as `open`, or rejected as unknown? Proposed: reject (exact match), keeps validation simple.
- Empty value: should `?status=` behave like no filter, or be rejected? Proposed: treat as no filter.
- Page control: a plain `<select>` + "Filter" button that reloads `/?status=...` (no JavaScript), or a client-side filter? Proposed: no JS, matches the zero-dependency stack.
- Page with unknown status (`/?status=bogus`): show an error message, or fall back to the full list? Proposed: 400 with a short HTML message, consistent with the API.
