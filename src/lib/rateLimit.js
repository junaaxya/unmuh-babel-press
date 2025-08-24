import rateLimit from 'next-rate-limit';
import { NextResponse } from 'next/server';

// Configure a shared rate limiter: 1 minute interval
const limiter = rateLimit({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 500,
});

/**
 * Apply rate limiting based on the request IP address.
 * Returns a NextResponse with 429 status when the limit is exceeded,
 * otherwise returns null allowing the request to proceed.
 */
export async function applyRateLimit(request, limit = 10) {
  const ip =
    request.ip ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    '127.0.0.1';

  try {
    // next-rate-limit expects an object with setHeader, so provide a minimal stub
    await limiter.check({ setHeader: () => {} }, limit, ip);
    return null;
  } catch {
    return NextResponse.json(
      { error: 'Terlalu banyak permintaan. Coba lagi nanti.' },
      { status: 429 }
    );
  }
}
