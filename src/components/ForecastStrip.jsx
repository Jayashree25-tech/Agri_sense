function fmtDate(iso) {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' });
}

export default function ForecastStrip({ forecastDays }) {
  return (
    <div className="card">
      <h3>5-Day Forecast</h3>
      <div className="forecast-strip">
        {forecastDays.map((d) => (
          <div className="forecast-day" key={d.date}>
            <div className="fd-date">{fmtDate(d.date)}</div>
            <div className="fd-temp">{d.minC}° / {d.maxC}°</div>
            <div className="fd-desc">{d.description}</div>
            <div className="fd-badge">
              <span className={`badge ${d.pop >= 0.5 ? 'avoid' : d.pop >= 0.25 ? 'caution' : 'good'}`}>
                {Math.round(d.pop * 100)}% rain
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
