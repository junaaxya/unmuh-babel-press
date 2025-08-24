import rateLimit from 'next-rate-limit';
import { NextResponse } from 'next/server';

// Configure a shared rate limiter: 1 minute interval
const limiter = rateLimit({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 500,
});

/**
 * Apply rate limiting based on the request.
 * Returns a NextResponse with 429 status when the limit is exceeded,
 * otherwise returns null allowing the request to proceed.
 *
 * When a `url` is provided, it will be included in the JSON body to
 * satisfy clients (like NextAuth) that expect a redirect URL even on
 * error responses.
 */
export async function applyRateLimit(request, limit = 10, url) {
  try {
    limiter.checkNext(request, limit);
    return null;
  } catch {
    const body = url
      ? { url }
      : { error: 'Terlalu banyak permintaan. Coba lagi nanti.' };
    return NextResponse.json(body, { status: 429 });
  }
}
