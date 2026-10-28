---
ticket: MON-101
status: accepted
owner: Finance team lead
---

# Invoices: filter by status

## Problem
The invoice list mixes open, paid and cancelled invoices. Finance only works the open ones and scrolls past the rest every morning.

## Change
A user can ask for invoices of one status, either by adding `?status=<value>` to the API list call or by picking a status on the invoices page. Only matching invoices come back, still newest first. Asking for a status that does not exist is rejected with a clear error instead of silently returning everything or nothing.

## Scope
- In: `GET /api/invoices?status=open|paid|cancelled` returns only invoices with that status, newest first.
- In: `GET /api/invoices` with no `status` keeps returning all invoices (no behaviour change).
- In: An unknown `status` value is rejected with `400` and a JSON `{ "error": ... }` body.
- In: The page at `/` has a way to pick a status; `GET /?status=open` renders only open invoices.
- In: Filtering logic lives in `src/invoices.js`; `src/server.js` only parses the query and renders.
- In: Tests in `test/` for each acceptance line below.
- Out: Filtering by more than one status at once.
- Out: Filtering by any other field (customer, date, amount).
- Out: Sorting, paging, or persisting the chosen filter.
- Out: Changes to `GET /api/invoices/:id`.

## Acceptance
- [ ] `GET /api/invoices?status=open` returns exactly the 3 open invoices (1006, 1003, 1001), newest first.
- [ ] `GET /api/invoices?status=paid` and `?status=cancelled` return 2 and 1 invoices respectively.
- [ ] `GET /api/invoices` (no param) still returns all 6.
- [ ] `GET /api/invoices?status=bogus` returns `400` with a JSON error body.
- [ ] `GET /?status=open` renders a table with exactly 3 data rows.
- [ ] The page at `/` contains a status picker (form or links) that leads to `/?status=<value>`.
- [ ] `npm test` is green.

## Constraints
- Business logic in `src/invoices.js`; `src/server.js` only routes and renders.
- Query params are camelCase; responses are JSON under `/api/...`.
- Every behaviour change ships with a test in `test/`.
- Zero dependencies; Node 20+ only.
- Branch `feature/MON-101-filter-by-status` from `main`; commits `MON-101: <what changed>`.

## Open questions
- Status matching: exact lowercase only (`open`), or case-insensitive (`Open`, `OPEN` also accepted)? Proposed: case-insensitive, normalised to lowercase.
- Empty value (`?status=`): treat as "no filter" (return all) or reject with 400? Proposed: treat as no filter.
- Unknown status on the HTML page (`/?status=bogus`): show a 400 error page, or render the full list with a visible message? Proposed: same 400 JSON-free error page, keeping API and page consistent.
- Page picker: a `<select>` with a Go button (works with zero JS), or plain links "All | Open | Paid | Cancelled"? Proposed: links, simplest and testable.
- Should the list of valid statuses be exported from `src/invoices.js` (e.g. `STATUSES`) so the page picker and validation share one source of truth? Proposed: yes.
