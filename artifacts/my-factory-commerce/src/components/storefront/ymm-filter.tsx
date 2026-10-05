"use client";

import { useEffect, useState } from "react";

type ProductHit = {
  id: string;
  sku: string;
  title: string;
  samplePrice: string;
  engine: string;
  position: string | null;
};

type Props = {
  tenantId: string;
  lang: string;
};

export function YmmFilter({ tenantId, lang }: Props) {
  const [year, setYear] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [engine, setEngine] = useState("");
  const [years, setYears] = useState<number[]>([]);
  const [makes, setMakes] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [engines, setEngines] = useState<string[]>([]);
  const [products, setProducts] = useState<ProductHit[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ tenantId });
    if (year) params.set("year", year);
    if (year && make) params.set("make", make);
    if (year && make && model) params.set("model", model);

    setLoading(true);
    fetch(`/api/v1/storefront/ymm/cascade?${params}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((json: { level: string; years?: number[]; makes?: string[]; models?: string[]; engines?: string[]; products?: ProductHit[] }) => {
        if (json.level === "years") setYears(json.years ?? []);
        if (json.level === "makes") setMakes(json.makes ?? []);
        if (json.level === "models") setModels(json.models ?? []);
        if (json.level === "engines") {
          setEngines(json.engines ?? []);
          setProducts(json.products ?? []);
        }
      })
      .catch(() => undefined)
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [tenantId, year, make, model]);

  const visible = engine ? products.filter((item) => item.engine === engine) : products;

  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-4">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">Vehicle lookup</h2>
      <div className="grid gap-2 sm:grid-cols-4">
        <select
          value={year}
          onChange={(event) => {
            setYear(event.target.value);
            setMake("");
            setModel("");
            setEngine("");
            setMakes([]);
            setModels([]);
            setEngines([]);
            setProducts([]);
          }}
          className="rounded-md border border-zinc-300 px-2 py-2 text-sm"
        >
          <option value="">Year</option>
          {years.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
        <select
          value={make}
          disabled={!year}
          onChange={(event) => {
            setMake(event.target.value);
            setModel("");
            setEngine("");
            setModels([]);
            setEngines([]);
            setProducts([]);
          }}
          className="rounded-md border border-zinc-300 px-2 py-2 text-sm disabled:bg-zinc-50"
        >
          <option value="">Make</option>
          {makes.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
        <select
          value={model}
          disabled={!make}
          onChange={(event) => {
            setModel(event.target.value);
            setEngine("");
            setEngines([]);
            setProducts([]);
          }}
          className="rounded-md border border-zinc-300 px-2 py-2 text-sm disabled:bg-zinc-50"
        >
          <option value="">Model</option>
          {models.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
        <select
          value={engine}
          disabled={!model}
          onChange={(event) => setEngine(event.target.value)}
          className="rounded-md border border-zinc-300 px-2 py-2 text-sm disabled:bg-zinc-50"
        >
          <option value="">Engine</option>
          {engines.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      </div>
      {loading && <p className="mt-2 text-xs text-zinc-500">Loading fitment…</p>}
      {year && make && model && (
        <ul className="mt-4 divide-y divide-zinc-100">
          {visible.map((item) => (
            <li key={item.id} className="flex items-center justify-between py-2 text-sm">
              <a className="font-medium text-zinc-900 underline" href={`/${lang}/products/${item.sku}`}>
                {item.title}
                {item.position ? ` · ${item.position}` : ""}
              </a>
              <span className="text-zinc-500">{item.sku} · ${item.samplePrice}</span>
            </li>
          ))}
          {visible.length === 0 && !loading && <li className="py-2 text-sm text-zinc-500">No published fitment.</li>}
        </ul>
      )}
    </section>
  );
}
