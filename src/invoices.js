// In-memory invoice data. Status is one of: open | paid | cancelled.
const INVOICES = [
  { id: 1001, customer: "Postal Branch Haifa", amount: 1250.0, status: "open", issued: "2026-10-01" },
  { id: 1002, customer: "Logistics Center Modiin", amount: 980.5, status: "paid", issued: "2026-10-03" },
  { id: 1003, customer: "Tel Aviv Sorting Hub", amount: 4300.0, status: "open", issued: "2026-10-07" },
  { id: 1004, customer: "Beer Sheva Branch", amount: 215.0, status: "cancelled", issued: "2026-10-09" },
  { id: 1005, customer: "Jerusalem Central", amount: 2760.25, status: "paid", issued: "2026-10-12" },
  { id: 1006, customer: "Eilat Branch", amount: 640.0, status: "open", issued: "2026-10-15" },
];

/** Returns all invoices, newest first. */
function listInvoices() {
  return [...INVOICES].sort((a, b) => (a.issued < b.issued ? 1 : -1));
}

/** Returns one invoice by id, or undefined. */
function getInvoice(id) {
  return INVOICES.find((inv) => inv.id === Number(id));
}

module.exports = { listInvoices, getInvoice };
