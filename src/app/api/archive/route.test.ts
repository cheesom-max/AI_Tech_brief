/**
 * @jest-environment node
 */

import { GET } from './route';
import { NextRequest } from 'next/server';

// Mock the database queries
jest.mock('@/lib/db/queries', () => ({
  getBriefings: jest.fn(),
  getTotalBriefingsCount: jest.fn(),
}));

import { getBriefings, getTotalBriefingsCount } from '@/lib/db/queries';

describe('GET /api/archive', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return briefings list with total count', async () => {
    const mockBriefings = [
      {
        id: 'briefing-1',
        date: '2024-01-15',
        newsCount: 12,
        topNews: {
          id: 'news-1',
          title: 'Top News Title',
        },
      },
    ];

    (getBriefings as jest.Mock).mockResolvedValue(mockBriefings);
    (getTotalBriefingsCount as jest.Mock).mockResolvedValue(30);

    const request = new NextRequest('http://localhost:3000/api/archive');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.briefings).toHaveLength(1);
    expect(data.total).toBe(30);
  });

  it('should use custom limit and offset when provided', async () => {
    (getBriefings as jest.Mock).mockResolvedValue([]);
    (getTotalBriefingsCount as jest.Mock).mockResolvedValue(0);

    const request = new NextRequest('http://localhost:3000/api/archive?limit=5&offset=10');
    await GET(request);

    expect(getBriefings).toHaveBeenCalledWith(5, 10);
  });

  it('should use default limit and offset when not provided', async () => {
    (getBriefings as jest.Mock).mockResolvedValue([]);
    (getTotalBriefingsCount as jest.Mock).mockResolvedValue(0);

    const request = new NextRequest('http://localhost:3000/api/archive');
    await GET(request);

    expect(getBriefings).toHaveBeenCalledWith(10, 0);
  });
});
