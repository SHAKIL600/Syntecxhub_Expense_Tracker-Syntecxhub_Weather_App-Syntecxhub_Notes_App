export const STORAGE_KEY = "syntecxhub.notes.v1";

export const COLORS = [
  { id: "butter", label: "Yellow", hex: "#F3C94B" },
  { id: "mint", label: "Green", hex: "#6CC4A1" },
  { id: "sky", label: "Blue", hex: "#6FB3EA" },
  { id: "rose", label: "Pink", hex: "#EE8FA6" },
  { id: "lilac", label: "Purple", hex: "#A590E6" },
];

export const colorHex = (id) => (COLORS.find((c) => c.id === id) || COLORS[0]).hex;

export function makeId() {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

/** A note needs at least a title or some text. */
export function isNoteEmpty({ title = "", body = "" }) {
  return !title.trim() && !body.trim();
}

export function createNote({ title = "", body = "", color = "butter" }, now = Date.now(), id = makeId()) {
  return { id, title: title.trim(), body: body.trim(), color, createdAt: now, updatedAt: now };
}

export function updateNote(note, { title, body, color }, now = Date.now()) {
  return {
    ...note,
    title: (title ?? note.title).trim(),
    body: (body ?? note.body).trim(),
    color: color ?? note.color,
    updatedAt: now,
  };
}

/** Case-insensitive search in title and body; most recently edited first. */
export function searchNotes(notes, query = "") {
  const q = query.trim().toLowerCase();
  return notes
    .filter((n) => !q || n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q))
    .slice()
    .sort((a, b) => b.updatedAt - a.updatedAt);
}

export function formatStamp(ts) {
  return new Date(ts).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
}

const isValidNote = (n) =>
  n && typeof n.id === "string" && typeof n.body === "string" && typeof n.title === "string" && Number.isFinite(n.updatedAt);

/** Read notes from storage. Anything missing, corrupt or malformed becomes an empty list. */
export function loadNotes(storage = globalThis.localStorage) {
  try {
    const parsed = JSON.parse(storage.getItem(STORAGE_KEY));
    return Array.isArray(parsed) ? parsed.filter(isValidNote) : [];
  } catch {
    return [];
  }
}

/** Returns true if saved, false if storage is unavailable or full. */
export function saveNotes(notes, storage = globalThis.localStorage) {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(notes));
    return true;
  } catch {
    return false;
  }
}
