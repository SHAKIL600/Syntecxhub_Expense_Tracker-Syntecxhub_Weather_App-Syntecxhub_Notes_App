import { memo } from "react";
import { CATEGORY_COLORS, formatMoney } from "../utils/expenses.js";

function Breakdown({ summary }) {
  if (summary.byCategory.length === 0) return null;
  return (
    <section className="panel breakdown" aria-labelledby="breakdown-title">
      <h2 id="breakdown-title">Where your money goes</h2>
      <ul>
        {summary.byCategory.map(({ category, amount, share }) => (
          <li key={category}>
            <div className="breakdown-label">
              <span>{category}</span>
              <span>{formatMoney(amount)}</span>
            </div>
            <div className="bar" role="img" aria-label={`${category}: ${Math.round(share * 100)}% of spending`}>
              <i style={{ width: `${Math.max(share * 100, 2)}%`, background: CATEGORY_COLORS[category] || CATEGORY_COLORS.Other }} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default memo(Breakdown);
