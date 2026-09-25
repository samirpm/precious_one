import { createHmac, timingSafeEqual } from 'node:crypto';
import type { AstroCookies } from 'astro';

/**
 * Stateless admin sessions: an HMAC-SHA256-signed JSON payload stored in an
 * HTTP-only cookie. No credentials or secrets are ever exposed to the client.
 *
 * Token format: base64url(payloadJSON) + '.' + base64url(HMAC(payload))
 */

export const SESSION_COOKIE = 'admin_session';
const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 hours

interface SessionPayload {
  sub: string; // admin id
  email: string;
  exp: number; // unix seconds
}

export interface AdminSession {
  id: string;
  email: string;
}

function getSecret(): string {
  const secret = import.meta.env.AUTH_SECRET ?? process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error('AUTH_SECRET is missing or too short — set it in .env');
  }
  return secret;
}

function sign(data: string): string {
  return createHmac('sha256', getSecret()).update(data).digest('base64url');
}

export function createSessionToken(admin: { id: string; email: string }): string {
  const payload: SessionPayload = {
    sub: admin.id,
    email: admin.email,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  const body = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  return `${body}.${sign(body)}`;
}

export function verifySessionToken(token: string): SessionPayload | null {
  const dot = token.lastIndexOf('.');
  if (dot <= 0) return null;

  const body = token.slice(0, dot);
  const sig = Buffer.from(token.slice(dot + 1));
  const expected = Buffer.from(sign(body));
  if (sig.length !== expected.length || !timingSafeEqual(sig, expected)) return null;

  try {
    const payload = JSON.parse(
      Buffer.from(body, 'base64url').toString('utf8'),
    ) as SessionPayload;
    if (!payload.exp || payload.exp * 1000 < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

/** Read + verify the session from cookies. Returns null when unauthenticated. */
export function getSession(cookies: AstroCookies): AdminSession | null {
  const token = cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const payload = verifySessionToken(token);
  if (!payload) return null;
  return { id: payload.sub, email: payload.email };
}

export function setSessionCookie(cookies: AstroCookies, token: string): void {
  cookies.set(SESSION_COOKIE, token, {
    path: '/',
    httpOnly: true,
    secure: import.meta.env.PROD, // cookies over HTTPS in prod, plain HTTP in dev
    sameSite: 'lax',
    maxAge: SESSION_TTL_SECONDS,
  });
}

export function clearSessionCookie(cookies: AstroCookies): void {
  cookies.delete(SESSION_COOKIE, { path: '/' });
}
