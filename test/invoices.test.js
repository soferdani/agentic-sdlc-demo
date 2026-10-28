const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const { STATUSES, listInvoices, getInvoice } = require("../src/invoices");
const { handle } = require("../src/server");

test("listInvoices returns all invoices newest first", () => {
  const all = listInvoices();
  assert.equal(all.length, 6);
  assert.equal(all[0].id, 1006);
  assert.equal(all[all.length - 1].id, 1001);
});

test("STATUSES lists the three known statuses", () => {
  assert.deepEqual(STATUSES, ["open", "paid", "cancelled"]);
});

test("listInvoices without status returns all", () => {
  assert.equal(listInvoices().length, 6);
  assert.equal(listInvoices({}).length, 6);
});

test("listInvoices filters by status, newest first", () => {
  const open = listInvoices({ status: "open" });
  assert.deepEqual(open.map((i) => i.id), [1006, 1003, 1001]);
});

test("listInvoices returns paid and cancelled counts", () => {
  assert.equal(listInvoices({ status: "paid" }).length, 2);
  assert.equal(listInvoices({ status: "cancelled" }).length, 1);
});

test("listInvoices normalises case and treats empty as no filter", () => {
  assert.equal(listInvoices({ status: "OPEN" }).length, 3);
  assert.equal(listInvoices({ status: "" }).length, 6);
});

test("listInvoices throws on unknown status", () => {
  assert.throws(() => listInvoices({ status: "bogus" }), (err) => {
    assert.ok(err instanceof Error);
    for (const s of STATUSES) assert.match(err.message, new RegExp(s));
    return true;
  });
});

test("getInvoice finds by id and returns undefined for unknown", () => {
  assert.equal(getInvoice(1003).customer, "Tel Aviv Sorting Hub");
  assert.equal(getInvoice("1003").id, 1003);
  assert.equal(getInvoice(9999), undefined);
});

// Spin the handler up on a random port for HTTP-level tests.
async function withServer(fn) {
  const server = http.createServer(handle);
  await new Promise((r) => server.listen(0, r));
  const base = `http://localhost:${server.address().port}`;
  try {
    await fn(base);
  } finally {
    server.close();
  }
}

test("GET /api/invoices returns JSON list", async () => {
  await withServer(async (base) => {
    const res = await fetch(`${base}/api/invoices`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.length, 6);
  });
});

test("GET /api/invoices?status=open returns exactly the 3 open invoices newest first", async () => {
  await withServer(async (base) => {
    const res = await fetch(`${base}/api/invoices?status=open`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.deepEqual(body.map((i) => i.id), [1006, 1003, 1001]);
  });
});

test("GET /api/invoices?status=paid and cancelled return 2 and 1", async () => {
  await withServer(async (base) => {
    for (const [status, count] of [["paid", 2], ["cancelled", 1]]) {
      const res = await fetch(`${base}/api/invoices?status=${status}`);
      assert.equal(res.status, 200);
      const body = await res.json();
      assert.equal(body.length, count);
      assert.ok(body.every((i) => i.status === status));
    }
  });
});

test("GET /api/invoices?status=bogus returns 400 with a JSON error body", async () => {
  await withServer(async (base) => {
    const res = await fetch(`${base}/api/invoices?status=bogus`);
    assert.equal(res.status, 400);
    assert.match(res.headers.get("content-type"), /application\/json/);
    const body = await res.json();
    assert.equal(typeof body.error, "string");
  });
});

test("GET /api/invoices/:id returns 404 for unknown id", async () => {
  await withServer(async (base) => {
    const res = await fetch(`${base}/api/invoices/4242`);
    assert.equal(res.status, 404);
  });
});

test("GET / renders an HTML table with every invoice", async () => {
  await withServer(async (base) => {
    const res = await fetch(`${base}/`);
    assert.equal(res.status, 200);
    const html = await res.text();
    assert.match(html, /<table>/);
    assert.equal((html.match(/<tr><td>/g) || []).length, 6);
  });
});

test("GET /?status=open renders a table with exactly 3 data rows", async () => {
  await withServer(async (base) => {
    const res = await fetch(`${base}/?status=open`);
    assert.equal(res.status, 200);
    const html = await res.text();
    const rows = html.match(/<tr><td>.*?<\/tr>/g) || [];
    assert.equal(rows.length, 3);
    assert.ok(rows.every((r) => /<td>open<\/td>/.test(r)));
  });
});

test("GET /?status=bogus returns 400", async () => {
  await withServer(async (base) => {
    const res = await fetch(`${base}/?status=bogus`);
    assert.equal(res.status, 400);
    assert.match(res.headers.get("content-type"), /text\/html/);
  });
});
