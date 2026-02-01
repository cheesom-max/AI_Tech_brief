import { generateSummary, generateInsight } from './summarizer';

// Mock the Google Generative AI module
const mockGenerateContent = jest.fn();

jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({
      generateContent: mockGenerateContent,
    }),
  })),
}));

describe('AI Summarizer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  describe('generateSummary', () => {
    it('should generate 3-line summary from content', async () => {
      mockGenerateContent.mockResolvedValue({
        response: {
          text: () => '1. 첫 번째 요약 문장입니다.\n2. 두 번째 요약 문장입니다.\n3. 세 번째 요약 문장입니다.',
        },
      });

      const { generateSummary } = require('./summarizer');
      const result = await generateSummary('Test content for summarization');

      expect(result).toHaveLength(3);
      expect(result[0]).toContain('첫 번째');
    });

    it('should return empty array on error', async () => {
      mockGenerateContent.mockRejectedValue(new Error('API Error'));

      const { generateSummary } = require('./summarizer');
      const result = await generateSummary('Test content');

      expect(result).toEqual([]);
    });

    it('should handle content with different line formats', async () => {
      mockGenerateContent.mockResolvedValue({
        response: {
          text: () => '- 첫 번째 요약\n- 두 번째 요약\n- 세 번째 요약',
        },
      });

      const { generateSummary } = require('./summarizer');
      const result = await generateSummary('Test content');

      expect(result).toHaveLength(3);
    });

    it('should pad array to 3 items if less than 3 lines returned', async () => {
      mockGenerateContent.mockResolvedValue({
        response: {
          text: () => '하나의 요약만 있음',
        },
      });

      const { generateSummary } = require('./summarizer');
      const result = await generateSummary('Test content');

      expect(result).toHaveLength(3);
      expect(result[0]).toBe('하나의 요약만 있음');
      expect(result[1]).toBe('');
      expect(result[2]).toBe('');
    });
  });

  describe('generateInsight', () => {
    it('should generate technical insight from content', async () => {
      mockGenerateContent.mockResolvedValue({
        response: {
          text: () => '이 기술은 AI 발전에 중요한 의미를 가집니다. 특히 자연어 처리 분야에서 큰 진전을 보여주며, 향후 다양한 응용 분야에 적용될 것으로 예상됩니다.',
        },
      });

      const { generateInsight } = require('./summarizer');
      const result = await generateInsight('Test content for insight generation');

      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return empty string on error', async () => {
      mockGenerateContent.mockRejectedValue(new Error('API Error'));

      const { generateInsight } = require('./summarizer');
      const result = await generateInsight('Test content');

      expect(result).toBe('');
    });
  });
});
