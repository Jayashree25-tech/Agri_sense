# 🌾 AgriSense — Weather-driven Crop Advisory

AgriSense turns live weather data into practical, day-to-day farming advice. Enter a city and a crop, and it tells you whether to irrigate, flags disease risk from current conditions, tracks growing-degree days for the season, and highlights good windows for fieldwork — all built on real-time weather, not guesswork.

**🔗 Live webpage:** [agri-sense-syvs.onrender.com](https://agri-sense-syvs.onrender.com/)

> Hosted on Render's free tier — if it's been idle a while, the first load can take 30–50 seconds to wake up.

---

## ✨ Features

| Feature | What it does |
|---|---|
| 🌦️ **Live weather lookup** | Pulls current conditions and forecast for any city via OpenWeatherMap |
| 💧 **Irrigation advice** | Recommends whether to irrigate based on rainfall, humidity, and forecast |
| 🦠 **Disease risk panel** | Flags conditions favorable to common crop diseases |
| 🌱 **GDD tracker** | Calculates Growing Degree Days from season start to track crop development |
| 📅 **Fieldwork calendar** | Highlights good weather windows for spraying, harvesting, etc. |
| 🌾 **Multi-crop support** | Wheat, rice, cotton, tomato, potato, sugarcane, and more |

---

## 🧱 Tech Stack

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Weather data:** [OpenWeatherMap API](https://openweathermap.org/api)
- **Hosting:** Render (single service — see [Deployment](#-deployment))

---

## 🚀 Getting Started (local development)

### 1. Clone and install
```bash
git clone https://github.com/<your-username>/Agri_sense.git
cd Agri_sense
npm install
```

### 2. Add your API key
```bash
cp .env.example .env
```
Open `.env` and add your free [OpenWeatherMap](https://openweathermap.org/api) key:
```
WEATHER_API_KEY=your_real_key_here
```
> New keys can take 10–15 minutes to activate after signup.

### 3. Build the frontend
```bash
npm run build
```

### 4. Run it
```bash
npm start
```
Visit **http://localhost:4000**

---

## 🌐 Deployment

This webpage is deployed as a **single service** — Express serves both the built React frontend and the `/api` routes, so there's only one thing to host.

**Render (or Railway, etc.):**
| Setting | Value |
|---|---|
| Build Command | `npm install && npm run build` |
| Start Command | `npm start` |
| Environment Variable | `WEATHER_API_KEY` = your real key |

Set the environment variable in your hosting platform's dashboard — never commit your real key to GitHub. `.gitignore` already excludes `.env`.

---

## 📁 Project Structure

```
Agri_sense/
├── server.js            # Express server + /api routes
├── advisoryEngine.js    # Irrigation, disease risk, GDD, fieldwork logic
├── cropData.js          # Crop definitions and thresholds
├── src/
│   ├── App.jsx           # Main app + data fetching
│   └── components/       # WeatherHero, IrrigationCard, RiskPanel,
│                          # GddTracker, ForecastStrip, FieldworkCalendar
└── .env.example          # Copy to .env and add your key
```

---

## 🔑 How the API key works

Your OpenWeatherMap key lives **only** on the server (as an environment variable) — it never reaches the browser or GitHub. When you search a city, the browser calls your own backend, and the backend attaches the key when it calls OpenWeatherMap. This keeps your key private even though the webpage itself is public.

---

## 📄 License

MIT — free to use, modify, and share.
