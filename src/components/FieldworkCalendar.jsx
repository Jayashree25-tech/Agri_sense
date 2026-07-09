function fmtDate(iso) {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

export default function FieldworkCalendar({ fieldWork }) {
  return (
    <div className="card">
      <h3>Sowing / Harvest Window</h3>
      {fieldWork.map((d) => (
        <div className="fieldwork-row" key={d.date}>
          <div className="fw-date">{fmtDate(d.date)}</div>
          <div className="fw-reason">{d.reason}</div>
          <span className={`badge ${d.verdict}`}>{d.verdict}</span>
        </div>
      ))}
    </div>
  );
}
