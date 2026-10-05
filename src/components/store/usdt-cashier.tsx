import { useEffect, useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n";

export const USDT_NETWORKS = [
  { id: "solana", name: "Solana", fee: "0.0006", address: "DEMOSo1anaUSDT111111111111111111111111111" },
  { id: "polygon", name: "Polygon", fee: "0.008", address: "0xDEMO00000000000000000000000000000000a11" },
  { id: "bsc", name: "BNB Chain", fee: "0.06", address: "0xDEMO00000000000000000000000000000000b22" },
  { id: "aptos", name: "Aptos", fee: "0.001", address: "0xdemoaptos0000000000000000000000000000000000000000000000000000a3" },
] as const;

export type UsdtNetworkId = (typeof USDT_NETWORKS)[number]["id"];

export function UsdtCashier({
  amount,
  onBeforeOpen,
  onPaid,
}: {
  amount: string;
  onBeforeOpen: () => boolean;
  onPaid: (network: UsdtNetworkId) => Promise<void>;
}) {
  const { t } = useI18n();
  const [networkId, setNetworkId] = useState<UsdtNetworkId>("solana");
  const [open, setOpen] = useState(false);
  const [left, setLeft] = useState(15 * 60);
  const [copied, setCopied] = useState(false);
  const [checking, setChecking] = useState(false);
  const network = USDT_NETWORKS.find((item) => item.id === networkId) ?? USDT_NETWORKS[0];
  const exact = useMemo(() => exactAmount(amount, network.id), [amount, network.id]);

  useEffect(() => {
    if (!open) return;
    setLeft(15 * 60);
    const timer = setInterval(() => setLeft((value) => (value > 0 ? value - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, [open, network.id]);

  const clock = `${String(Math.floor(left / 60)).padStart(2, "0")}:${String(left % 60).padStart(2, "0")}`;

  async function confirm() {
    setChecking(true);
    await new Promise((resolve) => setTimeout(resolve, 900));
    try {
      await onPaid(network.id);
      setOpen(false);
    } finally {
      setChecking(false);
    }
  }

  return (
    <section className="rounded-card border border-line bg-card p-4">
      <h2 className="text-xl">{t("usdtPay")}</h2>
      <p className="mt-1 text-sm text-muted">{t("chooseNetwork")}</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {USDT_NETWORKS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setNetworkId(item.id)}
            className={`rounded-lg border px-3 py-2 text-left ${item.id === networkId ? "border-ink bg-ink text-copper-ink" : "border-line"}`}
          >
            <span className="block font-medium">{item.name}</span>
            <span className={`block text-sm ${item.id === networkId ? "text-copper-ink/80" : "text-muted"}`}>
              {t("gasAbout", { fee: item.fee })}
              {item.id === "solana" ? ` · ${t("lowestGas")}` : ""}
            </span>
          </button>
        ))}
      </div>
      <button
        type="button"
        className="mt-3 h-11 rounded-lg bg-copper px-4 text-copper-ink"
        onClick={() => {
          if (!onBeforeOpen()) return;
          setOpen(true);
        }}
      >
        {t("openCashier")} · {network.name}
      </button>
      {open && (
        <div className="fixed inset-0 z-40 grid place-items-center bg-ink/50 p-4">
          <div className="grid w-full max-w-md gap-3 rounded-card bg-card p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-copper">{network.name}</p>
                <h3 className="text-2xl">{t("cashierTitle")}</h3>
              </div>
              <button type="button" className="text-sm text-muted" onClick={() => setOpen(false)}>{t("cancel")}</button>
            </div>
            <p className="text-sm text-muted">{t("payExact")}</p>
            <p className="text-3xl">{exact} USDT</p>
            <p className="text-sm text-brass">{t("expires", { time: clock })}</p>
            <FakeQr label={t("simQr")} seed={`${network.address}:${exact}`} />
            <div>
              <p className="text-xs text-muted">{t("walletAddress")}</p>
              <p className="mt-1 break-all font-medium">{network.address}</p>
              <button
                type="button"
                className="mt-2 h-9 rounded-lg border border-line px-3 text-sm"
                onClick={() => {
                  navigator.clipboard?.writeText(network.address);
                  setCopied(true);
                }}
              >
                {copied ? t("copied") : t("copyAddress")}
              </button>
            </div>
            <p className="text-sm text-muted">{t("simNote")}</p>
            <button
              type="button"
              disabled={checking || left === 0}
              className="h-11 rounded-lg bg-ink px-4 text-copper-ink disabled:opacity-50"
              onClick={confirm}
            >
              {checking ? t("simChecking") : t("iPaid")}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function exactAmount(amount: string, network: string) {
  const base = Number(amount);
  let hash = 0;
  for (const char of network) hash = (hash * 33 + char.charCodeAt(0)) % 9000;
  return (base + (hash + 1000) / 1000000).toFixed(6);
}

function FakeQr({ seed, label }: { seed: string; label: string }) {
  const cells = useMemo(() => {
    const size = 21;
    const grid: boolean[] = [];
    let n = 2166136261;
    for (const char of seed) n ^= char.charCodeAt(0) * 16777619;
    for (let i = 0; i < size * size; i += 1) {
      n = Math.imul(n ^ (n >>> 15), 2246822519);
      grid.push((n >>> 0) % 3 !== 0);
    }
    const mark = (x: number, y: number) => {
      for (let dy = 0; dy < 7; dy += 1) {
        for (let dx = 0; dx < 7; dx += 1) {
          const edge = dx === 0 || dy === 0 || dx === 6 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4);
          grid[(y + dy) * size + (x + dx)] = edge;
        }
      }
    };
    mark(0, 0);
    mark(size - 7, 0);
    mark(0, size - 7);
    return { size, grid };
  }, [seed]);

  return (
    <div className="grid justify-items-center gap-1">
      <svg viewBox={`0 0 ${cells.size} ${cells.size}`} className="size-40 bg-white" role="img" aria-label={label}>
        {cells.grid.map((on, index) =>
          on ? (
            <rect
              key={index}
              x={index % cells.size}
              y={Math.floor(index / cells.size)}
              width="1"
              height="1"
              fill="#0c2340"
            />
          ) : null,
        )}
      </svg>
      <p className="text-xs text-muted">{label}</p>
    </div>
  );
}
