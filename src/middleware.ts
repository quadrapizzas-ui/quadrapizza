import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rutas protegidas y roles permitidos (MOCK para el frontend MVP)
const roleAccessMap: Record<string, string[]> = {
  '/recepcion': ['admin', 'recepcion'],
  '/cocina': ['admin', 'cocina'],
  '/delivery': ['admin', 'delivery'],
  '/gerencia': ['admin'],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Omitir middleware para assets estáticos y api routes (excepto auth si existiera)
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') || 
    pathname === '/favicon.ico' || 
    pathname === '/'
  ) {
    return NextResponse.next();
  }

  // MOCK: En este MVP de frontend, asumimos que NextJS puede leer una cookie "user_role".
  // Si no existe, permitimos el paso temporalmente para desarrollo.
  const userRoleCookie = request.cookies.get('user_role')?.value;
  
  if (!userRoleCookie) {
    // TODO: En producción, redirigir al login si no hay token.
    // return NextResponse.redirect(new URL('/', request.url));
    return NextResponse.next(); // Bypass for development
  }

  // Verificar si la ruta requiere un rol específico
  const requiredRoles = Object.entries(roleAccessMap).find(([route]) => pathname.startsWith(route))?.[1];

  if (requiredRoles && !requiredRoles.includes(userRoleCookie)) {
    // Si no tiene permisos, redirigir al home o a una pantalla de "Acceso Denegado"
    console.warn(`Access denied to ${pathname} for role ${userRoleCookie}`);
    return NextResponse.redirect(new URL('/acceso-denegado', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
