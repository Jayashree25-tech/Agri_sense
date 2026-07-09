export default function SummaryBanner({ summary }) {
  return (
    <div className="summary-banner">
      <span className="eyebrow">Advisory Summary</span>
      {summary}
    </div>
  );
}
