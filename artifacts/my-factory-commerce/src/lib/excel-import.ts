import { prisma } from "@/lib/prisma";
import { normalizeOeNumber, splitOeNumbers } from "@/lib/normalizer";

export type ImportRow = Record<string, string>;

const STANDARD = new Set([
  "SKU",
  "Title",
  "PriceRange",
  "MOQ",
  "SamplePrice",
  "OE_Numbers",
  "Fitment_Year",
  "Fitment_Make",
  "Fitment_Model",
  "Fitment_Engine",
  "Fitment_Position",
]);

export async function importProductRows(tenantId: string, rows: ImportRow[]) {
  return prisma.$transaction(async (tx) => {
    const created = [];
    for (const row of rows) {
      const sku = (row.SKU || "").trim();
      const title = (row.Title || "").trim();
      if (!sku || !title) continue;

      const specifications: Record<string, string> = {};
      for (const [key, value] of Object.entries(row)) {
        if (!STANDARD.has(key) && value) specifications[key] = value;
      }

      const product = await tx.product.upsert({
        where: { tenantId_sku: { tenantId, sku } },
        create: {
          tenantId,
          sku,
          title,
          priceRange: row.PriceRange || null,
          moq: Number(row.MOQ || 1),
          samplePrice: row.SamplePrice || "0",
          specifications,
        },
        update: {
          title,
          priceRange: row.PriceRange || null,
          moq: Number(row.MOQ || 1),
          samplePrice: row.SamplePrice || "0",
          specifications,
        },
      });

      const oeValues = splitOeNumbers(row.OE_Numbers || "");
      if (oeValues.length) {
        await tx.oeCrossReference.deleteMany({ where: { productId: product.id } });
        await tx.oeCrossReference.createMany({
          data: oeValues.map((rawOe) => ({
            productId: product.id,
            rawOe,
            normalizedOe: normalizeOeNumber(rawOe),
          })),
        });
      }

      if (row.Fitment_Year && row.Fitment_Make && row.Fitment_Model && row.Fitment_Engine) {
        await tx.fitment.create({
          data: {
            productId: product.id,
            year: Number(row.Fitment_Year),
            make: row.Fitment_Make,
            model: row.Fitment_Model,
            engine: row.Fitment_Engine,
            position: row.Fitment_Position || null,
          },
        });
      }
      created.push(product.id);
    }
    return created;
  });
}
