import { RSS_SOURCES, getSourceById, getSourcesByCategory } from './sources';
import type { RSSSource } from '@/types';

describe('RSS Sources', () => {
  describe('RSS_SOURCES', () => {
    it('should contain 10 sources as per current spec', () => {
      expect(RSS_SOURCES).toHaveLength(10);
    });

    it('should have required fields for each source', () => {
      RSS_SOURCES.forEach((source: RSSSource) => {
        expect(source).toHaveProperty('id');
        expect(source).toHaveProperty('name');
        expect(source).toHaveProperty('url');
        expect(source).toHaveProperty('category');
        expect(source).toHaveProperty('icon');
        expect(['company', 'media']).toContain(source.category);
      });
    });

    it('should include OpenAI', () => {
      const openai = RSS_SOURCES.find((s) => s.id === 'openai');
      expect(openai).toBeDefined();
      expect(openai?.name).toBe('OpenAI');
      expect(openai?.url).toContain('openai.com');
      expect(openai?.category).toBe('company');
    });

    it('should include Google Research', () => {
      const google = RSS_SOURCES.find((s) => s.id === 'google');
      expect(google).toBeDefined();
      expect(google?.name).toBe('Google Research');
      expect(google?.category).toBe('company');
    });

    it('should include arXiv ML', () => {
      const arxivMl = RSS_SOURCES.find((s) => s.id === 'arxiv-ml');
      expect(arxivMl).toBeDefined();
      expect(arxivMl?.name).toBe('arXiv ML');
      expect(arxivMl?.category).toBe('media');
    });

    it('should include arXiv NLP', () => {
      const arxivNlp = RSS_SOURCES.find((s) => s.id === 'arxiv-nlp');
      expect(arxivNlp).toBeDefined();
      expect(arxivNlp?.name).toBe('arXiv NLP');
      expect(arxivNlp?.category).toBe('media');
    });

    it('should include Meta Engineering', () => {
      const meta = RSS_SOURCES.find((s) => s.id === 'meta');
      expect(meta).toBeDefined();
      expect(meta?.name).toBe('Meta Engineering');
      expect(meta?.category).toBe('company');
    });

    it('should include Hugging Face', () => {
      const huggingface = RSS_SOURCES.find((s) => s.id === 'huggingface');
      expect(huggingface).toBeDefined();
      expect(huggingface?.name).toBe('Hugging Face');
      expect(huggingface?.category).toBe('company');
    });

    it('should include Lobsters', () => {
      const lobsters = RSS_SOURCES.find((s) => s.id === 'lobsters');
      expect(lobsters).toBeDefined();
      expect(lobsters?.name).toBe('Lobsters');
      expect(lobsters?.category).toBe('media');
    });

    it('should include Papers With Code', () => {
      const pwc = RSS_SOURCES.find((s) => s.id === 'paperswithcode');
      expect(pwc).toBeDefined();
      expect(pwc?.name).toBe('Papers With Code');
      expect(pwc?.category).toBe('media');
    });

    it('should include AWS ML Blog', () => {
      const aws = RSS_SOURCES.find((s) => s.id === 'aws');
      expect(aws).toBeDefined();
      expect(aws?.name).toBe('AWS ML Blog');
      expect(aws?.category).toBe('media');
    });

    it('should include ML Mastery', () => {
      const mlmastery = RSS_SOURCES.find((s) => s.id === 'mlmastery');
      expect(mlmastery).toBeDefined();
      expect(mlmastery?.name).toBe('ML Mastery');
      expect(mlmastery?.category).toBe('media');
    });
  });

  describe('getSourceById', () => {
    it('should return source by id', () => {
      const source = getSourceById('openai');
      expect(source).toBeDefined();
      expect(source?.id).toBe('openai');
    });

    it('should return undefined for unknown id', () => {
      const source = getSourceById('unknown');
      expect(source).toBeUndefined();
    });
  });

  describe('getSourcesByCategory', () => {
    it('should return company sources', () => {
      const companySources = getSourcesByCategory('company');
      expect(companySources).toHaveLength(4); // openai, google, meta, huggingface
      companySources.forEach((source) => {
        expect(source.category).toBe('company');
      });
    });

    it('should return media sources', () => {
      const mediaSources = getSourcesByCategory('media');
      expect(mediaSources).toHaveLength(6); // arxiv-ml, arxiv-nlp, lobsters, paperswithcode, aws, mlmastery
      mediaSources.forEach((source) => {
        expect(source.category).toBe('media');
      });
    });
  });
});
