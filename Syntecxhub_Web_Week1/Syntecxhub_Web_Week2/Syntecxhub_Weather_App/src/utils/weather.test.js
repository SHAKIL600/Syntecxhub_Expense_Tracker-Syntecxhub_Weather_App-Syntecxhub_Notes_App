import { describe, expect, it } from "vitest";
import { buildDaily, cToF, dayLabel, describeWeather, formatTemp, formatWind, themeFor } from "./weather.js";

describe("describeWeather / themeFor", () => {
  it("maps known codes", () => {
    expect(describeWeather(0)).toMatchObject({ label: "Clear sky", theme: "clear" });
    expect(describeWeather(65)).toMatchObject({ label: "Heavy rain", theme: "rain" });
    expect(describeWeather(95).theme).toBe("storm");
  });
  it("falls back for unknown codes", () => {
    expect(describeWeather(1234).label).toBe("Unknown conditions");
  });
  it("uses the night theme only for clear skies after dark", () => {
    expect(themeFor(0, 0)).toBe("night");
    expect(themeFor(0, 1)).toBe("clear");
    expect(themeFor(63, 0)).toBe("rain");
  });
});

describe("unit conversion", () => {
  it("converts Celsius to Fahrenheit", () => {
    expect(cToF(0)).toBe(32);
    expect(cToF(100)).toBe(212);
  });
  it("formats temperature and wind in both units", () => {
    expect(formatTemp(30.4, "C")).toBe("30°");
    expect(formatTemp(30, "F")).toBe("86°");
    expect(formatTemp(-0.2, "C")).toBe("0°");
    expect(formatWind(16.09344, "C")).toBe("16 km/h");
    expect(formatWind(16.09344, "F")).toBe("10 mph");
  });
});

describe("daily forecast helpers", () => {
  it("labels days", () => {
    expect(dayLabel("2026-10-05", 0)).toBe("Today");
    expect(dayLabel("2026-10-06", 1)).toBe("Tue");
  });
  it("builds one object per day", () => {
    const days = buildDaily({
      time: ["2026-10-05", "2026-10-06"],
      weather_code: [0, 63],
      temperature_2m_max: [33, 30],
      temperature_2m_min: [26, 25],
      precipitation_probability_max: [5, 80],
    });
    expect(days).toHaveLength(2);
    expect(days[1]).toEqual({ date: "2026-10-06", code: 63, max: 30, min: 25, rain: 80 });
    expect(buildDaily(undefined)).toEqual([]);
  });
});
