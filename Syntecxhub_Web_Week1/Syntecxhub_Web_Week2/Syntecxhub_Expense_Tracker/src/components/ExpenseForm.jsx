import { memo, useEffect, useRef, useState } from "react";
import { CATEGORIES, todayISO, validateExpense } from "../utils/expenses.js";

function ExpenseForm({ onAdd }) {
  // useState: controlled form inputs + validation errors
  const [form, setForm] = useState(() => ({ title: "", amount: "", category: CATEGORIES[0], date: todayISO() }));
  const [errors, setErrors] = useState({});

  // useRef: direct access to the inputs for focus management
  const titleRef = useRef(null);
  const amountRef = useRef(null);
  const dateRef = useRef(null);
  const fieldRefs = { title: titleRef, amount: amountRef, date: dateRef };

  // Focus the first field on load (desktop only, so phones don't pop the keyboard open)
  useEffect(() => {
    if (window.matchMedia("(pointer: fine)").matches) titleRef.current?.focus();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const found = validateExpense(form);
    const firstInvalid = ["title", "amount", "date"].find((k) => found[k]);
    if (firstInvalid) {
      setErrors(found);
      fieldRefs[firstInvalid].current?.focus(); // send the user straight to the problem
      return;
    }
    onAdd({ title: form.title.trim(), amount: Number(form.amount), category: form.category, date: form.date });
    setForm((f) => ({ ...f, title: "", amount: "" }));
    setErrors({});
    titleRef.current?.focus(); // ready for the next entry
  }

  return (
    <form className="panel form" onSubmit={handleSubmit} noValidate>
      <h2>Add an expense</h2>

      <div className="field">
        <label htmlFor="title">What did you spend on?</label>
        <input id="title" name="title" ref={titleRef} value={form.title} onChange={handleChange}
          placeholder="e.g. Lunch" maxLength={80} aria-invalid={!!errors.title} aria-describedby={errors.title ? "title-err" : undefined} />
        {errors.title && <p className="err" id="title-err">{errors.title}</p>}
      </div>

      <div className="row">
        <div className="field">
          <label htmlFor="amount">Amount (৳)</label>
          <input id="amount" name="amount" ref={amountRef} type="number" inputMode="decimal" min="0" step="0.01"
            value={form.amount} onChange={handleChange} placeholder="0" aria-invalid={!!errors.amount}
            aria-describedby={errors.amount ? "amount-err" : undefined} />
          {errors.amount && <p className="err" id="amount-err">{errors.amount}</p>}
        </div>
        <div className="field">
          <label htmlFor="date">Date</label>
          <input id="date" name="date" ref={dateRef} type="date" value={form.date} onChange={handleChange}
            aria-invalid={!!errors.date} aria-describedby={errors.date ? "date-err" : undefined} />
          {errors.date && <p className="err" id="date-err">{errors.date}</p>}
        </div>
      </div>

      <div className="field">
        <label htmlFor="category">Category</label>
        <select id="category" name="category" value={form.category} onChange={handleChange}>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      <button type="submit" className="primary">Add expense</button>
    </form>
  );
}

export default memo(ExpenseForm);
