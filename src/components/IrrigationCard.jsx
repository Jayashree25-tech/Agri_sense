const ACTION_BADGE = {
  skip: { cls: 'avoid', label: 'Skip' },
  reduce: { cls: 'caution', label: 'Reduce' },
  irrigate: { cls: 'risk', label: 'Irrigate' },
  normal: { cls: 'good', label: 'Normal' },
};

export default function IrrigationCard({ irrigation }) {
  const badge = ACTION_BADGE[irrigation.action] || ACTION_BADGE.normal;
  return (
    <div className="card">
      <h3>Irrigation Advisory</h3>
      <span className={`badge ${badge.cls}`} style={{ marginBottom: 10 }}>{badge.label}</span>
      <div className="irrigation-headline">{irrigation.headline}</div>
      <p className="irrigation-detail">{irrigation.detail}</p>
    </div>
  );
}
