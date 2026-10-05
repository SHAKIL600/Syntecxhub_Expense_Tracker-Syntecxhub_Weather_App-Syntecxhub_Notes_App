import { useState } from "react";

export default function SearchBar({ inputRef, onSearch, onLocate, busy }) {
  const [value, setValue] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const name = value.trim();
    if (!name) {
      inputRef.current?.focus();
      return;
    }
    onSearch(name);
  }

  return (
    <form className="search" onSubmit={handleSubmit} role="search">
      <label className="sr-only" htmlFor="city">City name</label>
      <input id="city" ref={inputRef} value={value} onChange={(e) => setValue(e.target.value)}
        placeholder="Search a city, e.g. Chattogram" autoComplete="off" />
      <button type="submit" className="solid" disabled={busy}>Search</button>
      <button type="button" className="ghost" onClick={onLocate} disabled={busy}>Use my location</button>
    </form>
  );
}
