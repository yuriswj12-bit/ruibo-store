"use client";

import { useMemo, useState } from "react";
import { benchmarks, buildScript, lessons, pillars, tracks, weekPlan, windows, type MarketId, type PillarId, type ScriptProduct } from "@/lib/content-desk";

export function ContentDesk({
  factoryName,
  products,
  whatsapp,
  domain,
}: {
  factoryName: string;
  products: ScriptProduct[];
  whatsapp?: string;
  domain?: string;
}) {
  const [sku, setSku] = useState(products[0]?.sku ?? "");
  const [pillar, setPillar] = useState<PillarId>("position");
  const [market, setMarket] = useState<MarketId>("waf");
  const [copied, setCopied] = useState("");
  const product = products.find((item) => item.sku === sku) ?? products[0];

  const script = useMemo(
    () => (product ? buildScript({ factoryName, product, pillar, market, whatsapp, domain }) : null),
    [factoryName, product, pillar, market, whatsapp, domain],
  );

  async function copy(label: string, text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(label);
  }

  return (
    <div className="desk">
      <div className="bench-grid">
        {benchmarks.map((item) => (
          <article key={item.handle} className="card">
            <p className="kicker">{item.role}</p>
            <strong>{item.name}</strong>
            <p className="sku">{item.handle}</p>
            <p>{item.snapshot}</p>
            <p>{item.formula}</p>
            <p className="steal">拿走：{item.steal}</p>
            <a href={item.url} target="_blank" rel="noreferrer">打开账号</a>
          </article>
        ))}
      </div>

      <div className="track-grid">
        {tracks.map((item) => (
          <article key={item.id} className="card">
            <p className="kicker">{item.metric}</p>
            <strong>{item.name}</strong>
            <p>{item.job}</p>
            <p className="steal">{item.rule}</p>
          </article>
        ))}
      </div>

      <h2>传感器三课</h2>
      <div className="bench-grid lessons">
        {lessons.map((item) => (
          <article key={item.id} className="card">
            <strong>{item.title}</strong>
            <p>{item.fact}</p>
          </article>
        ))}
      </div>

      <h2>买家窗口</h2>
      <p className="sku">中国时间是排期，不是拍摄。素材白天拍，按买家晚饭后发布。</p>
      <table>
        <thead>
          <tr><th>市场</th><th>买家</th><th>当地</th><th>中国定时</th><th>语言</th></tr>
        </thead>
        <tbody>
          {windows.map((item) => (
            <tr key={item.id}>
              <td>{item.market}</td>
              <td>{item.buyers}<div className="sku">{item.note}</div></td>
              <td>{item.local}</td>
              <td>{item.china}</td>
              <td>{item.lang}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>一周：娱乐 4，科普 3</h2>
      <div className="bench-grid">
        {pillars.map((item) => (
          <article key={item.id} className="card">
            <p className="kicker">{item.from} · {item.track === "knowledge" ? "科普" : "出镜"} · {item.length}</p>
            <strong>{item.name}</strong>
            <ol>{item.shots.map((shot) => <li key={shot}>{shot}</li>)}</ol>
          </article>
        ))}
      </div>
      <table>
        <thead><tr><th>日</th><th>柱</th><th>任务</th></tr></thead>
        <tbody>
          {weekPlan.map((item) => (
            <tr key={item.day}>
              <td>{item.day}</td>
              <td>{pillars.find((pillar) => pillar.id === item.pillar)?.name}</td>
              <td>{item.job}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>脚本台</h2>
      <div className="script-controls">
        <label>SKU
          <select value={sku} onChange={(event) => setSku(event.target.value)}>
            {products.map((item) => <option key={item.sku} value={item.sku}>{item.sku}</option>)}
          </select>
        </label>
        <label>柱
          <select value={pillar} onChange={(event) => setPillar(event.target.value as PillarId)}>
            {pillars.map((item) => <option key={item.id} value={item.id}>{item.track === "knowledge" ? "科普" : "出镜"} · {item.name}</option>)}
          </select>
        </label>
        <label>窗口
          <select value={market} onChange={(event) => setMarket(event.target.value as MarketId)}>
            {windows.map((item) => <option key={item.id} value={item.id}>{item.market}</option>)}
          </select>
        </label>
      </div>
      {script && product && (
        <article className="card script-card">
          <p className="kicker">{script.track} · {script.market} · {script.duration}</p>
          <p>排期 {script.postAt}。{script.lang}。</p>
          <p><strong>口播</strong></p>
          <p>{script.spoken}</p>
          <p><strong>文案</strong></p>
          <p>{script.caption}</p>
          <p className="sku">{script.hashtags}</p>
          <p>{script.cta}</p>
          <div className="script-actions">
            <button type="button" onClick={() => copy("口播", script.spoken)}>复制口播</button>
            <button type="button" onClick={() => copy("文案", `${script.caption}\n${script.hashtags}`)}>复制文案</button>
            {copied && <span className="sku">已复制{copied}</span>}
          </div>
        </article>
      )}
    </div>
  );
}
