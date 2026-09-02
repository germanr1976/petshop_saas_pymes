import { NextResponse } from 'next/server';
import { loginUser } from '@/services/auth/auth-service';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const result = await loginUser({
            email: body.email,
            password: body.password,
            tenantSlug: body.tenantSlug,
        });

        const response = NextResponse.json({ success: true, data: result });
        response.cookies.set('session', result.token, {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
        });

        return response;
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error al iniciar sesión';

        // Ambiguity: multiple users with same email across tenants
        if (message === 'Ambigüedad: se requiere tenantSlug para usuarios tenant') {
            return NextResponse.json({ success: false, error: message, requiresTenant: true }, { status: 409 });
        }

        if (message === 'No se encontró usuario para ese tenant') {
            return NextResponse.json({ success: false, error: message }, { status: 404 });
        }

        // Generic bad request for other auth errors
        return NextResponse.json({ success: false, error: message }, { status: 400 });
    }
}
