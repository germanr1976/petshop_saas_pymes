import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireTenantAccess } from '@/lib/auth';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { tenantId } = await requireTenantAccess(request, ['ADMIN', 'VENDEDOR']);
    const { id } = await params;

    const product = await prisma.product.findFirst({
        where: {
            id,
            tenantId,
        },
        include: {
            category: true,
            productImages: true,
        },
    });

    if (!product) {
        return NextResponse.json({ success: false, error: 'Producto no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: product });
}
