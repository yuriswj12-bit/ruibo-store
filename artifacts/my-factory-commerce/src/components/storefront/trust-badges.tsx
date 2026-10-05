export function TrustBadges({ certImages = [] }: { certImages?: string[] }) {
  return (
    <section className="grid-3" style={{ marginTop: 8 }}>
      <article className="card">
        <p className="kicker">Process</p>
        <h3>IATF line, not a trading desk</h3>
        <p>Heated zirconia elements, 4-pin harness, thread gauge checked before pack-out.</p>
      </article>
      <article className="card">
        <p className="kicker">Cross reference</p>
        <h3>OEM numbers are identifiers</h3>
        <p>Bosch, Denso, Toyota and Subaru numbers identify fitment only. This factory is not those brands.</p>
      </article>
      <article className="card">
        <p className="kicker">Sample</p>
        <h3>Stock samples, no account</h3>
        <p>One to five pieces. Card, PayPal, Binance Pay, or a TRC20 hash for manual review.</p>
      </article>
      {certImages.map((src) => (
        <img key={src} src={src} alt="Factory certificate" className="card" />
      ))}
    </section>
  );
}
