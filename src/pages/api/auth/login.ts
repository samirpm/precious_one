import type { APIRoute } from 'astro';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { verifyPassword } from '@/lib/password';
import { createSessionToken, setSessionCookie } from '@/lib/auth';

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

export const POST: APIRoute = async ({ cookies, request }) => {
  let raw: unknown;
  const contentType = request.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    raw = await request.json().catch(() => null);
  } else {
    const fd = await request.formData();
    raw = { email: fd.get('email'), password: fd.get('password') };
  }

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: 'Invalid credentials.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { email, password } = parsed.data;
  const admin = await prisma.admin.findUnique({ where: { email } });

  // Same generic message whether the email exists or the password is wrong.
  const ok = admin ? await verifyPassword(password, admin.passwordHash) : false;
  if (!admin || !ok) {
    return new Response(JSON.stringify({ error: 'Invalid credentials.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  setSessionCookie(cookies, createSessionToken(admin));
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
