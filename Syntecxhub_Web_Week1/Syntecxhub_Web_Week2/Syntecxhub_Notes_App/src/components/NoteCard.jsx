import { memo, useEffect, useRef, useState } from "react";
import { COLORS, colorHex, formatStamp, isNoteEmpty } from "../utils/notes.js";

function NoteCard({ note, onSave, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(note);
  const [confirming, setConfirming] = useState(false);
  const bodyRef = useRef(null);

  // When edit mode opens, focus the text and put the cursor at the end
  useEffect(() => {
    if (editing && bodyRef.current) {
      const el = bodyRef.current;
      el.focus();
      el.setSelectionRange(el.value.length, el.value.length);
    }
  }, [editing]);

  function startEdit() {
    setDraft(note);
    setConfirming(false);
    setEditing(true);
  }

  function save(e) {
    e.preventDefault();
    if (isNoteEmpty(draft)) return;
    onSave(note.id, { title: draft.title, body: draft.body, color: draft.color });
    setEditing(false);
  }

  const style = { "--note": colorHex(editing ? draft.color : note.color) };

  if (editing) {
    return (
      <li className="note editing" style={style}>
        <form onSubmit={save} onKeyDown={(e) => e.key === "Escape" && setEditing(false)}>
          <label className="sr-only" htmlFor={`t-${note.id}`}>Title</label>
          <input id={`t-${note.id}`} value={draft.title} placeholder="Title (optional)" maxLength={80}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
          <label className="sr-only" htmlFor={`b-${note.id}`}>Note</label>
          <textarea id={`b-${note.id}`} ref={bodyRef} rows={5} value={draft.body}
            onChange={(e) => setDraft({ ...draft, body: e.target.value })} />
          <div className="swatches small" role="radiogroup" aria-label="Note colour">
            {COLORS.map((c) => (
              <label key={c.id} title={c.label}>
                <input type="radio" name={`c-${note.id}`} checked={draft.color === c.id} onChange={() => setDraft({ ...draft, color: c.id })} />
                <span style={{ background: c.hex }}><span className="sr-only">{c.label}</span></span>
              </label>
            ))}
          </div>
          <div className="actions">
            <button type="submit" className="solid" disabled={isNoteEmpty(draft)}>Save changes</button>
            <button type="button" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className="note" style={style}>
      {note.title && <h3>{note.title}</h3>}
      {note.body && <p className="body">{note.body}</p>}
      <p className="stamp">
        {note.updatedAt !== note.createdAt ? "Edited " : ""}{formatStamp(note.updatedAt)}
      </p>
      {confirming ? (
        <div className="actions" role="group" aria-label="Confirm delete">
          <span className="confirm">Delete this note?</span>
          <button type="button" className="danger" onClick={() => onDelete(note.id)}>Delete</button>
          <button type="button" onClick={() => setConfirming(false)}>Keep</button>
        </div>
      ) : (
        <div className="actions">
          <button type="button" onClick={startEdit} aria-label={`Edit note${note.title ? `: ${note.title}` : ""}`}>Edit</button>
          <button type="button" onClick={() => setConfirming(true)} aria-label={`Delete note${note.title ? `: ${note.title}` : ""}`}>Delete</button>
        </div>
      )}
    </li>
  );
}

export default memo(NoteCard);
