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
    { label: "浏览量 PV", value: pv, hint: "近 30 天" },
    { label: "独立访客 UV", value: uv, hint: "近 30 天" },
    { label: "询盘 RFQ", value: inquiries, hint: "近 30 天" },
    { label: "已付样品", value: paidSamples, hint: "近 30 天" },
  ];
  return (
    <div className="metrics">
      {cards.map((card) => (
        <article key={card.label} className="card metric">
          <span style={{ fontSize: 13, color: "#57534e" }}>{card.label}</span>
          <strong>{card.value.toLocaleString()}</strong>
          <div className="trend">{card.hint}</div>
        </article>
      ))}
    </div>
  );
}
