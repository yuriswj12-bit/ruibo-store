type Fitment = {
  year: number;
  make: string;
  model: string;
  engine: string;
  position: string | null;
};

/** RockAuto 式适配表：零件号命中后按年款高亮车型，不把 OE 原文和归一化值混在一列。 */
export function FitmentTable({ oe, fitments }: { oe: string; fitments: Fitment[] }) {
  return (
    <section className="rounded-xl border border-zinc-200 bg-white">
      <header className="border-b px-4 py-3 text-sm">
        Fits vehicles for <span className="font-semibold">{oe}</span>
      </header>
      <table className="w-full text-left text-sm">
        <thead className="bg-zinc-50 text-zinc-500">
          <tr>
            <th className="px-4 py-2 font-medium">Year</th>
            <th className="px-4 py-2 font-medium">Make</th>
            <th className="px-4 py-2 font-medium">Model</th>
            <th className="px-4 py-2 font-medium">Engine</th>
            <th className="px-4 py-2 font-medium">Position</th>
          </tr>
        </thead>
        <tbody>
          {fitments.map((row) => (
            <tr key={`${row.year}-${row.make}-${row.model}-${row.engine}`} className="border-t">
              <td className="px-4 py-2 font-medium text-amber-800">{row.year}</td>
              <td className="px-4 py-2">{row.make}</td>
              <td className="px-4 py-2">{row.model}</td>
              <td className="px-4 py-2">{row.engine}</td>
              <td className="px-4 py-2">{row.position || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
