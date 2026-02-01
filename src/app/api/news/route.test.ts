/**
 * @jest-environment node
 */

import { GET } from './route';
import { NextRequest } from 'next/server';

// Mock the database queries
jest.mock('@/lib/db/queries', () => ({
  getNewsByDate: jest.fn(),
  getTotalNewsCount: jest.fn(),
}));

import { getNewsByDate, getTotalNewsCount } from '@/lib/db/queries';

describe('GET /api/news', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return news list with total count', async () => {
    const mockNews = [
      {
        id: 'news-1',
        title: 'Test News',
        source: 'openai',
        sourceName: 'OpenAI Blog',
        publishedAt: '2024-01-15T09:00:00Z',
        thumbnailUrl: 'https://example.com/img.jpg',
        summary: ['Summary 1', 'Summary 2', 'Summary 3'],
      },
    ];

    (getNewsByDate as jest.Mock).mockResolvedValue(mockNews);
    (getTotalNewsCount as jest.Mock).mockResolvedValue(1);

    const request = new NextRequest('http://localhost:3000/api/news?date=2024-01-15');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.news).toHaveLength(1);
    expect(data.total).toBe(1);
  });

  it('should filter by source when provided', async () => {
    (getNewsByDate as jest.Mock).mockResolvedValue([]);
    (getTotalNewsCount as jest.Mock).mockResolvedValue(0);

    const request = new NextRequest('http://localhost:3000/api/news?date=2024-01-15&source=openai');
    await GET(request);

    expect(getNewsByDate).toHaveBeenCalledWith('2024-01-15', 'openai', 20, 0);
  });

  it('should use default limit and offset when not provided', async () => {
    (getNewsByDate as jest.Mock).mockResolvedValue([]);
    (getTotalNewsCount as jest.Mock).mockResolvedValue(0);

    const request = new NextRequest('http://localhost:3000/api/news?date=2024-01-15');
    await GET(request);

    expect(getNewsByDate).toHaveBeenCalledWith('2024-01-15', undefined, 20, 0);
  });

  it('should return all news when date not provided', async () => {
    (getNewsByDate as jest.Mock).mockResolvedValue([]);
    (getTotalNewsCount as jest.Mock).mockResolvedValue(0);

    const request = new NextRequest('http://localhost:3000/api/news');
    await GET(request);

    // Should be called with undefined date (returns all news)
    expect(getNewsByDate).toHaveBeenCalledWith(undefined, undefined, 20, 0);
  });
});
