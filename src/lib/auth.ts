import { SignJWT, jwtVerify } from 'jose';
import { AuthSession, Role, TenantContext, UserScope } from '@/types/auth';

const AUTH_SECRET = new TextEncoder().encode(process.env.AUTH_SECRET ?? 'dev-auth-secret-change-me');

export function hasPermission(userRole: Role, required: Role[]): boolean {
    return required.includes(userRole);
}

export function assertPermission(userRole: Role, required: Role[]) {
    if (!hasPermission(userRole, required)) {
        throw new Error('No tienes permisos para esta acción');
    }
}

export async function createSessionToken(session: AuthSession): Promise<string> {
    return new SignJWT(session)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(AUTH_SECRET);
}

export async function verifySessionToken(token: string): Promise<AuthSession | null> {
    try {
        const { payload } = await jwtVerify(token, AUTH_SECRET);
        return payload as AuthSession;
    } catch {
        return null;
    }
}

function getTokenFromRequest(request: Request): string | null {
    const authHeader = request.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
        return authHeader.replace('Bearer ', '').trim();
    }

    const cookieHeader = request.headers.get('cookie') ?? '';
    const match = cookieHeader.match(/(?:^|;\s*)session=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : null;
}

export async function getSessionFromRequest(request: Request): Promise<AuthSession | null> {
    const token = getTokenFromRequest(request);
    if (!token) {
        return null;
    }

    return verifySessionToken(token);
}

export async function getTenantContext(request?: Request): Promise<TenantContext> {
    if (!request) {
        throw new Error('Se requiere una petición con sesión activa');
    }

    const session = await getSessionFromRequest(request);
    if (!session) {
        throw new Error('No autorizado');
    }

    if (session.scope !== 'TENANT') {
        throw new Error('Acceso exclusivo de tenant: sesión no es tenant-scoped');
    }

    if (!session.tenantId) {
        throw new Error('Usuario tenant sin tenant asociado');
    }

    return {
        tenantId: session.tenantId,
        userId: session.sub,
        role: session.role,
        email: session.email,
        tenantSlug: session.tenantSlug ?? undefined,
    };
}
export async function requireTenantAccess(request: Request, requiredRoles: Role[] = ['ADMIN']): Promise<TenantContext> {
    const context = await getTenantContext(request);
    assertPermission(context.role, requiredRoles);
    return context;
}

export async function requirePlatformAccess(request: Request): Promise<AuthSession> {
    const session = await getSessionFromRequest(request);
    if (!session) {
        throw new Error('No autorizado');
    }

    if (session.scope !== 'PLATFORM') {
        throw new Error('Acceso exclusivo de plataforma');
    }

    if (session.role !== 'SUPER_ADMIN') {
        throw new Error('Acceso exclusivo de plataforma: super-admin requerido');
    }

    if (session.tenantId) {
        throw new Error('Usuario platform no puede tener tenant asociado');
    }

    return session;
}
