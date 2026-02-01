import { NextRequest, NextResponse } from 'next/server';
import { getNewsById } from '@/lib/db/queries';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const news = await getNewsById(params.id);

    if (!news) {
      return NextResponse.json(
        { error: 'News not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(news);
  } catch (error) {
    console.error('Error fetching news detail:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news detail' },
      { status: 500 }
    );
  }
}
