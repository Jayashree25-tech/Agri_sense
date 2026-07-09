import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { CROPS, VALID_CROPS } from './cropData.js';
import { buildAdvisory } from './advisoryEngine.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 4000;

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

if (!WEATHER_API_KEY) {
  console.warn(
    '\n⚠️  Missing WEATHER_API_KEY in your .env file.\n' +
    '   Copy .env.example to .env and add your OpenWeatherMap key before using the app.\n'
  );
}

app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// ---- Geocode a place name to lat/lon ----
async function geocodeCity(city) {
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
    city
  )}&limit=1&appid=${WEATHER_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) {
    if (res.status === 401) throw new Error('Weather API key is invalid or inactive.');
    throw new Error(`Geocoding error (${res.status})`);
  }
  const matches = await res.json();
  if (!matches.length) {
    throw new Error(`Couldn't find "${city}". Try an exact city name.`);
  }
  const m = matches[0];
  return { lat: m.lat, lon: m.lon, name: m.name, state: m.state, country: m.country };
}

// ---- Current weather ----
async function getCurrentWeather(city) {
  const place = await geocodeCity(city);
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${place.lat}&lon=${place.lon}&units=metric&appid=${WEATHER_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) {
    if (res.status === 401) throw new Error('Weather API key is invalid or inactive.');
    throw new Error(`Weather API error (${res.status})`);
  }
  const data = await res.json();
  return {
    city: place.name,
    state: place.state || null,
    country: place.country || data.sys?.country,
    tempC: Math.round(data.main.temp),
    feelsLikeC: Math.round(data.main.feels_like),
    condition: data.weather[0].main,
    description: data.weather[0].description,
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    pressure: data.main.pressure,
  };
}

// ---- 5-day / 3-hour forecast, reduced to one entry per day with a rain-probability (pop) ----
async function getForecast(city) {
  const place = await geocodeCity(city);
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${place.lat}&lon=${place.lon}&units=metric&appid=${WEATHER_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Forecast API error (${res.status})`);
  const data = await res.json();

  const byDay = new Map();
  for (const entry of data.list) {
    const day = entry.dt_txt.split(' ')[0];
    if (!byDay.has(day)) byDay.set(day, []);
    byDay.get(day).push(entry);
  }

  return [...byDay.entries()].slice(0, 5).map(([day, entries]) => {
    const midday = entries.reduce((best, e) => {
      const hour = Number(e.dt_txt.split(' ')[1].split(':')[0]);
      const bestHour = Number(best.dt_txt.split(' ')[1].split(':')[0]);
      return Math.abs(hour - 12) < Math.abs(bestHour - 12) ? e : best;
    }, entries[0]);

    const temps = entries.map((e) => e.main.temp);
    const maxPop = Math.max(...entries.map((e) => e.pop ?? 0));

    return {
      date: day,
      minC: Math.round(Math.min(...temps)),
      maxC: Math.round(Math.max(...temps)),
      condition: midday.weather[0].main,
      description: midday.weather[0].description,
      pop: maxPop, // probability of precipitation, 0-1
    };
  });
}

// ---- List available crops (for the dropdown) ----
app.get('/api/crops', (req, res) => {
  res.json(
    VALID_CROPS.map((key) => ({ key, label: CROPS[key].label }))
  );
});

// ---- Main advisory endpoint ----
app.get('/api/advisory', async (req, res) => {
  const city = (req.query.city || '').trim();
  const cropKey = (req.query.crop || '').trim();
  const seasonStartDate = (req.query.seasonStart || '').trim() || null;

  if (!city) return res.status(400).json({ error: 'Please provide a city name.' });
  if (!VALID_CROPS.includes(cropKey)) {
    return res.status(400).json({ error: `Please provide a valid crop: ${VALID_CROPS.join(', ')}` });
  }

  try {
    const [current, forecastDays] = await Promise.all([
      getCurrentWeather(city),
      getForecast(city),
    ]);
    const advisory = buildAdvisory({ cropKey, current, forecastDays, seasonStartDate });
    res.json({ current, forecastDays, advisory });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Something went wrong.' });
  }
});

app.listen(PORT, () => {
  console.log(`\n🌾 AgriSense server running at http://localhost:${PORT}\n`);
});
