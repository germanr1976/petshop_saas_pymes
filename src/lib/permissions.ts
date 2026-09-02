import { Role } from '@/types/auth';

export const ROLE_PERMISSIONS: Record<Role, Role[]> = {
    SUPER_ADMIN: ['SUPER_ADMIN', 'ADMIN', 'VENDEDOR', 'CLIENTE'],
    ADMIN: ['ADMIN', 'VENDEDOR', 'CLIENTE'],
    VENDEDOR: ['VENDEDOR', 'CLIENTE'],
    CLIENTE: ['CLIENTE'],
};

export function canAccess(userRole: Role, requiredRole: Role): boolean {
    return ROLE_PERMISSIONS[userRole]?.includes(requiredRole) ?? false;
}
