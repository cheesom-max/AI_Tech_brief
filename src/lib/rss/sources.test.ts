import { RSS_SOURCES, getSourceById, getSourcesByCategory } from './sources';
import type { RSSSource } from '@/types';

describe('RSS Sources', () => {
  describe('RSS_SOURCES', () => {
    it('should contain 8 sources as per spec', () => {
      expect(RSS_SOURCES).toHaveLength(8);
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

    it('should include OpenAI Blog', () => {
      const openai = RSS_SOURCES.find((s) => s.id === 'openai');
      expect(openai).toBeDefined();
      expect(openai?.name).toBe('OpenAI Blog');
      expect(openai?.url).toContain('openai.com');
      expect(openai?.category).toBe('company');
    });

    it('should include Google DeepMind', () => {
      const deepmind = RSS_SOURCES.find((s) => s.id === 'deepmind');
      expect(deepmind).toBeDefined();
      expect(deepmind?.name).toBe('Google DeepMind');
      expect(deepmind?.category).toBe('company');
    });

    it('should include Anthropic', () => {
      const anthropic = RSS_SOURCES.find((s) => s.id === 'anthropic');
      expect(anthropic).toBeDefined();
      expect(anthropic?.name).toBe('Anthropic');
      expect(anthropic?.category).toBe('company');
    });

    it('should include Hugging Face', () => {
      const huggingface = RSS_SOURCES.find((s) => s.id === 'huggingface');
      expect(huggingface).toBeDefined();
      expect(huggingface?.name).toBe('Hugging Face');
      expect(huggingface?.category).toBe('company');
    });

    it('should include TechCrunch', () => {
      const techcrunch = RSS_SOURCES.find((s) => s.id === 'techcrunch');
      expect(techcrunch).toBeDefined();
      expect(techcrunch?.name).toBe('TechCrunch');
      expect(techcrunch?.category).toBe('media');
    });

    it('should include The Verge', () => {
      const verge = RSS_SOURCES.find((s) => s.id === 'verge');
      expect(verge).toBeDefined();
      expect(verge?.name).toBe('The Verge');
      expect(verge?.category).toBe('media');
    });

    it('should include VentureBeat', () => {
      const venturebeat = RSS_SOURCES.find((s) => s.id === 'venturebeat');
      expect(venturebeat).toBeDefined();
      expect(venturebeat?.name).toBe('VentureBeat');
      expect(venturebeat?.category).toBe('media');
    });

    it('should include MIT Tech Review', () => {
      const mit = RSS_SOURCES.find((s) => s.id === 'mit');
      expect(mit).toBeDefined();
      expect(mit?.name).toBe('MIT Tech Review');
      expect(mit?.category).toBe('media');
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
      expect(companySources.length).toBeGreaterThan(0);
      companySources.forEach((source) => {
        expect(source.category).toBe('company');
      });
    });

    it('should return media sources', () => {
      const mediaSources = getSourcesByCategory('media');
      expect(mediaSources.length).toBeGreaterThan(0);
      mediaSources.forEach((source) => {
        expect(source.category).toBe('media');
      });
    });
  });
});
