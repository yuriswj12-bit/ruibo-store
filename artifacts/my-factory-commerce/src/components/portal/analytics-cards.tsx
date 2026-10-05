export function AnalyticsCards({
  pv,
  uv,
  inquiries,
  paidSamples,
}: {
  pv: number;
  uv: number;
  inquiries: number;
  paidSamples: number;
}) {
  const cards = [
    ["PV", pv],
    ["UV", uv],
    ["RFQ", inquiries],
    ["Paid samples", paidSamples],
  ];
  return (
    <div className="metrics">
      {cards.map(([label, value]) => (
        <article key={label} className="card metric">
          <span>{label}</span>
          <strong>{value}</strong>
        </article>
      ))}
    </div>
  );
}
