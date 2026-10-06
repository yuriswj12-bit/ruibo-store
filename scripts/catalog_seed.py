#!/usr/bin/env python3
"""Regenerate the Ruibo catalog SQL from scripts/catalog_canonical.json.

Writes migrations/0004_ruibo_catalog.sql and migrations/0008_wps_catalog.sql.
0008 is what an already-migrated database runs. Editing 0008 after it has
been applied does not run it again.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CATALOG = json.loads((ROOT / "scripts" / "catalog_canonical.json").read_text(encoding="utf-8"))


def norm(value: str) -> str:
    return "".join(ch for ch in value.upper() if ch.isalnum())


def q(value: str) -> str:
    return value.replace("'", "''")


lines = [
    "-- Catalog from the WPS reading of the Ruibo PDF, plus 10 cards that reading dropped.",
    "insert into products (id, factory_id, sku, title, price_range, moq, sample_price, sample_stock, specs) values",
]
values = []
for row in CATALOG:
    pid = "prd_" + norm(row["sku"]).lower()
    specs = (
        '{"line":"' + row["line"] + '","vehicle":"' + row["vehicle"]
        + '","sensor":"Heated zirconia"}'
    )
    values.append(
        f"('{pid}', 'fac_xinda', '{q(row['sku'])}', '{q(row['vehicle'])} oxygen sensor', "
        f"'Factory quote', 100, 32.00, 24, '{specs}')"
    )
lines.append(",\n".join(values))
lines.append(
    "on conflict (factory_id, sku) do update set published = true, title = excluded.title, specs = excluded.specs;"
)
lines.append(
    "delete from oe_refs where product_id in (select id from products where factory_id = 'fac_xinda' and sku like 'RB%');"
)
for row in CATALOG:
    for index, oe in enumerate(row["oes"], start=1):
        oid = f"oe_{norm(row['sku']).lower()}_{index}"
        lines.append(
            "insert into oe_refs (id, product_id, raw_oe, normalized_oe, brand) "
            f"select '{oid}', id, '{q(oe)}', '{norm(oe)}', '{q(row['vehicle'])}' "
            f"from products where factory_id = 'fac_xinda' and sku = '{q(row['sku'])}';"
        )

out = ROOT / "migrations" / "0004_ruibo_catalog.sql"
text = "\n".join(lines) + "\n"
out.write_text(text, encoding="utf-8")
sync = ROOT / "migrations" / "0008_wps_catalog.sql"
sync.write_text(
    "-- Replace the live Ruibo catalog. 0004 already ran with the old transcription.\n"
    "delete from products where factory_id = 'fac_xinda' and sku like 'RB%';\n"
    + text,
    encoding="utf-8",
)
print(f"{len(CATALOG)} skus, {sum(len(r['oes']) for r in CATALOG)} oes -> {out}")

