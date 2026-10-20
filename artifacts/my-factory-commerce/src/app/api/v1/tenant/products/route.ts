import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireTenantAdmin } from "@/lib/auth-guard";
import { Prisma } from "@prisma/client";

export const runtime = "nodejs";

export async function PATCH(request: Request) {
  try {
    const session = await requireTenantAdmin();
    const body = await request.json();
    const { id, title, moq, samplePrice, isPublished } = body;
    if (!id) return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });

    const product = await prisma.product.findFirst({ where: { id, tenantId: session.tenantId } });
    if (!product) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });

    const updated = await prisma.product.update({
      where: { id },
      data: {
        title: title ?? product.title,
        moq: moq != null ? Number(moq) : product.moq,
        samplePrice: samplePrice != null ? new Prisma.Decimal(samplePrice) : product.samplePrice,
        isPublished: isPublished != null ? Boolean(isPublished) : product.isPublished,
      },
    });
    return NextResponse.json({ id: updated.id, sku: updated.sku });
  } catch (error) {
    if (error instanceof Response) {
      const data = await error.json().catch(() => ({ error: "AUTH_FAILED" }));
      return NextResponse.json(data, { status: error.status });
    }
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
