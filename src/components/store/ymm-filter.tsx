import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ymmCascade } from "@/lib/commerce.functions";

type Hit = { sku: string; title: string; samplePrice: string; engine: string; position: string | null };

export function YmmFilter() {
  const [year, setYear] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [engine, setEngine] = useState("");
  const [years, setYears] = useState<number[]>([]);
  const [makes, setMakes] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [engines, setEngines] = useState<string[]>([]);
  const [products, setProducts] = useState<Hit[]>([]);

  useEffect(() => {
    let cancel = false;
    ymmCascade({
      data: {
        year: year ? Number(year) : undefined,
        make: year && make ? make : undefined,
        model: year && make && model ? model : undefined,
      },
    }).then((result) => {
      if (cancel) return;
      if (result.level === "years") setYears(result.years);
      if (result.level === "makes") setMakes(result.makes);
      if (result.level === "models") setModels(result.models);
      if (result.level === "engines") {
        setEngines(result.engines);
        setProducts(result.products);
      }
    });
    return () => {
      cancel = true;
    };
  }, [year, make, model]);

  const visible = engine ? products.filter((item) => item.engine === engine) : products;
  const selectClass = "h-11 rounded-lg border border-line bg-card px-2 text-sm disabled:opacity-50";

  return (
    <section className="rounded-card border border-line bg-card p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-copper">Vehicle lookup</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <select className={selectClass} value={year} onChange={(event) => { setYear(event.target.value); setMake(""); setModel(""); setEngine(""); setProducts([]); }}>
          <option value="">Year</option>
          {years.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <select className={selectClass} value={make} disabled={!year} onChange={(event) => { setMake(event.target.value); setModel(""); setEngine(""); setProducts([]); }}>
          <option value="">Make</option>
          {makes.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <select className={selectClass} value={model} disabled={!make} onChange={(event) => { setModel(event.target.value); setEngine(""); setProducts([]); }}>
          <option value="">Model</option>
          {models.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <select className={selectClass} value={engine} disabled={!model} onChange={(event) => setEngine(event.target.value)}>
          <option value="">Engine</option>
          {engines.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </div>
      {model && (
        <ul className="mt-3 divide-y divide-line text-sm">
          {visible.map((item) => (
            <li key={`${item.sku}-${item.engine}`} className="flex items-center justify-between gap-3 py-2">
              <Link to="/products/$sku" params={{ sku: item.sku }} search={{ q: "", make: "" }} className="font-medium underline decoration-line underline-offset-4">
                {item.title}
              </Link>
              <span className="text-muted">{item.position} · ${item.samplePrice}</span>
            </li>
          ))}
          {visible.length === 0 && <li className="py-2 text-muted">No published fitment.</li>}
        </ul>
      )}
    </section>
  );
}
