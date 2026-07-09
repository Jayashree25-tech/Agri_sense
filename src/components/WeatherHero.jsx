const CONDITION_ICON = {
  Clear: '☀️', Clouds: '☁️', Rain: '🌧️', Drizzle: '🌦️',
  Thunderstorm: '⛈️', Snow: '❄️', Mist: '🌫️',
};

export default function WeatherHero({ current }) {
  const icon = CONDITION_ICON[current.condition] || '🌤️';
  return (
    <div className="card">
      <h3>Current Conditions</h3>
      <div className="weather-hero">
        <div style={{ fontSize: 48 }}>{icon}</div>
        <div className="weather-temp">{current.tempC}°C</div>
        <div className="weather-meta">
          <div className="city">
            {current.city}{current.state ? `, ${current.state}` : ''}{current.country ? `, ${current.country}` : ''}
          </div>
          <div className="desc">{current.description}</div>
        </div>
      </div>
      <div className="stat-row">
        <div className="stat">
          <div className="label">Feels like</div>
          <div className="val">{current.feelsLikeC}°C</div>
        </div>
        <div className="stat">
          <div className="label">Humidity</div>
          <div className="val">{current.humidity}%</div>
        </div>
        <div className="stat">
          <div className="label">Wind</div>
          <div className="val">{current.windSpeed} m/s</div>
        </div>
        <div className="stat">
          <div className="label">Pressure</div>
          <div className="val">{current.pressure} hPa</div>
        </div>
      </div>
    </div>
  );
}
