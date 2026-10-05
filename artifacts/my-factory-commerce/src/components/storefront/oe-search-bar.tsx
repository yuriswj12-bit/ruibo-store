"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function OeSearchBar({ lang }: { lang: string }) {
  const router = useRouter();
  const [value, setValue] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();
    router.push(`/${lang}/products?q=${encodeURIComponent(value.trim())}`);
  }

  return (
    <form onSubmit={submit} style={{ display: "flex", gap: 8, marginTop: 18 }}>
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="0 258 006 027 or 89465-02130"
        style={{ flex: 1, border: "1px solid #e4ddd2", borderRadius: 8, padding: "10px 12px" }}
      />
      <button type="submit" style={{ background: "#1c1917", color: "#fff", border: 0, borderRadius: 8, padding: "10px 14px" }}>
        Find OE
      </button>
    </form>
  );
}
