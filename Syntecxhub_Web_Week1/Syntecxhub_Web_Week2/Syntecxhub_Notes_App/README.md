# Syntecxhub Notes App

Project 3 of the **Syntecxhub Web Development Internship (Week 1 task)**.
A notes app built with **React 18 + Vite** where you can add, edit and delete notes that are saved in the browser.

## Features
- **Add** notes (title optional, text required, or the other way round) with a colour label
- **Edit in place** (Save / Cancel / Esc) and **delete with a confirm step**
- Notes **persist in `localStorage`**, so they survive refreshes and restarts
- Search across titles and text; most recently edited notes come first
- Shortcut: **Ctrl/Cmd + Enter** adds the note
- Safe against bad data: corrupt or malformed storage is ignored instead of crashing the app, and a warning shows if the browser blocks storage
- Responsive masonry layout, keyboard accessible

## Concepts demonstrated
| Concept | Where |
|---|---|
| `useState` | The notes list (lazy-initialised from storage), search query, composer draft, edit/confirm state |
| `useRef` | Focus the input on load and after adding; focus the text (cursor at end) when editing starts; focus the field on a validation error |
| `localStorage` | `loadNotes` / `saveNotes` in `src/utils/notes.js`, saved from a `useEffect` whenever notes change |
| `useEffect`, `useMemo`, `useCallback`, `React.memo` | Persistence, filtered list, stable handlers, cards that only re-render when they change |

## Getting started
Requires **Node.js 18+**.
```bash
npm install
npm run dev        # http://localhost:5173
npm test           # unit tests for the note helpers (Vitest)
npm run build      # production build in /dist
```

## Project structure
```
src/components/NoteComposer.jsx   new-note form
src/components/NoteCard.jsx       view / edit / delete a note
src/utils/notes.js                create, update, search, load/save + tests
src/App.jsx                       state, persistence and layout
```
