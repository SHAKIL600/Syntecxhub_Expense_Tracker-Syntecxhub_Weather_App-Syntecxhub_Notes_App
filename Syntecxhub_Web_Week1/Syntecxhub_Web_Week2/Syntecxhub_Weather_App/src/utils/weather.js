// Open-Meteo "WMO weather codes" -> [label, icon, theme]
const WEATHER_CODES = {
  0: ["Clear sky", "☀️", "clear"],
  1: ["Mostly clear", "🌤️", "clear"],
  2: ["Partly cloudy", "⛅", "cloud"],
  3: ["Overcast", "☁️", "cloud"],
  45: ["Fog", "🌫️", "fog"],
  48: ["Freezing fog", "🌫️", "fog"],
  51: ["Light drizzle", "🌦️", "rain"],
  53: ["Drizzle", "🌦️", "rain"],
  55: ["Heavy drizzle", "🌧️", "rain"],
  56: ["Freezing drizzle", "🌧️", "rain"],
  57: ["Heavy freezing drizzle", "🌧️", "rain"],
  61: ["Light rain", "🌦️", "rain"],
  63: ["Rain", "🌧️", "rain"],
  65: ["Heavy rain", "🌧️", "rain"],
  66: ["Freezing rain", "🌧️", "rain"],
  67: ["Heavy freezing rain", "🌧️", "rain"],
  71: ["Light snow", "🌨️", "snow"],
  73: ["Snow", "🌨️", "snow"],
  75: ["Heavy snow", "❄️", "snow"],
  77: ["Snow grains", "🌨️", "snow"],
  80: ["Light showers", "🌦️", "rain"],
  81: ["Showers", "🌧️", "rain"],
  82: ["Violent showers", "🌧️", "rain"],
  85: ["Snow showers", "🌨️", "snow"],
  86: ["Heavy snow showers", "❄️", "snow"],
  95: ["Thunderstorm", "⛈️", "storm"],
  96: ["Thunderstorm with hail", "⛈️", "storm"],
  99: ["Severe thunderstorm with hail", "⛈️", "storm"],
};

export function describeWeather(code) {
  const entry = WEATHER_CODES[code];
  return entry
    ? { label: entry[0], icon: entry[1], theme: entry[2] }
    : { label: "Unknown conditions", icon: "🌡️", theme: "cloud" };
}

/** The visual theme for the whole page. Clear skies at night get their own look. */
export function themeFor(code, isDay) {
  const { theme } = describeWeather(code);
  return theme === "clear" && !isDay ? "night" : theme;
}

export const cToF = (c) => (c * 9) / 5 + 32;
export const kmhToMph = (kmh) => kmh / 1.609344;

export function formatTemp(celsius, unit) {
  const value = unit === "F" ? cToF(celsius) : celsius;
  return `${Math.round(value)}°`;
}

export function formatWind(kmh, unit) {
  return unit === "F" ? `${Math.round(kmhToMph(kmh))} mph` : `${Math.round(kmh)} km/h`;
}

export function dayLabel(isoDate, index) {
  if (index === 0) return "Today";
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString("en-US", { weekday: "short" });
}

/** Turn Open-Meteo's column-style arrays into one object per day. */
export function buildDaily(daily) {
  if (!daily?.time) return [];
  return daily.time.map((date, i) => ({
    date,
    code: daily.weather_code[i],
    max: daily.temperature_2m_max[i],
    min: daily.temperature_2m_min[i],
    rain: daily.precipitation_probability_max?.[i] ?? null,
  }));
}
