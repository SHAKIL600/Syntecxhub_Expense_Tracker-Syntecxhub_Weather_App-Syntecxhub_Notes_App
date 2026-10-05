import { buildDaily, dayLabel, describeWeather, formatTemp } from "../utils/weather.js";

export default function Forecast({ daily, unit }) {
  const days = buildDaily(daily);
  return (
    <section aria-labelledby="forecast-title">
      <h2 id="forecast-title" className="forecast-title">7-day forecast</h2>
      <ul className="forecast">
        {days.map((d, i) => {
          const { label, icon } = describeWeather(d.code);
          return (
            <li key={d.date}>
              <span className="f-day">{dayLabel(d.date, i)}</span>
              <span className="f-icon" role="img" aria-label={label}>{icon}</span>
              <span className="f-rain">{d.rain != null ? `${d.rain}% rain` : ""}</span>
              <span className="f-temps">
                <strong>{formatTemp(d.max, unit)}</strong>
                <span>{formatTemp(d.min, unit)}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
