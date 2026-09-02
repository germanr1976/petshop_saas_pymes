import { NextResponse } from 'next/server';
import { createProduct, listProductsByTenant } from '@/services/products/product-service';
import { requireTenantAccess } from '@/lib/auth';

export async function GET(request: Request) {
    const { tenantId } = await requireTenantAccess(request, ['ADMIN', 'VENDEDOR']);

    const products = await listProductsByTenant(tenantId);
    return NextResponse.json({ success: true, data: products });
}

export async function POST(request: Request) {
    try {
        const { tenantId } = await requireTenantAccess(request, ['ADMIN', 'VENDEDOR']);
        const body = await request.json();

        const product = await createProduct({
            tenantId,
            categoryId: body.categoryId,
            sku: body.sku,
            name: body.name,
            slug: body.slug,
            description: body.description,
            shortDescription: body.shortDescription,
            price: Number(body.price),
            cost: body.cost ? Number(body.cost) : undefined,
            stock: Number(body.stock ?? 0),
            status: body.status,
            images: Array.isArray(body.images) ? body.images : undefined,
        });

        return NextResponse.json({ success: true, data: product });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error al crear producto';
        return NextResponse.json({ success: false, error: message }, { status: 400 });
    }
}
