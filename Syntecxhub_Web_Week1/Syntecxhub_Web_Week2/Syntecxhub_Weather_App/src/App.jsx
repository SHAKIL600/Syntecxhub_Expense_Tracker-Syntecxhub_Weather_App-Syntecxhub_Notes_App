import { useEffect, useRef, useState } from "react";
import SearchBar from "./components/SearchBar.jsx";
import CurrentWeather from "./components/CurrentWeather.jsx";
import Forecast from "./components/Forecast.jsx";
import { WeatherError, fetchForecast, geocodeCity } from "./api/weather.js";
import { themeFor } from "./utils/weather.js";

const CITY_KEY = "syntecxhub.weather.city";
const UNIT_KEY = "syntecxhub.weather.unit";

function readSetting(key, fallback) {
  try {
    return localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
}
function writeSetting(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* ignore: settings just won't be remembered */
  }
}

export default function App() {
  // What to load: a city name typed by the user, or coordinates from the browser
  const [request, setRequest] = useState(() => ({ kind: "city", name: readSetting(CITY_KEY, "Dhaka") }));
  const [unit, setUnit] = useState(() => (readSetting(UNIT_KEY, "C") === "F" ? "F" : "C"));
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [data, setData] = useState(null); // { place, forecast }
  const [error, setError] = useState("");
  const [locating, setLocating] = useState(false);
  const inputRef = useRef(null);

  // useEffect: fetch from the external API whenever the request changes
  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setStatus("loading");
      setError("");
      try {
        const place =
          request.kind === "city" ? await geocodeCity(request.name, controller.signal) : request.place;
        const forecast = await fetchForecast(place, controller.signal);
        setData({ place, forecast });
        setStatus("ready");
        if (request.kind === "city") writeSetting(CITY_KEY, request.name);
      } catch (err) {
        if (err.name === "AbortError") return; // a newer request replaced this one
        setError(err instanceof WeatherError ? err.message : "Something went wrong. Please try again.");
        setStatus("error");
      }
    }

    load();
    return () => controller.abort(); // cancel the in-flight request on change / unmount
  }, [request]);

  // On error, send focus back to the search box so the user can fix the city name
  useEffect(() => {
    if (status === "error") inputRef.current?.focus();
  }, [status]);

  function changeUnit(next) {
    setUnit(next);
    writeSetting(UNIT_KEY, next);
  }

  function locate() {
    if (!("geolocation" in navigator)) {
      setError("Your browser doesn't support location. Search for a city instead.");
      setStatus("error");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocating(false);
        setRequest({ kind: "coords", place: { name: "Your location", country: "", lat: coords.latitude, lon: coords.longitude } });
      },
      () => {
        setLocating(false);
        setError("Location access was blocked. Allow it in your browser, or search for a city.");
        setStatus("error");
      },
      { timeout: 10000 }
    );
  }

  const current = data?.forecast.current;
  const theme = current ? themeFor(current.weather_code, current.is_day) : "cloud";
  const night = current ? current.is_day === 0 : false;

  return (
    <div className="app" data-theme={theme} data-night={night}>
      <div className="shell">
        <header className="top">
          <p className="brand">Weather</p>
          <div className="units" role="group" aria-label="Temperature unit">
            {["C", "F"].map((u) => (
              <button key={u} type="button" aria-pressed={unit === u} onClick={() => changeUnit(u)}>°{u}</button>
            ))}
          </div>
        </header>

        <SearchBar
          inputRef={inputRef}
          busy={status === "loading" || locating}
          onSearch={(name) => setRequest({ kind: "city", name })}
          onLocate={locate}
        />

        {status === "loading" && <p className="loading" role="status">Loading forecast…</p>}

        {status === "error" && (
          <div className="error" role="alert">
            <p>{error}</p>
            {request && (
              <button type="button" onClick={() => setRequest({ ...request })}>Try again</button>
            )}
          </div>
        )}

        {status === "ready" && data && (
          <>
            <CurrentWeather place={data.place} current={data.forecast.current} unit={unit} />
            <Forecast daily={data.forecast.daily} unit={unit} />
          </>
        )}

        <footer className="credit">Weather data by Open-Meteo.com</footer>
      </div>
    </div>
  );
}
