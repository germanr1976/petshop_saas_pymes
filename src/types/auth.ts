export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'VENDEDOR' | 'CLIENTE';

export type UserScope = 'PLATFORM' | 'TENANT';

// TenantContext represents only tenant-scoped sessions
export type TenantContext = {
    tenantId: string; // non-null for tenant context
    userId: string;
    role: Role;
    email: string;
    tenantSlug?: string;
};

export type AuthSession = {
    sub: string;
    scope: UserScope;
    // tenantId may be null for PLATFORM users
    tenantId?: string | null;
    role: Role;
    email: string;
    tenantSlug?: string | null;
    iat?: number;
    exp?: number;
};
