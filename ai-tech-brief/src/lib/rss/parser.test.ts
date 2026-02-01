import type { FeedItem } from '@/types';
import { deduplicateByUrl } from './parser';

// Mock rss-parser at module level before imports
const mockParseURL = jest.fn();

jest.mock('rss-parser', () => {
  return jest.fn().mockImplementation(() => ({
    parseURL: mockParseURL,
  }));
});

describe('RSS Parser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the module to get fresh parser instance
    jest.resetModules();
  });

  describe('fetchFeed', () => {
    it('should parse RSS feed and return FeedItems', async () => {
      const mockFeed = {
        items: [
          {
            title: 'Test Article',
            link: 'https://example.com/article',
            pubDate: '2024-01-15T09:00:00Z',
            content: 'Article content',
            contentSnippet: 'Article snippet',
          },
        ],
      };
      mockParseURL.mockResolvedValue(mockFeed);

      // Re-import after mock setup
      const { fetchFeed } = require('./parser');
      const result = await fetchFeed('https://example.com/rss', 'test-source');

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        title: 'Test Article',
        link: 'https://example.com/article',
        pubDate: '2024-01-15T09:00:00Z',
        content: 'Article content',
        source: 'test-source',
      });
    });

    it('should return empty array on error', async () => {
      mockParseURL.mockRejectedValue(new Error('Network error'));

      const { fetchFeed } = require('./parser');
      const result = await fetchFeed('https://invalid.url/rss', 'test-source');

      expect(result).toEqual([]);
    });

    it('should use contentSnippet if content is empty', async () => {
      const mockFeed = {
        items: [
          {
            title: 'Test Article',
            link: 'https://example.com/article',
            pubDate: '2024-01-15T09:00:00Z',
            content: '',
            contentSnippet: 'Article snippet',
          },
        ],
      };
      mockParseURL.mockResolvedValue(mockFeed);

      const { fetchFeed } = require('./parser');
      const result = await fetchFeed('https://example.com/rss', 'test-source');

      expect(result[0].content).toBe('Article snippet');
    });
  });

  describe('deduplicateByUrl', () => {
    it('should remove duplicate items by link', () => {
      const items: FeedItem[] = [
        {
          title: 'Article 1',
          link: 'https://example.com/article1',
          pubDate: '2024-01-15T09:00:00Z',
          content: 'Content 1',
          source: 'source1',
        },
        {
          title: 'Article 1 Duplicate',
          link: 'https://example.com/article1',
          pubDate: '2024-01-15T10:00:00Z',
          content: 'Content 1 Duplicate',
          source: 'source2',
        },
        {
          title: 'Article 2',
          link: 'https://example.com/article2',
          pubDate: '2024-01-15T11:00:00Z',
          content: 'Content 2',
          source: 'source1',
        },
      ];

      const result = deduplicateByUrl(items);

      expect(result).toHaveLength(2);
      expect(result[0].title).toBe('Article 1');
      expect(result[1].title).toBe('Article 2');
    });

    it('should return empty array for empty input', () => {
      const result = deduplicateByUrl([]);
      expect(result).toEqual([]);
    });
  });

  describe('fetchAllFeeds', () => {
    it('should fetch from all RSS sources', async () => {
      const mockFeed = {
        items: [
          {
            title: 'Test Article',
            link: 'https://example.com/article',
            pubDate: '2024-01-15T09:00:00Z',
            content: 'Article content',
          },
        ],
      };
      mockParseURL.mockResolvedValue(mockFeed);

      const { fetchAllFeeds } = require('./parser');
      const result = await fetchAllFeeds();

      // Should have called parseURL for each RSS source (8 sources)
      expect(mockParseURL).toHaveBeenCalledTimes(8);
      // Result should contain items (deduplicated, so at least 1)
      expect(result.length).toBeGreaterThanOrEqual(1);
    });

    it('should handle partial failures gracefully', async () => {
      let callCount = 0;
      mockParseURL.mockImplementation(() => {
        callCount++;
        if (callCount === 2) {
          return Promise.reject(new Error('Network error'));
        }
        return Promise.resolve({
          items: [
            {
              title: `Article ${callCount}`,
              link: `https://example.com/article${callCount}`,
              pubDate: '2024-01-15T09:00:00Z',
              content: `Content ${callCount}`,
            },
          ],
        });
      });

      const { fetchAllFeeds } = require('./parser');
      const result = await fetchAllFeeds();

      // Should still return results despite some failures
      expect(result.length).toBeGreaterThan(0);
    });
  });
});
