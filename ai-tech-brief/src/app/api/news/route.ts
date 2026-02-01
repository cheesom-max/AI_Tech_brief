import { NextRequest, NextResponse } from 'next/server';
import { getNewsByDate, getTotalNewsCount } from '@/lib/db/queries';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get('date') || undefined;
    const source = searchParams.get('source') || undefined;
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    const [news, total] = await Promise.all([
      getNewsByDate(date, source, limit, offset),
      getTotalNewsCount(date, source),
    ]);

    return NextResponse.json({ news, total });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}
