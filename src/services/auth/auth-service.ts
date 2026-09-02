import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { createSessionToken } from '@/lib/auth';
import { Role } from '@/types/auth';

export async function loginUser(input: { email: string; password: string; tenantSlug?: string | null }) {
    if (!input.email || !input.password) {
        throw new Error('Email y password son requeridos');
    }

    const email = input.email.trim().toLowerCase();
    // Find users by email. If tenantSlug provided, use it to disambiguate.
    const users = await prisma.user.findMany({
        where: { email },
        include: { tenant: true },
    });

    if (!users || users.length === 0) {
        throw new Error('Credenciales inválidas');
    }

    let user = null as any;
    if (input.tenantSlug) {
        user = users.find((u) => u.tenant && u.tenant.slug === input.tenantSlug) ?? null;
        if (!user) {
            throw new Error('No se encontró usuario para ese tenant');
        }
    } else {
        if (users.length > 1) {
            throw new Error('Ambigüedad: se requiere tenantSlug para usuarios tenant');
        }
        user = users[0];
    }

    if (!user) {
        throw new Error('Credenciales inválidas');
    }

    const isValidPassword = await bcrypt.compare(input.password, user.passwordHash);
    if (!isValidPassword) {
        throw new Error('Credenciales inválidas');
    }

    // Validate scope and tenant association rules
    const scope = user.scope;

    if (scope === 'PLATFORM') {
        // PLATFORM users must not be tied to a tenant
        if (user.tenantId) {
            throw new Error('Usuario platform no puede tener tenant asociado');
        }
    } else {
        // TENANT-scoped user must have a tenant
        if (!user.tenantId || !user.tenant) {
            throw new Error('Usuario tenant sin tenant asociado');
        }
    }

    const token = await createSessionToken({
        sub: user.id,
        scope: scope,
        tenantId: user.tenantId ?? null,
        tenantSlug: user.tenant ? user.tenant.slug : null,
        email: user.email,
        role: user.role,
    });

    return {
        user: {
            id: user.id,
            tenantId: user.tenantId,
            tenantSlug: user.tenant ? user.tenant.slug : null,
            email: user.email,
            role: user.role,
        },
        token,
    };
}

// permission assertions are provided by src/lib/auth.ts and src/lib/permissions.ts
