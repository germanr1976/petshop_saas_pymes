import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export async function addStockMovement(data: {
    tenantId: string;
    productId: string;
    userId?: string;
    type: 'IN' | 'OUT' | 'ADJUSTMENT' | 'RETURN';
    quantity: number;
    reason?: string;
    notes?: string;
}) {
    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const product = await tx.product.findUniqueOrThrow({
            where: { id: data.productId },
        });

        if (product.tenantId !== data.tenantId) {
            throw new Error('Producto no pertenece al tenant actual');
        }

        const nextStock =
            data.type === 'OUT'
                ? product.stock - data.quantity
                : product.stock + data.quantity;

        const movement = await tx.stockMovement.create({
            data: {
                tenantId: data.tenantId,
                productId: data.productId,
                userId: data.userId,
                type: data.type,
                quantity: data.quantity,
                reason: data.reason,
                notes: data.notes,
            },
        });

        await tx.product.update({
            where: { id: data.productId },
            data: { stock: nextStock },
        });

        return movement;
    });
}
