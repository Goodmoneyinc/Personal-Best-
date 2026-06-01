import { NextResponse, type NextRequest } from 'next/server';

function isAuthorized(request: NextRequest) {
  const password = process.env.ADMIN_BASIC_PASSWORD;

  if (!password) {
    return false;
  }

  const username = process.env.ADMIN_BASIC_USER ?? 'admin';
  const authorization = request.headers.get('authorization');

  if (!authorization?.startsWith('Basic ')) {
    return false;
  }

  try {
    const decoded = atob(authorization.slice('Basic '.length));
    const separatorIndex = decoded.indexOf(':');

    if (separatorIndex === -1) {
      return false;
    }

    const providedUsername = decoded.slice(0, separatorIndex);
    const providedPassword = decoded.slice(separatorIndex + 1);

    return providedUsername === username && providedPassword === password;
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  if (isAuthorized(request)) {
    return NextResponse.next();
  }

  return new NextResponse('Admin authentication required.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Fulatelier Admin", charset="UTF-8"',
    },
  });
}

export const config = {
  matcher: ['/admin/:path*'],
};
