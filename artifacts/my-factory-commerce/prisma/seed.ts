import { PrismaClient, Prisma } from "@prisma/client";
import { hashPassword } from "../src/lib/auth";

const prisma = new PrismaClient();

const MOCK = {
  product: {
    sku: "OS-B0258006027",
    title: "Downstream Oxygen Sensor for Toyota Corolla 1.8L 2014-2019",
    moq: 100,
    priceRange: "$7.80 - $11.50 / pcs",
    samplePrice: 28.0,
    sampleStock: 35,
    pdfAttachment: "https://pub-r2.matrix-commerce.com/specs/OS-B0258006027.pdf",
    isPublished: true,
    specifications: {
      sensor_type: "Zirconia / Heated",
      wire_length_mm: 450,
      pins: 4,
      thread_size: "M18 x 1.5",
      wrench_size_mm: 22,
      connector_gender: "Male",
      warranty_years: 2,
    },
  },
  oe_numbers: [
    { rawOe: "0 258 006 027", normalizedOe: "0258006027", brand: "Bosch" },
    { rawOe: "89465-02130", normalizedOe: "8946502130", brand: "Toyota" },
    { rawOe: "DOX-0109", normalizedOe: "DOX0109", brand: "Denso" },
    { rawOe: "22690-AA007", normalizedOe: "22690AA007", brand: "Subaru" },
  ],
  fitments: [
    { year: 2014, make: "Toyota", model: "Corolla", engine: "1.8L L4", position: "Downstream" },
    { year: 2015, make: "Toyota", model: "Corolla", engine: "1.8L L4", position: "Downstream" },
    { year: 2016, make: "Toyota", model: "Corolla", engine: "1.8L L4", position: "Downstream" },
    { year: 2017, make: "Toyota", model: "Corolla", engine: "1.8L L4", position: "Downstream" },
    { year: 2018, make: "Toyota", model: "Corolla", engine: "1.8L L4", position: "Downstream" },
    { year: 2019, make: "Toyota", model: "Corolla", engine: "1.8L L4", position: "Downstream" },
  ],
};

async function main() {
  const tenant = await prisma.tenant.upsert({
    where: { slug: "xinda-sensor" },
    update: {},
    create: {
      name: "鑫达汽车传感器",
      slug: "xinda-sensor",
      customDomain: "www.xinda-sensor.com",
      industryPreset: "auto_parts",
      settings: {
        logoUrl: "",
        primaryColor: "#9a3412",
        contactEmail: "sales@xinda-sensor.com",
        whatsappNumber: "+8613800000000",
        feishuWebhookUrl: process.env.FEISHU_WEBHOOK_URL || "",
        certImages: [],
      },
    },
  });

  const product = await prisma.product.upsert({
    where: { tenantId_sku: { tenantId: tenant.id, sku: MOCK.product.sku } },
    update: {
      title: MOCK.product.title,
      moq: MOCK.product.moq,
      priceRange: MOCK.product.priceRange,
      samplePrice: new Prisma.Decimal(MOCK.product.samplePrice),
      sampleStock: MOCK.product.sampleStock,
      pdfAttachment: MOCK.product.pdfAttachment,
      isPublished: MOCK.product.isPublished,
      specifications: MOCK.product.specifications,
    },
    create: {
      tenantId: tenant.id,
      sku: MOCK.product.sku,
      title: MOCK.product.title,
      moq: MOCK.product.moq,
      priceRange: MOCK.product.priceRange,
      samplePrice: new Prisma.Decimal(MOCK.product.samplePrice),
      sampleStock: MOCK.product.sampleStock,
      pdfAttachment: MOCK.product.pdfAttachment,
      isPublished: MOCK.product.isPublished,
      specifications: MOCK.product.specifications,
    },
  });

  await prisma.oeCrossReference.deleteMany({ where: { productId: product.id } });
  await prisma.oeCrossReference.createMany({
    data: MOCK.oe_numbers.map((oe) => ({ productId: product.id, ...oe })),
  });

  await prisma.fitment.deleteMany({ where: { productId: product.id } });
  await prisma.fitment.createMany({
    data: MOCK.fitments.map((fitment) => ({ productId: product.id, ...fitment })),
  });

  // Super admin (no tenant membership required)
  const superPassword = process.env.SUPER_ADMIN_PASSWORD || "ChangeMe123!";
  await prisma.user.upsert({
    where: { username: "superadmin" },
    update: {},
    create: {
      username: "superadmin",
      passwordHash: hashPassword(superPassword),
      role: "super_admin",
    },
  });

  // Optional demo tenant admin for the seeded factory
  const demoPassword = process.env.DEMO_ADMIN_PASSWORD || "Factory123!";
  const demoUser = await prisma.user.upsert({
    where: { username: "xinda" },
    update: {},
    create: {
      username: "xinda",
      passwordHash: hashPassword(demoPassword),
      role: "tenant_admin",
    },
  });
  await prisma.tenantMember.upsert({
    where: { tenantId_userId: { tenantId: tenant.id, userId: demoUser.id } },
    update: {},
    create: {
      tenantId: tenant.id,
      userId: demoUser.id,
      email: "xinda@xinda-sensor.com",
      role: "tenant_admin",
    },
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
