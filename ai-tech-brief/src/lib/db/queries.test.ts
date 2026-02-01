import { getSourceName } from './queries';

// Mock the client module
jest.mock('./client', () => ({
  getDbClient: jest.fn(() => ({
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      upsert: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      gte: jest.fn().mockReturnThis(),
      lt: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      range: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
    }),
  })),
}));

describe('Database Queries', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getSourceName', () => {
    it('should return source name for known sources', () => {
      expect(getSourceName('openai')).toBe('OpenAI Blog');
      expect(getSourceName('deepmind')).toBe('Google DeepMind');
      expect(getSourceName('anthropic')).toBe('Anthropic');
      expect(getSourceName('huggingface')).toBe('Hugging Face');
      expect(getSourceName('techcrunch')).toBe('TechCrunch');
      expect(getSourceName('verge')).toBe('The Verge');
      expect(getSourceName('venturebeat')).toBe('VentureBeat');
      expect(getSourceName('mit')).toBe('MIT Tech Review');
    });

    it('should return source id for unknown sources', () => {
      expect(getSourceName('unknown')).toBe('unknown');
    });
  });
});
