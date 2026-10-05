import { describe, expect, it } from "vitest";
import { STORAGE_KEY, createNote, isNoteEmpty, loadNotes, saveNotes, searchNotes, updateNote } from "./notes.js";

function fakeStorage(initial = {}) {
  const data = { ...initial };
  return {
    getItem: (k) => (k in data ? data[k] : null),
    setItem: (k, v) => { data[k] = v; },
    data,
  };
}

describe("createNote / updateNote", () => {
  it("trims and timestamps a new note", () => {
    const n = createNote({ title: "  Plan ", body: " Study React  " }, 1000, "a1");
    expect(n).toEqual({ id: "a1", title: "Plan", body: "Study React", color: "butter", createdAt: 1000, updatedAt: 1000 });
  });
  it("updates only the given fields and bumps updatedAt", () => {
    const n = createNote({ title: "A", body: "B", color: "sky" }, 1000, "a1");
    const u = updateNote(n, { body: "  new  " }, 2000);
    expect(u).toMatchObject({ id: "a1", title: "A", body: "new", color: "sky", createdAt: 1000, updatedAt: 2000 });
  });
});

describe("isNoteEmpty", () => {
  it("is true only when both title and body are blank", () => {
    expect(isNoteEmpty({ title: " ", body: "" })).toBe(true);
    expect(isNoteEmpty({ title: "x", body: "" })).toBe(false);
    expect(isNoteEmpty({ title: "", body: "y" })).toBe(false);
  });
});

describe("searchNotes", () => {
  const notes = [
    { id: "1", title: "Groceries", body: "milk, eggs", updatedAt: 1 },
    { id: "2", title: "Study", body: "React hooks", updatedAt: 3 },
    { id: "3", title: "Ideas", body: "Learn react router", updatedAt: 2 },
  ];
  it("returns everything newest first when the query is empty", () => {
    expect(searchNotes(notes).map((n) => n.id)).toEqual(["2", "3", "1"]);
  });
  it("matches title or body, ignoring case", () => {
    expect(searchNotes(notes, "REACT").map((n) => n.id)).toEqual(["2", "3"]);
    expect(searchNotes(notes, "grocer").map((n) => n.id)).toEqual(["1"]);
    expect(searchNotes(notes, "nothing")).toEqual([]);
  });
});

describe("localStorage persistence", () => {
  it("saves and loads notes", () => {
    const storage = fakeStorage();
    const notes = [createNote({ title: "T", body: "B" }, 1, "x")];
    expect(saveNotes(notes, storage)).toBe(true);
    expect(loadNotes(storage)).toEqual(notes);
  });
  it("returns an empty list for missing, corrupt or wrongly shaped data", () => {
    expect(loadNotes(fakeStorage())).toEqual([]);
    expect(loadNotes(fakeStorage({ [STORAGE_KEY]: "{oops" }))).toEqual([]);
    expect(loadNotes(fakeStorage({ [STORAGE_KEY]: '{"a":1}' }))).toEqual([]);
  });
  it("drops malformed entries but keeps valid ones", () => {
    const raw = JSON.stringify([{ id: "1", title: "ok", body: "fine", updatedAt: 5 }, { id: 2 }, null]);
    expect(loadNotes(fakeStorage({ [STORAGE_KEY]: raw }))).toHaveLength(1);
  });
  it("reports failure when storage throws", () => {
    const broken = { setItem: () => { throw new Error("quota"); } };
    expect(saveNotes([], broken)).toBe(false);
  });
});
