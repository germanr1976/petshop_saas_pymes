import { NextResponse } from 'next/server';
import { listCategoriesByTenant, createCategory } from '@/services/categories/category-service';
import { requireTenantAccess } from '@/lib/auth';

export async function GET(request: Request) {
    const { tenantId } = await requireTenantAccess(request, ['ADMIN', 'VENDEDOR']);
    const categories = await listCategoriesByTenant(tenantId);
    return NextResponse.json({ success: true, data: categories });
}

export async function POST(request: Request) {
    try {
        const { tenantId } = await requireTenantAccess(request, ['ADMIN']);
        const body = await request.json();

        const category = await createCategory({
            tenantId,
            name: body.name,
            slug: body.slug,
        });

        return NextResponse.json({ success: true, data: category });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error al crear categoría';
        return NextResponse.json({ success: false, error: message }, { status: 400 });
    }
}
