export default function RiskPanel({ risks }) {
  return (
    <div className="card">
      <h3>Pest & Disease Risk</h3>
      {risks.length === 0 ? (
        <div className="no-risk">✅ No significant risk detected under current conditions.</div>
      ) : (
        risks.map((r) => (
          <div className="risk-item" key={r.name}>
            <div className="risk-name">⚠️ {r.name}</div>
            <div className="risk-msg">{r.message}</div>
          </div>
        ))
      )}
    </div>
  );
}
