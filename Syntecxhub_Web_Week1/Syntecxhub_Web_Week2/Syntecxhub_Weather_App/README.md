# Syntecxhub Weather App

Project 2 of the **Syntecxhub Web Development Internship (Week 1 task)**.
A weather forecasting app built with **React 18 + Vite**, using the free [Open-Meteo](https://open-meteo.com) API (no API key needed).

## Features
- Search any city, or tap **Use my location**
- Current conditions: temperature, feels-like, humidity, wind
- **7-day forecast** with highs, lows and chance of rain
- **°C / °F toggle** (remembered between visits, as is your last city)
- The whole page changes colour with the sky (clear, night, cloudy, fog, rain, snow, storm)
- **Error handling** for every API failure: city not found, offline, rate limit, server error, bad response, blocked location. Each shows a clear message and a retry button
- Loading state, in-flight requests are cancelled when a new search starts
- Responsive and keyboard accessible

## Concepts demonstrated
- `useEffect` fetching from an external API, with `AbortController` cleanup
- `useState` for request, data, status, error and unit
- `useRef` to focus the search box when an error occurs
- Two chained API calls (geocoding, then forecast) with `async/await` and `try/catch`
- Pure helper functions with unit tests (`src/utils/weather.js`)
- Plain CSS with custom properties for theming

## Getting started
Requires **Node.js 18+** and an internet connection (for the weather API).
```bash
npm install
npm run dev        # http://localhost:5173
npm test           # unit tests (Vitest)
npm run build      # production build in /dist
```

## Project structure
```
src/api/weather.js            geocoding + forecast requests, friendly errors
src/components/               SearchBar, CurrentWeather, Forecast
src/utils/weather.js          weather codes, unit conversion, formatting + tests
src/App.jsx                   state, effects and layout
```
