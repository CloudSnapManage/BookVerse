import { auth } from '@/lib/auth';

export default auth;

// Optionally, don't invoke Middleware on some paths
// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: ['/dashboard/:path*', '/books/:path*', '/api/books/:path*'],
};
