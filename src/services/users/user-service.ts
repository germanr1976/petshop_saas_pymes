import { prisma } from '@/lib/prisma';

export async function listUsersByTenant(tenantId: string) {
    return prisma.user.findMany({
        where: { tenantId },
        orderBy: { createdAt: 'desc' },
    });
}

export async function createUser(data: {
    tenantId: string;
    name: string;
    email: string;
    passwordHash: string;
    role?: 'SUPER_ADMIN' | 'ADMIN' | 'VENDEDOR' | 'CLIENTE';
}) {
    return prisma.user.create({
        data: {
            tenantId: data.tenantId,
            name: data.name,
            email: data.email,
            passwordHash: data.passwordHash,
            role: data.role ?? 'ADMIN',
        },
    });
}
