import { useEffect, useState } from 'react';
import WeatherHero from './components/WeatherHero';
import IrrigationCard from './components/IrrigationCard';
import RiskPanel from './components/RiskPanel';
import GddTracker from './components/GddTracker';
import ForecastStrip from './components/ForecastStrip';
import FieldworkCalendar from './components/FieldworkCalendar';
import SummaryBanner from './components/SummaryBanner';

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export default function App() {
  const [crops, setCrops] = useState([]);
  const [city, setCity] = useState('Chennai');
  const [cropKey, setCropKey] = useState('rice');
  const [seasonStart, setSeasonStart] = useState(todayIso());
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/crops')
      .then((r) => r.json())
      .then((list) => {
        setCrops(list);
        if (list.length && !list.find((c) => c.key === cropKey)) setCropKey(list[0].key);
      })
      .catch(() => setCrops([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadAdvisory(e) {
    if (e) e.preventDefault();
    if (!city.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ city, crop: cropKey, seasonStart });
      const res = await fetch('/api/advisory?' + params.toString());
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Something went wrong.');
      setData(json);
    } catch (err) {
      setError(err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-shell">
      <div className="topbar">
        <div className="brand">
          <div className="mark">🌾</div>
          <div>
            <h1>AgriSense</h1>
            <div className="tagline">Weather-driven crop advisory</div>
          </div>
        </div>
      </div>

      <form className="controls" onSubmit={loadAdvisory}>
        <div className="field">
          <label htmlFor="city">Location</label>
          <input
            id="city"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="e.g. Chennai"
          />
        </div>
        <div className="field">
          <label htmlFor="crop">Crop</label>
          <select id="crop" value={cropKey} onChange={(e) => setCropKey(e.target.value)}>
            {crops.map((c) => (
              <option key={c.key} value={c.key}>{c.label}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="seasonStart">Sowing Date</label>
          <input
            id="seasonStart"
            type="date"
            value={seasonStart}
            max={todayIso()}
            onChange={(e) => setSeasonStart(e.target.value)}
          />
        </div>
        <button className="btn" type="submit" disabled={loading}>
          {loading ? 'Loading…' : 'Get Advisory'}
        </button>
      </form>

      <div className="furrow" />

      {error && (
        <div className="error-state">
          <div className="icon">🌩️</div>
          <div>Couldn't load that advisory</div>
          <div className="msg">{error}</div>
          <button className="btn" onClick={loadAdvisory}>Try again</button>
        </div>
      )}

      {!error && !data && !loading && (
        <div className="empty-state">
          <div className="icon">🌱</div>
          <div>Enter a location and crop, then tap "Get Advisory" to begin.</div>
        </div>
      )}

      {data && !error && (
        <>
          <SummaryBanner summary={data.advisory.summary} />

          <div className="grid grid-2">
            <WeatherHero current={data.current} />
            <IrrigationCard irrigation={data.advisory.irrigation} />
          </div>

          <div className="grid grid-2">
            <RiskPanel risks={data.advisory.risks} />
            <GddTracker gdd={data.advisory.gdd} cropLabel={data.advisory.crop.label} />
          </div>

          <div className="grid" style={{ gridTemplateColumns: '1fr' }}>
            <ForecastStrip forecastDays={data.forecastDays} />
          </div>

          <div className="grid" style={{ gridTemplateColumns: '1fr' }}>
            <FieldworkCalendar fieldWork={data.advisory.fieldWork} />
          </div>
        </>
      )}

      <div className="footer-note">AgriSense · weather data via OpenWeatherMap · rule-based agronomy engine</div>
    </div>
  );
}
