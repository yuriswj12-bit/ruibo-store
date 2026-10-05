# Ruibo store

Buyer storefront for Wenzhou Ruibo Sensing Technology (温州瑞铂传感科技有限公司, RBTC).

Search oxygen sensors by OEM number, request a bulk quote, or order a sample. Languages: Chinese, English, Spanish, Portuguese. The review version opens in Chinese.

## Catalog

`migrations/0004_ruibo_catalog.sql` loads **303 SKUs** and **608 OEM numbers** transcribed from the factory catalog, pages 6–37. The source PDF is `attachments/RUIBO SENSORS.pdf`.

- Sample price is the demo fee ($32). Wholesale stays “Factory quote”. No list prices were invented.
- SKUs in large type are the reliable field. Some OEM digits were read from scan images. Crowded pages (BMW, Mercedes, Land Rover, Honda, Toyota, and the Chinese brands) should be checked against the printed catalog before production use.
- Duplicate printed SKUs were merged onto one product.

`scripts/catalog_seed.py` is the transcription used to generate that migration.

## For other agents

This repo is the whole storefront workspace, meant to be picked up by another AI harness.

- `AGENTS.md` and `AGENTS.project.md` are the project rules.
- `.grok/skills` and `.grok/references` are the harness skills (auth, data, deploy, UI).
- Buyer pages live in `src/routes` and `src/components/store`. Catalog data is `migrations/`.
- Do not commit `node_modules`, `.env`, or build caches.

