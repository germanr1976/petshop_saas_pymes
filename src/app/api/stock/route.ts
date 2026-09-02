import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { addStockMovement } from '@/services/stock/stock-service';
import { requireTenantAccess } from '@/lib/auth';

export async function GET(request: Request) {
    const { tenantId } = await requireTenantAccess(request, ['ADMIN', 'VENDEDOR']);

    const stock = await prisma.product.findMany({
        where: { tenantId },
        select: {
            id: true,
            name: true,
            sku: true,
            stock: true,
        },
        orderBy: { name: 'asc' },
    });

    return NextResponse.json({ success: true, data: stock });
}

export async function POST(request: Request) {
    try {
        const { tenantId, userId } = await requireTenantAccess(request, ['ADMIN', 'VENDEDOR']);
        const body = await request.json();

        const movement = await addStockMovement({
            tenantId,
            productId: body.productId,
            userId,
            type: body.type,
            quantity: Number(body.quantity),
            reason: body.reason,
            notes: body.notes,
        });

        return NextResponse.json({ success: true, data: movement });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error al registrar movimiento';
        return NextResponse.json({ success: false, error: message }, { status: 400 });
    }
}
