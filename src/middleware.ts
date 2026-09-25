import { defineMiddleware } from 'astro:middleware';
import { getSession } from '@/lib/auth';

/**
 * Admin gate.
 *
 * - /admin/* pages (except /admin/login) require a valid session; otherwise
 *   redirect to the login page.
 * - /api/admin/* mutations return 401 JSON when unauthenticated — the UI
 *   hiding buttons is never the security boundary.
 * - /api/auth/* is left alone (login/logout manage their own cookies).
 * - Public pages are not touched.
 */
export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  context.locals.admin = getSession(context.cookies);

  const isAdminPage = pathname.startsWith('/admin');
  const isLoginPage = pathname === '/admin/login';
  const isAdminApi = pathname.startsWith('/api/admin');
  const isAuthApi = pathname.startsWith('/api/auth');

  if (isAuthApi) return next();

  if (isAdminApi) {
    if (!context.locals.admin) {
      return new Response(JSON.stringify({ error: 'Unauthorized.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return next();
  }

  if (isAdminPage && !isLoginPage && !context.locals.admin) {
    return context.redirect('/admin/login');
  }

  // Already signed in → skip the login page
  if (isLoginPage && context.locals.admin) {
    return context.redirect('/admin');
  }

  return next();
});
