export const CATEGORIES = ["Food", "Transport", "Bills", "Shopping", "Health", "Education", "Other"];

export const CATEGORY_COLORS = {
  Food: "#E8833A",
  Transport: "#2F80ED",
  Bills: "#7B61FF",
  Shopping: "#E04F7A",
  Health: "#27AE7A",
  Education: "#D99A00",
  Other: "#7C8A9A",
};

export function formatMoney(value) {
  const n = Number(value) || 0;
  return `৳${n.toLocaleString("en-US", {
    minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatDate(iso) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Today's date as YYYY-MM-DD in the user's local time zone. */
export function todayISO(now = new Date()) {
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

export function makeId() {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

/** Returns an object of field -> message. Empty object means valid. */
export function validateExpense({ title, amount, date }) {
  const errors = {};
  if (!title || !title.trim()) errors.title = "Enter what you spent money on.";
  else if (title.trim().length > 60) errors.title = "Keep the title under 60 characters.";

  const n = Number(amount);
  if (amount === "" || amount == null || !Number.isFinite(n) || n <= 0) {
    errors.amount = "Enter an amount greater than 0.";
  } else if (n > 10_000_000) {
    errors.amount = "That amount looks too large.";
  }

  if (!date || Number.isNaN(Date.parse(date))) errors.date = "Pick a valid date.";
  return errors;
}

/** Filter by category and title search, newest first. */
export function filterExpenses(expenses, { category = "All", query = "" } = {}) {
  const q = query.trim().toLowerCase();
  return expenses
    .filter((e) => (category === "All" || e.category === category) && (!q || e.title.toLowerCase().includes(q)))
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function summarize(expenses) {
  const total = Math.round(expenses.reduce((sum, e) => sum + e.amount, 0) * 100) / 100;
  const totals = new Map();
  for (const e of expenses) totals.set(e.category, (totals.get(e.category) || 0) + e.amount);
  const byCategory = [...totals.entries()]
    .map(([category, amount]) => ({ category, amount, share: total ? amount / total : 0 }))
    .sort((a, b) => b.amount - a.amount);
  const largest = expenses.reduce((max, e) => (!max || e.amount > max.amount ? e : max), null);
  return { total, count: expenses.length, byCategory, largest };
}
