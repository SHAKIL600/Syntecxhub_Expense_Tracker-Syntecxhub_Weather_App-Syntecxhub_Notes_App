import { useCallback, useEffect, useMemo, useState } from "react";
import NoteComposer from "./components/NoteComposer.jsx";
import NoteCard from "./components/NoteCard.jsx";
import { createNote, loadNotes, saveNotes, searchNotes, updateNote } from "./utils/notes.js";

export default function App() {
  // useState: the list of notes, loaded once from localStorage (lazy initialiser)
  const [notes, setNotes] = useState(() => loadNotes());
  const [query, setQuery] = useState("");
  const [saveFailed, setSaveFailed] = useState(false);

  // Persist to localStorage whenever the notes change
  useEffect(() => {
    setSaveFailed(!saveNotes(notes));
  }, [notes]);

  const addNote = useCallback((draft) => setNotes((prev) => [createNote(draft), ...prev]), []);
  const saveNote = useCallback(
    (id, changes) => setNotes((prev) => prev.map((n) => (n.id === id ? updateNote(n, changes) : n))),
    []
  );
  const deleteNote = useCallback((id) => setNotes((prev) => prev.filter((n) => n.id !== id)), []);

  const visible = useMemo(() => searchNotes(notes, query), [notes, query]);

  return (
    <div className="page">
      <header className="head">
        <h1>Notes</h1>
        <p>{notes.length === 0 ? "Nothing here yet" : `${notes.length} ${notes.length === 1 ? "note" : "notes"}, saved in this browser`}</p>
      </header>

      <NoteComposer onAdd={addNote} />

      {saveFailed && (
        <p className="warn" role="alert">
          Your browser is blocking storage, so notes will be lost when you close this tab.
        </p>
      )}

      {notes.length > 0 && (
        <div className="search">
          <label className="sr-only" htmlFor="search">Search notes</label>
          <input id="search" type="search" placeholder="Search your notes…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      )}

      {notes.length === 0 ? (
        <p className="empty">Write your first note above. It stays here even after you close the page.</p>
      ) : visible.length === 0 ? (
        <p className="empty">No notes match “{query.trim()}”.</p>
      ) : (
        <ul className="grid">
          {visible.map((n) => (
            <NoteCard key={n.id} note={n} onSave={saveNote} onDelete={deleteNote} />
          ))}
        </ul>
      )}
    </div>
  );
}
