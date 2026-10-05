import { afterEach, describe, expect, it, vi } from "vitest";
import { WeatherError, fetchForecast, geocodeCity } from "./weather.js";

const ok = (body) => Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(body) });
afterEach(() => vi.unstubAllGlobals());

describe("geocodeCity", () => {
  it("returns the first match", async () => {
    vi.stubGlobal("fetch", vi.fn(() => ok({ results: [{ name: "Dhaka", country: "Bangladesh", latitude: 23.7, longitude: 90.4 }] })));
    expect(await geocodeCity("Dhaka")).toEqual({ name: "Dhaka", country: "Bangladesh", lat: 23.7, lon: 90.4 });
  });
  it("explains when no city is found", async () => {
    vi.stubGlobal("fetch", vi.fn(() => ok({})));
    await expect(geocodeCity("Zzzzz")).rejects.toThrow(/No city found/);
  });
  it("explains network failures", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.reject(new TypeError("Failed to fetch"))));
    await expect(geocodeCity("Dhaka")).rejects.toBeInstanceOf(WeatherError);
  });
  it("explains HTTP errors, including rate limits", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.resolve({ ok: false, status: 429 })));
    await expect(geocodeCity("Dhaka")).rejects.toThrow(/Too many requests/);
    vi.stubGlobal("fetch", vi.fn(() => Promise.resolve({ ok: false, status: 500 })));
    await expect(geocodeCity("Dhaka")).rejects.toThrow(/\(500\)/);
  });
  it("lets aborts through untouched", async () => {
    const abort = new DOMException("Aborted", "AbortError");
    vi.stubGlobal("fetch", vi.fn(() => Promise.reject(abort)));
    await expect(geocodeCity("Dhaka")).rejects.toBe(abort);
  });
});

describe("fetchForecast", () => {
  it("rejects incomplete data", async () => {
    vi.stubGlobal("fetch", vi.fn(() => ok({ current: {} })));
    await expect(fetchForecast({ lat: 1, lon: 2 })).rejects.toThrow(/incomplete/);
  });
  it("returns data and sends coordinates", async () => {
    const fetchMock = vi.fn(() => ok({ current: { temperature_2m: 30 }, daily: { time: [] } }));
    vi.stubGlobal("fetch", fetchMock);
    const data = await fetchForecast({ lat: 23.7, lon: 90.4 });
    expect(data.current.temperature_2m).toBe(30);
    expect(fetchMock.mock.calls[0][0]).toContain("latitude=23.7");
  });
});
