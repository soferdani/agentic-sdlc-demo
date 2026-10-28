---
ticket: MON-101
status: draft
spec: docs/specs/filter-by-status.md
---

# Plan: Invoices filter by status

## Decisions on the spec's open questions
The spec proposes an answer for each open question. This plan adopts every proposal as written:
- Status matching is case-insensitive, normalised to lowercase (`Open` → `open`).
- Empty value (`?status=`) is treated as "no filter" and returns all invoices.
- Unknown status on the HTML page (`/?status=bogus`) returns `400` with a plain HTML error page.
- The page picker is plain links: `All | Open | Paid | Cancelled`, each pointing at `/?status=<value>` (`All` points at `/`).
- `STATUSES` is exported from `src/invoices.js` as the single source of truth for validation and the picker.

## Files to change

- `src/invoices.js` — add `STATUSES = ["open", "paid", "cancelled"]` and give `listInvoices` an optional `{ status }` argument. It normalises the value (trim + lowercase), treats empty/undefined as no filter, throws an `Error` for an unknown status, and otherwise filters the already-sorted list. Export `STATUSES`. This keeps all business rules in one place as the spec requires.
- `src/server.js` — read `url.searchParams.get("status")` for both `/api/invoices` and `/`, pass it to `listInvoices`, and translate a thrown validation error into `400` (JSON body for the API, small HTML error page for `/`). Add the status picker links to `page()`, built from `STATUSES`, with the active one marked. No filtering logic here; only parsing and rendering.
- `test/invoices.test.js` — add the tests listed below. Existing tests stay untouched; the existing `GET /` row-count test still expects 6 rows because the picker links are not `<tr>` elements.
- `docs/plans/filter-by-status.md` — this file; updated in the same commit if implementation departs from it.

## Tests to add

Unit level (`src/invoices.js`):
1. `listInvoices filters by status, newest first` — `listInvoices({ status: "open" })` returns ids `[1006, 1003, 1001]` in that order.
2. `listInvoices returns paid and cancelled counts` — `paid` returns 2 invoices, `cancelled` returns 1.
3. `listInvoices without status returns all` — `listInvoices()` and `listInvoices({})` both return 6.
4. `listInvoices normalises case and treats empty as no filter` — `{ status: "OPEN" }` returns 3; `{ status: "" }` returns 6.
5. `listInvoices throws on unknown status` — `{ status: "bogus" }` throws an `Error` whose message names the valid statuses.
6. `STATUSES lists the three known statuses` — exported array equals `["open", "paid", "cancelled"]`.

HTTP level (via `withServer`):
7. `GET /api/invoices?status=open returns exactly the 3 open invoices newest first` — status 200, body ids `[1006, 1003, 1001]`.
8. `GET /api/invoices?status=paid and cancelled return 2 and 1` — two fetches, lengths 2 and 1, every item has the requested status.
9. `GET /api/invoices?status=bogus returns 400 with a JSON error body` — status 400, `Content-Type` JSON, body has a string `error` property.
10. `GET /?status=open renders a table with exactly 3 data rows` — status 200, `<tr><td>` count is 3, every row shows `open`.
11. `GET / contains a status picker linking to /?status=<value>` — HTML contains `href="/?status=open"`, `href="/?status=paid"`, `href="/?status=cancelled"`.
12. `GET /?status=bogus returns 400` — status 400 and HTML content type.

The existing `GET /api/invoices returns JSON list` test continues to cover acceptance line "no param still returns all 6".

## Order of work
Each step ends with `npm test` green. Work happens on `feature/MON-101-filter-by-status` from `main`, one commit per step, messages `MON-101: <what changed>`.

1. Add `STATUSES` export and unit tests 6 and 3 (the no-arg path already passes). Commit.
2. Add the `{ status }` argument with filtering only, plus tests 1 and 2. Commit.
3. Add normalisation, empty handling and the unknown-status throw, plus tests 4 and 5. Commit.
4. Wire `?status` into `/api/invoices` with the `400` JSON branch, plus tests 7, 8, 9. Commit.
5. Wire `?status` into `/` with the `400` HTML branch, plus tests 10 and 12. Commit.
6. Add the picker links to `page()` built from `STATUSES`, plus test 11. Confirm the existing `GET /` row-count test still sees 6 rows. Commit.
7. Run `npm test` and `npm start`, hit `/?status=open` by hand, then open the PR and stop.

## Risks / what I am unsure about
- **Throwing from `listInvoices`** is the simplest way to keep validation in `src/invoices.js`, but it means `server.js` needs a try/catch. An alternative is returning `null`. I chose throwing because it is explicit; the plan can switch if the reviewer prefers.
- **Picker markup vs the existing row-count test.** The existing test counts `<tr><td>` occurrences. The picker must not use table rows, or that test and test 10 break. Plan uses a `<nav>` with `<a>` elements.
- **Error page for `/?status=bogus`.** The spec's proposal says "JSON-free error page". I interpret that as a minimal HTML `400` page with the message and a link back to `/`. If the product owner wanted the full list with a banner instead, step 5 changes.
- **`listInvoices` signature change** is backwards compatible (optional object argument), so no other caller breaks. There are currently only two callers, both in `server.js`.
- **No handling of repeated params** (`?status=open&status=paid`). `searchParams.get` takes the first value. Multi-status is out of scope per the spec, so this is accepted behaviour.
