import { memo } from "react";
import { CATEGORY_COLORS, formatDate, formatMoney } from "../utils/expenses.js";

// memo: an item only re-renders when its own expense (or the stable onDelete) changes
const ExpenseItem = memo(function ExpenseItem({ expense, onDelete }) {
  return (
    <li className="item">
      <span className="dot" style={{ background: CATEGORY_COLORS[expense.category] || CATEGORY_COLORS.Other }} aria-hidden="true" />
      <div className="item-main">
        <p className="item-title">{expense.title}</p>
        <p className="item-meta">{expense.category}, {formatDate(expense.date)}</p>
      </div>
      <p className="item-amount">{formatMoney(expense.amount)}</p>
      <button type="button" className="icon-btn" onClick={() => onDelete(expense.id)} aria-label={`Delete ${expense.title}`}>
        Delete
      </button>
    </li>
  );
});

function ExpenseList({ expenses, onDelete, emptyText }) {
  if (expenses.length === 0) return <p className="empty">{emptyText}</p>;
  return (
    <ul className="items">
      {expenses.map((e) => (
        <ExpenseItem key={e.id} expense={e} onDelete={onDelete} />
      ))}
    </ul>
  );
}

export default memo(ExpenseList);
