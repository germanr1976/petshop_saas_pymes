import { prisma } from '@/lib/prisma';

export async function listProductsByTenant(tenantId: string) {
    return prisma.product.findMany({
        where: {
            tenantId,
            status: 'ACTIVE',
        },
        include: {
            category: true,
            productImages: {
                orderBy: { sortOrder: 'asc' },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
}

export async function createProduct(data: {
    tenantId: string;
    categoryId?: string;
    sku: string;
    name: string;
    slug: string;
    description?: string;
    shortDescription?: string;
    price: number;
    cost?: number;
    stock?: number;
    status?: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
    images?: Array<{
        url: string;
        altText?: string;
        sortOrder?: number;
        isPrimary?: boolean;
    }>;
}) {
    return prisma.product.create({
        data: {
            tenantId: data.tenantId,
            categoryId: data.categoryId,
            sku: data.sku,
            name: data.name,
            slug: data.slug,
            description: data.description,
            shortDescription: data.shortDescription,
            price: data.price,
            cost: data.cost,
            stock: data.stock ?? 0,
            status: data.status ?? 'ACTIVE',
            productImages: data.images && data.images.length > 0
                ? {
                    create: data.images.map((image) => ({
                        tenantId: data.tenantId,
                        url: image.url,
                        altText: image.altText,
                        sortOrder: image.sortOrder ?? 0,
                        isPrimary: image.isPrimary ?? false,
                    })),
                }
                : undefined,
        },
        include: {
            category: true,
            productImages: true,
        },
    });
}
