/**
 * Mock API.
 * - GET: simulates network latency, then returns saved expenses. On the very first
 *   visit it fetches the seed file `public/mock-expenses.json` over HTTP.
 * - "POST/PUT": saveExpenses() stores the list in localStorage (our fake database).
 * Swap these two functions for real fetch() calls to plug in a real backend.
 */
const STORAGE_KEY = "syntecxhub.expenses.v1";
const LATENCY_MS = 600;

function sleep(ms, signal) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });
}

function readStore() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export async function fetchExpenses(signal) {
  await sleep(LATENCY_MS, signal);
  const stored = readStore();
  if (stored) return stored;
  try {
    const res = await fetch(`${import.meta.env.BASE_URL}mock-expenses.json`, { signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error("bad format");
    return data;
  } catch (err) {
    if (err.name === "AbortError") throw err;
    throw new Error("Could not load your expenses. Check your connection and try again.");
  }
}

export function saveExpenses(expenses) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  } catch {
    /* storage unavailable (private mode / full) - app still works for this session */
  }
}

export function resetExpenses() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
