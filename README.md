# Ruibo store

Buyer storefront for Wenzhou Ruibo Sensing Technology (温州瑞铂传感科技有限公司, RBTC).

Search oxygen sensors by OEM number, request a bulk quote, or order a sample. Languages: Chinese, English, Spanish, Portuguese. The review version opens in Chinese.

## Catalog

`migrations/0008_wps_catalog.sql` is what a database that already ran the old import uses. `scripts/catalog_canonical.json` is the source: **302 factory SKUs** and **601 OEM numbers**. `scripts/catalog_seed.py` regenerates `migrations/0004_ruibo_catalog.sql` from that file. The source PDF is `attachments/RUIBO SENSORS.pdf`.

The numbers come from a WPS reading of the catalog, checked against the page layout. Ten cards that reading dropped are filled from the layout: `RBBM-04612`, `RBBM-54710`, `RBTO-0D040`, `RBTO-06070`, `RBNI-1JA0A`, `RBNI-EY00A`, `RBSU-8A232`, `RBSU-8A025`, `RBLA-96129`, `RBLA-3000L`.

- Sample price is the demo fee ($32). Wholesale stays “Factory quote”. No list prices were invented.
- A factory SKU is `RB` plus a two-letter make code, then a hyphen, then the factory number. `RBVO-51723` is Volvo, not `RB-VO51723`. Its OEM is `30651723`, not `3065-1-723`.
- One SKU can list several OEM numbers. A few OEM numbers are printed on more than one SKU. Buyers search the OEM. The factory SKU stays in the portal, on the inquiry, and on the sample order.

## For other agents

This repo is the whole storefront workspace, meant to be picked up by another AI harness.

- `AGENTS.md` and `AGENTS.project.md` are the project rules.
- `.grok/skills` and `.grok/references` are the harness skills (auth, data, deploy, UI).
- Buyer pages live in `src/routes` and `src/components/store`. Catalog data is `migrations/`.
- Do not commit `node_modules`, `.env`, or build caches.
- After every storefront change, commit and push to `main` on [yuriswj12-bit/ruibo-store](https://github.com/yuriswj12-bit/ruibo-store). Do not leave the repo behind the working copy.

One catalog row can list several OEM numbers, but the buyer sees only the number they searched. The Ruibo SKU stays in the factory portal, on the inquiry, and on the sample order.


