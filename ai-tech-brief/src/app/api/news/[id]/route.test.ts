/**
 * @jest-environment node
 */

import { GET } from './route';
import { NextRequest } from 'next/server';

// Mock the database queries
jest.mock('@/lib/db/queries', () => ({
  getNewsById: jest.fn(),
}));

import { getNewsById } from '@/lib/db/queries';

describe('GET /api/news/[id]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return news detail by id', async () => {
    const mockNewsDetail = {
      id: 'news-1',
      title: 'Test News',
      source: 'openai',
      sourceName: 'OpenAI Blog',
      publishedAt: '2024-01-15T09:00:00Z',
      thumbnailUrl: 'https://example.com/img.jpg',
      summary: ['Summary 1', 'Summary 2', 'Summary 3'],
      originalUrl: 'https://openai.com/blog/test',
      content: 'Full content here...',
      insight: 'Technical insight',
    };

    (getNewsById as jest.Mock).mockResolvedValue(mockNewsDetail);

    const request = new NextRequest('http://localhost:3000/api/news/news-1');
    const response = await GET(request, { params: { id: 'news-1' } });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.id).toBe('news-1');
    expect(data.originalUrl).toBe('https://openai.com/blog/test');
    expect(data.content).toBe('Full content here...');
    expect(data.insight).toBe('Technical insight');
  });

  it('should return 404 when news not found', async () => {
    (getNewsById as jest.Mock).mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3000/api/news/non-existent');
    const response = await GET(request, { params: { id: 'non-existent' } });

    expect(response.status).toBe(404);
  });
});
