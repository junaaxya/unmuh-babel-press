import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

let cached = { total: 0, previous: 0, fetchedAt: 0 };
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

function getClient() {
  return import('@google-analytics/data').then(({ BetaAnalyticsDataClient }) => {
    return new BetaAnalyticsDataClient({
      credentials: {
        client_email: process.env.GA_CLIENT_EMAIL,
        private_key: process.env.GA_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
    });
  });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = Date.now();
  if (cached.fetchedAt && now - cached.fetchedAt < CACHE_TTL) {
    return NextResponse.json({ total: cached.total, previous: cached.previous });
  }

  try {
    const client = await getClient();
    const [response] = await client.runReport({
      property: `properties/${process.env.GA_PROPERTY_ID}`,
      dateRanges: [
        { startDate: '30daysAgo', endDate: 'today' },
        { startDate: '60daysAgo', endDate: '30daysAgo' },
      ],
      metrics: [{ name: 'activeUsers' }],
    });
    const current = Number(response.rows?.[0]?.metricValues?.[0]?.value || 0);
    const previous = Number(response.rows?.[0]?.metricValues?.[1]?.value || 0);

    cached = { total: current, previous, fetchedAt: now };
    return NextResponse.json({ total: current, previous });
  } catch (err) {
    console.error('Error fetching analytics data', err);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
