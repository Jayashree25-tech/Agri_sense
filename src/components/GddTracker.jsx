export default function GddTracker({ gdd, cropLabel }) {
  return (
    <div className="card">
      <h3>Growing Degree Days — {cropLabel}</h3>
      <div className="gdd-wrap">
        <div className="gdd-track">
          <div className="gdd-fill" style={{ width: `${gdd.percentComplete}%` }} />
        </div>
        <div className="gdd-nums">
          <strong>{gdd.percentComplete}%</strong> to maturity
        </div>
      </div>
      <div className="stat-row" style={{ marginTop: 16 }}>
        <div className="stat">
          <div className="label">Accumulated GDD</div>
          <div className="val">{gdd.accumulated}</div>
        </div>
        <div className="stat">
          <div className="label">Target GDD</div>
          <div className="val">{gdd.toMaturity}</div>
        </div>
        <div className="stat">
          <div className="label">Today's GDD</div>
          <div className="val">{gdd.dailyGDD}</div>
        </div>
        <div className="stat">
          <div className="label">Days since sowing</div>
          <div className="val">{gdd.daysElapsed}</div>
        </div>
      </div>
    </div>
  );
}
