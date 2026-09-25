import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ locals }) => {
  if (!locals.admin) {
    return new Response(JSON.stringify({ error: 'Unauthorized.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  return new Response(JSON.stringify({ admin: locals.admin }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
