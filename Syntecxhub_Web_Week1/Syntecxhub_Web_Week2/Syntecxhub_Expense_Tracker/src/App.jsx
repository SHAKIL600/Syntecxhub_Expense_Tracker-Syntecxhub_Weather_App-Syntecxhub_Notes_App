import { useCallback, useEffect, useMemo, useState } from "react";
import ExpenseForm from "./components/ExpenseForm.jsx";
import ExpenseList from "./components/ExpenseList.jsx";
import Breakdown from "./components/Breakdown.jsx";
import { fetchExpenses, resetExpenses, saveExpenses } from "./api/expensesApi.js";
import { CATEGORIES, filterExpenses, formatMoney, makeId, summarize } from "./utils/expenses.js";

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [filter, setFilter] = useState({ category: "All", query: "" });

  // useEffect: fetch data from the mock API (and cancel if the component unmounts)
  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");
    fetchExpenses(controller.signal)
      .then((data) => {
        setExpenses(data);
        setStatus("ready");
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError(err.message);
        setStatus("error");
      });
    return () => controller.abort();
  }, [reloadKey]);

  // useEffect: save every change back to the mock "database"
  useEffect(() => {
    if (status === "ready") saveExpenses(expenses);
  }, [expenses, status]);

  // useCallback: stable function identities so memoised children don't re-render needlessly
  const addExpense = useCallback((data) => {
    setExpenses((prev) => [{ id: makeId(), ...data }, ...prev]);
  }, []);

  const deleteExpense = useCallback((id) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const resetDemo = useCallback(() => {
    resetExpenses();
    setReloadKey((k) => k + 1);
  }, []);

  // useMemo: only recompute totals / filtered list when their inputs change
  const summary = useMemo(() => summarize(expenses), [expenses]);
  const visible = useMemo(() => filterExpenses(expenses, filter), [expenses, filter]);
  const visibleTotal = useMemo(() => visible.reduce((sum, e) => sum + e.amount, 0), [visible]);

  return (
    <>
      <header className="hero">
        <div className="hero-inner">
          <div>
            <h1>Expense Tracker</h1>
            <p className="total" aria-live="polite">
              {status === "ready" ? formatMoney(summary.total) : "৳–"}
              <small>spent across {summary.count} {summary.count === 1 ? "expense" : "expenses"}</small>
            </p>
          </div>
          {status === "ready" && summary.largest && (
            <dl className="hero-stat">
              <dt>Biggest expense</dt>
              <dd>{formatMoney(summary.largest.amount)}</dd>
              <dd className="hero-stat-note">{summary.largest.title}</dd>
            </dl>
          )}
        </div>
      </header>

      <main>
        <div className="side">
          <ExpenseForm onAdd={addExpense} />
          {status === "ready" && <Breakdown summary={summary} />}
        </div>

        <section className="panel list-panel" aria-labelledby="list-title">
          <div className="list-head">
            <h2 id="list-title">Your expenses</h2>
            <div className="filters">
              <label className="sr-only" htmlFor="search">Search expenses</label>
              <input
                id="search"
                type="search"
                placeholder="Search…"
                value={filter.query}
                onChange={(e) => setFilter((f) => ({ ...f, query: e.target.value }))}
              />
              <label className="sr-only" htmlFor="category-filter">Filter by category</label>
              <select
                id="category-filter"
                value={filter.category}
                onChange={(e) => setFilter((f) => ({ ...f, category: e.target.value }))}
              >
                <option value="All">All categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {status === "loading" && (
            <ul className="skeleton" aria-busy="true" aria-label="Loading expenses">
              {[0, 1, 2, 3].map((i) => <li key={i} />)}
            </ul>
          )}

          {status === "error" && (
            <div className="notice error" role="alert">
              <p>{error}</p>
              <button type="button" onClick={() => setReloadKey((k) => k + 1)}>Try again</button>
            </div>
          )}

          {status === "ready" && (
            <>
              <ExpenseList
                expenses={visible}
                onDelete={deleteExpense}
                emptyText={expenses.length ? "No expenses match your search." : "No expenses yet. Add your first one on the left."}
              />
              {visible.length > 0 && (
                <p className="list-foot">
                  Showing {visible.length} of {expenses.length} · {formatMoney(visibleTotal)}
                  <button type="button" className="link" onClick={resetDemo}>Reset demo data</button>
                </p>
              )}
            </>
          )}
        </section>
      </main>
    </>
  );
}
