import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { method, nextUrl } = request;
  const timestamp = new Date().toISOString();
  
  console.log(`[${timestamp}] ${method} ${nextUrl.pathname}${nextUrl.search}`);
  
  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*', // Apply only to API routes
};