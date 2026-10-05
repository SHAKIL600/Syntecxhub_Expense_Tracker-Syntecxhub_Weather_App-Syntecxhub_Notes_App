import { useEffect, useRef, useState } from "react";
import { COLORS, isNoteEmpty } from "../utils/notes.js";

export default function NoteComposer({ onAdd }) {
  const [draft, setDraft] = useState({ title: "", body: "", color: "butter" });
  const [error, setError] = useState("");
  const bodyRef = useRef(null); // useRef: focus the main input

  // Focus on load (desktop only, so phones don't open the keyboard immediately)
  useEffect(() => {
    if (window.matchMedia("(pointer: fine)").matches) bodyRef.current?.focus();
  }, []);

  function submit(e) {
    e?.preventDefault();
    if (isNoteEmpty(draft)) {
      setError("Write a title or some text first.");
      bodyRef.current?.focus();
      return;
    }
    onAdd(draft);
    setDraft((d) => ({ ...d, title: "", body: "" }));
    setError("");
    bodyRef.current?.focus(); // ready for the next note
  }

  return (
    <form className="composer" onSubmit={submit} style={{ "--note": COLORS.find((c) => c.id === draft.color).hex }}>
      <label className="sr-only" htmlFor="new-title">Title (optional)</label>
      <input id="new-title" placeholder="Title (optional)" value={draft.title}
        onChange={(e) => setDraft({ ...draft, title: e.target.value })} maxLength={80} />
      <label className="sr-only" htmlFor="new-body">Note</label>
      <textarea id="new-body" ref={bodyRef} rows={3} placeholder="Write a note…" value={draft.body}
        aria-invalid={!!error} aria-describedby={error ? "composer-err" : undefined}
        onChange={(e) => { setDraft({ ...draft, body: e.target.value }); if (error) setError(""); }}
        onKeyDown={(e) => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) submit(e); }} />
      {error && <p className="err" id="composer-err" role="alert">{error}</p>}
      <div className="composer-bar">
        <fieldset className="swatches">
          <legend className="sr-only">Note colour</legend>
          {COLORS.map((c) => (
            <label key={c.id} title={c.label}>
              <input type="radio" name="color" value={c.id} checked={draft.color === c.id}
                onChange={() => setDraft({ ...draft, color: c.id })} />
              <span style={{ background: c.hex }}><span className="sr-only">{c.label}</span></span>
            </label>
          ))}
        </fieldset>
        <button type="submit" className="add">Add note</button>
      </div>
    </form>
  );
}
