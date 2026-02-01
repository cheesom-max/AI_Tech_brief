import { NextRequest, NextResponse } from 'next/server';
import { getBriefings, getTotalBriefingsCount } from '@/lib/db/queries';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    const [briefings, total] = await Promise.all([
      getBriefings(limit, offset),
      getTotalBriefingsCount(),
    ]);

    return NextResponse.json({ briefings, total });
  } catch (error) {
    console.error('Error fetching archive:', error);
    return NextResponse.json(
      { error: 'Failed to fetch archive' },
      { status: 500 }
    );
  }
}
