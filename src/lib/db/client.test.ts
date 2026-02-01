import { getDbClient, resetDbClient, initializeDatabase } from './client';

// Mock Supabase
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      upsert: jest.fn().mockReturnThis(),
    }),
  })),
}));

describe('Database Client', () => {
  beforeEach(() => {
    resetDbClient();
    jest.clearAllMocks();
  });

  describe('getDbClient', () => {
    it('should return a Supabase client', () => {
      const client = getDbClient();
      expect(client).toBeDefined();
      expect(client.from).toBeDefined();
    });

    it('should return the same instance on multiple calls', () => {
      const client1 = getDbClient();
      const client2 = getDbClient();
      expect(client1).toBe(client2);
    });
  });

  describe('resetDbClient', () => {
    it('should allow creating a new client after reset', () => {
      const client1 = getDbClient();
      resetDbClient();
      const client2 = getDbClient();
      expect(client1).toBeDefined();
      expect(client2).toBeDefined();
    });
  });

  describe('initializeDatabase', () => {
    it('should complete without error', async () => {
      await expect(initializeDatabase()).resolves.not.toThrow();
    });
  });
});
