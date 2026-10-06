import type { ReactNode } from "react";
import { StoreShell } from "@/components/store/shell";

export function CompanyPage({
  store,
  title,
  lede,
  blocks,
  children,
}: {
  store: { name: string; email: string } | null;
  title: string;
  lede: string;
  blocks: { title: string; body: string }[];
  children?: ReactNode;
}) {
  if (!store) return <main className="wrap py-16">…</main>;
  return (
    <StoreShell name={store.name} email={store.email}>
      <main className="wrap py-10">
        <h1 className="text-4xl">{title}</h1>
        {lede ? <p className="mt-3 max-w-2xl text-muted">{lede}</p> : null}
        <div className="mt-8 grid gap-3">
          {blocks.map((block) => (
            <article key={block.title} className="rounded-card border border-line bg-card p-4">
              <h2 className="text-xl">{block.title}</h2>
              <p className="mt-2 text-sm text-muted">{block.body}</p>
            </article>
          ))}
        </div>
        {children}
      </main>
    </StoreShell>
  );
}
