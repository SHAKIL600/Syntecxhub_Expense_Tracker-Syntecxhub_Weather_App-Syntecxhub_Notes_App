/**
 * Open-Meteo API (https://open-meteo.com) - free, no API key required.
 *  1. Geocoding: city name -> latitude / longitude
 *  2. Forecast : latitude / longitude -> current conditions + daily forecast
 * Temperatures are requested in Celsius; the UI converts to Fahrenheit on demand.
 */
const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

/** Errors whose message is safe and helpful to show to the user. */
export class WeatherError extends Error {}

async function getJson(url, signal) {
  let res;
  try {
    res = await fetch(url, { signal });
  } catch (err) {
    if (err.name === "AbortError") throw err;
    throw new WeatherError("Can't reach the weather service. Check your internet connection and try again.");
  }
  if (!res.ok) {
    throw new WeatherError(
      res.status === 429
        ? "Too many requests. Wait a minute, then try again."
        : `The weather service returned an error (${res.status}). Try again shortly.`
    );
  }
  try {
    return await res.json();
  } catch {
    throw new WeatherError("The weather service sent an unreadable response. Try again.");
  }
}

export async function geocodeCity(name, signal) {
  const params = new URLSearchParams({ name, count: "1", language: "en", format: "json" });
  const data = await getJson(`${GEOCODING_URL}?${params}`, signal);
  const hit = data.results?.[0];
  if (!hit) throw new WeatherError(`No city found for "${name}". Check the spelling or try a nearby city.`);
  return { name: hit.name, country: hit.country || "", lat: hit.latitude, lon: hit.longitude };
}

export async function fetchForecast({ lat, lon }, signal) {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: "temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code,is_day",
    daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
    timezone: "auto",
    forecast_days: "7",
  });
  const data = await getJson(`${FORECAST_URL}?${params}`, signal);
  if (!data.current || !data.daily) throw new WeatherError("The forecast data was incomplete. Try again.");
  return data;
}
