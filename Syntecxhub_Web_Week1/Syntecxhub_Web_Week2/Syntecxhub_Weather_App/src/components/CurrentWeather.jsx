import { describeWeather, formatTemp, formatWind } from "../utils/weather.js";

export default function CurrentWeather({ place, current, unit }) {
  const { label, icon } = describeWeather(current.weather_code);
  const placeName = place.country ? `${place.name}, ${place.country}` : place.name;
  return (
    <section className="now" aria-label={`Current weather in ${placeName}`}>
      <h2 className="place">{placeName}</h2>
      <p className="temp" aria-label={`${formatTemp(current.temperature_2m, unit)} degrees ${unit === "F" ? "Fahrenheit" : "Celsius"}`}>
        {formatTemp(current.temperature_2m, unit)}
        <span>{unit}</span>
      </p>
      <p className="condition"><span aria-hidden="true">{icon}</span> {label}</p>
      <dl className="facts">
        <div><dt>Feels like</dt><dd>{formatTemp(current.apparent_temperature, unit)}</dd></div>
        <div><dt>Humidity</dt><dd>{Math.round(current.relative_humidity_2m)}%</dd></div>
        <div><dt>Wind</dt><dd>{formatWind(current.wind_speed_10m, unit)}</dd></div>
      </dl>
    </section>
  );
}
