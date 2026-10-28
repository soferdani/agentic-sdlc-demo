const http = require("node:http");
const { STATUSES, listInvoices, getInvoice } = require("./invoices");

const PORT = process.env.PORT || 3000;

function json(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

function errorPage(message) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Bad request</title></head>
<body><h1>Bad request</h1><p>${escapeHtml(message)}</p><p><a href="/">Back to all invoices</a></p></body></html>`;
}

/** Plain-link status picker: All | Open | Paid | Cancelled, with the active one marked. */
function picker(active) {
  const links = [["", "All", "/"], ...STATUSES.map((s) => [s, s[0].toUpperCase() + s.slice(1), `/?status=${s}`])];
  return `<nav class="picker">${links
    .map(([value, label, href]) =>
      value === active ? `<strong aria-current="page">${label}</strong>` : `<a href="${href}">${label}</a>`
    )
    .join(" | ")}</nav>`;
}

function page(invoices, active = "") {
  const rows = invoices
    .map(
      (i) =>
        `<tr><td>${i.id}</td><td>${i.customer}</td><td>${i.amount.toFixed(2)}</td><td>${i.status}</td><td>${i.issued}</td></tr>`
    )
    .join("");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Invoices</title>
<style>body{font-family:Arial,sans-serif;margin:2rem}table{border-collapse:collapse}td,th{border:1px solid #ccc;padding:.4rem .8rem}th{background:#f5f7f8;text-align:left}</style>
</head><body><h1>Invoices</h1>
${picker(active)}
<table><thead><tr><th>ID</th><th>Customer</th><th>Amount</th><th>Status</th><th>Issued</th></tr></thead><tbody>${rows}</tbody></table>
</body></html>`;
}

/** Request handler, exported so tests can call it without binding a port. */
function handle(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

  if (req.method === "GET" && url.pathname === "/api/invoices") {
    try {
      return json(res, 200, listInvoices({ status: url.searchParams.get("status") }));
    } catch (err) {
      return json(res, 400, { error: err.message });
    }
  }

  const one = url.pathname.match(/^\/api\/invoices\/(\d+)$/);
  if (req.method === "GET" && one) {
    const inv = getInvoice(one[1]);
    return inv ? json(res, 200, inv) : json(res, 404, { error: "not found" });
  }

  if (req.method === "GET" && url.pathname === "/") {
    const status = (url.searchParams.get("status") || "").trim().toLowerCase();
    let invoices;
    try {
      invoices = listInvoices({ status });
    } catch (err) {
      res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
      return res.end(errorPage(err.message));
    }
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    return res.end(page(invoices, status));
  }

  json(res, 404, { error: "not found" });
}

if (require.main === module) {
  http.createServer(handle).listen(PORT, () => {
    console.log(`Invoices demo listening on http://localhost:${PORT}`);
  });
}

module.exports = { handle };
