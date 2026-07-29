import { NextRequest } from 'next/server';

export const runtime = 'edge';

// Checks the coach password. The password itself lives in the APP_PASSWORD
// environment variable — never in this file, because the repo is public.
export async function POST(request: NextRequest) {
  const expected = process.env.APP_PASSWORD;

  if (!expected) {
    return new Response('APP_PASSWORD is not set on the server.', { status: 500 });
  }

  let password = '';
  try {
    const body = await request.json();
    password = typeof body?.password === 'string' ? body.password : '';
  } catch {
    return new Response('Bad request', { status: 400 });
  }

  if (password !== expected) {
    return new Response('Wrong password', { status: 401 });
  }

  return new Response('ok');
}
