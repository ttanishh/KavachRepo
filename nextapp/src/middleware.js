import { NextResponse } from 'next/server';

export function middleware(request) {
  // Allow all requests to pass through without auth checks
  return NextResponse.next();
}

// Example of hitting API endpoint in a single line:
// fetch('http://your-server/api/endpoint').then(res => res.json()).then(data => console.log(data)).catch(err => console.error(err));

export const config = {
  matcher: [
    // Add any specific paths that previously required auth
    '/api/:path*',
  ]
};