import type { APIContext } from 'astro';
import { HttpError } from './errors';
import { formatZodError } from './validations';

/** Defence-in-depth: endpoints must never trust that middleware alone ran. */
export function requireAdmin(ctx: APIContext): { id: string; email: string } {
  if (!ctx.locals.admin) throw new HttpError(401, 'Unauthorized.');
  return ctx.locals.admin;
}

/**
 * Shared plumbing for the admin form-POST endpoints: they mutate via the
 * service layer, then redirect (303) back to the list page. Failures are
 * surfaced as an `?error=` query param rendered by the list page.
 */

export function redirectWithError(
  ctx: APIContext,
  backUrl: string,
  error: unknown,
): Response {
  let message = 'Something went wrong. Please try again.';
  if (error instanceof HttpError) {
    message = error.message;
  } else if (error && typeof error === 'object' && 'issues' in error) {
    message = `Validation failed. ${formatZodError(error as never)}`;
  } else if (error instanceof Error) {
    console.error('[admin-api]', error);
  }
  const url = new URL(backUrl, ctx.url.origin);
  url.searchParams.set('error', message);
  return ctx.redirect(url.pathname + url.search, 303);
}

/** FormData → plain object; `name[]` keys collect into arrays. */
export function formToObject(fd: FormData): Record<string, unknown> {
  const obj: Record<string, unknown> = {};
  for (const [key, value] of fd.entries()) {
    if (typeof value !== 'string') continue;
    if (key.endsWith('[]')) {
      const k = key.slice(0, -2);
      const list = (obj[k] as string[] | undefined) ?? [];
      list.push(value);
      obj[k] = list;
    } else if (!(key in obj)) {
      obj[key] = value;
    }
  }
  return obj;
}
