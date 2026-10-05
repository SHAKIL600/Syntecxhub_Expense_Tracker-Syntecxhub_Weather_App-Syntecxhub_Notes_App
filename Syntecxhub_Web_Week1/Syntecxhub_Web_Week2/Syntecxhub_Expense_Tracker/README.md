# Syntecxhub Expense Tracker

Project 1 of the **Syntecxhub Web Development Internship (Week 1 task)**.
A responsive expense tracker built with **React 18 + Vite**, practising the core React hooks.

## Features
- Add and delete expenses (title, amount in ৳, category, date) with form validation
- Live total, biggest expense and a **spending-by-category** breakdown
- Search by title and filter by category
- Data loaded from a **mock API** with loading, error and retry states
- Changes are saved, so they survive a page refresh ("Reset demo data" restores the seed list)
- Fully responsive (phone to desktop), keyboard accessible, respects reduced-motion

## React hooks used (as required by the task)
| Hook | Where / why |
|---|---|
| `useState` | Form inputs and errors (`ExpenseForm`), expenses list, filters and load status (`App`) |
| `useEffect` | Fetch expenses from the mock API with `AbortController` cleanup; save changes back to the mock store |
| `useRef` | Focus management: focus the title after adding, and jump to the first invalid field on error |
| `useMemo` | Totals, category breakdown and filtered list are only recomputed when their inputs change |
| `useCallback` | `addExpense`, `deleteExpense`, `resetDemo` keep stable identities so `React.memo` children don't re-render |

## Getting started
Requires **Node.js 18+**.
```bash
npm install
npm run dev        # http://localhost:5173
npm test           # unit tests for the helper functions (Vitest)
npm run build      # production build in /dist
```

## Mock API
`src/api/expensesApi.js` simulates a REST API: it waits 600 ms, then returns saved data, or on first visit
fetches `public/mock-expenses.json` over HTTP. Replace `fetchExpenses` / `saveExpenses` with real `fetch()` calls
to connect a real backend (e.g. json-server or MockAPI).

## Project structure
```
public/mock-expenses.json     seed data served as the mock API
src/api/expensesApi.js        mock API layer
src/components/               ExpenseForm, ExpenseList, Breakdown
src/utils/expenses.js         pure helpers (validation, filtering, totals) + tests
src/App.jsx                   state, effects and layout
```
