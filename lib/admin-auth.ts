import { NextResponse, type NextRequest } from 'next/server';

export function requireAdminApiToken(request: NextRequest): NextResponse | null {
  const expectedToken = process.env.ADMIN_API_TOKEN;

  if (!expectedToken) {
    return NextResponse.json(
      { error: 'Admin API token is not configured.' },
      { status: 503 },
    );
  }

  const authorization = request.headers.get('authorization');
  const providedToken = authorization?.startsWith('Bearer ')
    ? authorization.slice('Bearer '.length)
    : null;

  if (providedToken !== expectedToken) {
    return NextResponse.json({ error: 'Unauthorized admin request.' }, { status: 401 });
  }

  return null;
}
