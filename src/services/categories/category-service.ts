import { prisma } from '@/lib/prisma';

export async function listCategoriesByTenant(tenantId: string) {
    return prisma.category.findMany({
        where: { tenantId },
        orderBy: { createdAt: 'desc' },
    });
}

export async function createCategory(data: {
    tenantId: string;
    name: string;
    slug: string;
}) {
    return prisma.category.create({
        data: {
            tenantId: data.tenantId,
            name: data.name,
            slug: data.slug,
        },
    });
}
