import { NextResponse } from 'next/server';
import { verifyToken } from './lib/jwt';

export async function middleware(request) {
  // Get the pathname from the URL
  const path = request.nextUrl.pathname;
  
  // Define public paths that don't require authentication
  const isPublicPath = 
    path === '/' || 
    path === '/login' || 
    path === '/signup' || 
    path === '/emergency-report' ||
    path.startsWith('/api/auth/') ||
    path.startsWith('/api/test/') || 
    path.startsWith('/u/') || 
    path.startsWith('/a/') || 
    path.startsWith('/sa/') ||
    path.startsWith('/')
    ;
  
  // Get the token from the cookies
  const token = request.cookies.get('token')?.value;

  // If the path is public, allow access
  if (isPublicPath) {
    return NextResponse.next();
  }

  // If no token is present and the path is not public, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // Verify the token
    const decoded = await verifyToken(token);
    
    // Check for role-based access
    const isAdminRoute = path.startsWith('/admin') || path.startsWith('/api/a/');
    const isSuperAdminRoute = path.startsWith('/superadmin') || path.startsWith('/api/sa/');
    const isUserRoute = path.startsWith('/dashboard') || path.startsWith('/api/u/');

    // Redirect based on role permissions
    if (isAdminRoute && decoded.role !== 'admin' && decoded.role !== 'superAdmin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
    
    if (isSuperAdminRoute && decoded.role !== 'superAdmin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
    
    if (isUserRoute && decoded.role !== 'user' && decoded.role !== 'admin' && decoded.role !== 'superAdmin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    // Allow access to protected routes if proper authentication and authorization
    return NextResponse.next();
  } catch (error) {
    // If token verification fails, redirect to login
    console.error('Auth middleware error:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

// Configure which routes should trigger this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};