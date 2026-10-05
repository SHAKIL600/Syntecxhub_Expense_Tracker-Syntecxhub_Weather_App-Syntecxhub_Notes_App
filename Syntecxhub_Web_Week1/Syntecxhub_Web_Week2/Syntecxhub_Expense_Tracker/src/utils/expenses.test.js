import { describe, expect, it } from "vitest";
import { filterExpenses, formatMoney, summarize, todayISO, validateExpense } from "./expenses.js";

const sample = [
  { id: "1", title: "Rice", amount: 100, category: "Food", date: "2026-10-01" },
  { id: "2", title: "Bus", amount: 50, category: "Transport", date: "2026-10-03" },
  { id: "3", title: "Fish", amount: 150.5, category: "Food", date: "2026-10-02" },
];

describe("validateExpense", () => {
  it("accepts a valid expense", () => {
    expect(validateExpense({ title: "Tea", amount: "20", date: "2026-10-05" })).toEqual({});
  });
  it("rejects empty title, bad amount and bad date", () => {
    const errors = validateExpense({ title: "  ", amount: "-5", date: "" });
    expect(Object.keys(errors).sort()).toEqual(["amount", "date", "title"]);
  });
  it("rejects zero, NaN and huge amounts", () => {
    for (const amount of ["0", "abc", "", "99999999"]) {
      expect(validateExpense({ title: "x", amount, date: "2026-10-05" }).amount).toBeTruthy();
    }
  });
});

describe("summarize", () => {
  it("totals and groups by category, largest share first", () => {
    const s = summarize(sample);
    expect(s.total).toBe(300.5);
    expect(s.count).toBe(3);
    expect(s.byCategory[0]).toMatchObject({ category: "Food", amount: 250.5 });
    expect(s.largest.id).toBe("3");
  });
  it("handles an empty list", () => {
    expect(summarize([])).toEqual({ total: 0, count: 0, byCategory: [], largest: null });
  });
});

describe("filterExpenses", () => {
  it("sorts newest first", () => {
    expect(filterExpenses(sample).map((e) => e.id)).toEqual(["2", "3", "1"]);
  });
  it("filters by category and search text", () => {
    expect(filterExpenses(sample, { category: "Food" }).map((e) => e.id)).toEqual(["3", "1"]);
    expect(filterExpenses(sample, { query: " BUS " }).map((e) => e.id)).toEqual(["2"]);
  });
});

describe("formatting", () => {
  it("formats money", () => {
    expect(formatMoney(500)).toBe("৳500");
    expect(formatMoney(1234.5)).toBe("৳1,234.50");
  });
  it("returns the local calendar date", () => {
    expect(todayISO(new Date(2026, 0, 5, 23, 30))).toBe("2026-01-05");
  });
});
