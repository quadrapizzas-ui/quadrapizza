import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  
  // Decodificamos el pathname para capturar la "ñ" sin importar cómo la envíe el browser
  const decodedPathname = decodeURIComponent(url.pathname);
  
  if (decodedPathname.includes('/dueño')) {
    // Si entran por /dueño, los mandamos internamente a /dueno sin que cambie la URL necesariamente
    // o haciendo un rewrite. Pero para evitar líos de cache, haremos un Redirect formal.
    url.pathname = decodedPathname.replace('/dueño', '/dueno');
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dueño', '/dueño/:path*', '/due%C3%B1o', '/due%C3%B1o/:path*'],
};
