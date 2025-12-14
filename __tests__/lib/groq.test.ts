import { getGroqClient, generateEmbedding } from '@/lib/groq';
import { getEnvVar } from '@/lib/env';

jest.mock('groq-sdk', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn(),
      },
    },
  })),
}));

jest.mock('@/lib/env', () => ({
  getEnvVar: jest.fn(),
}));

const mockGetEnvVar = getEnvVar as jest.MockedFunction<typeof getEnvVar>;

describe('Groq Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetEnvVar.mockImplementation((key, defaultValue) => {
      if (key === 'GROQ_API_KEY') return 'test-api-key';
      if (key === 'GROQ_MODEL') return defaultValue || 'llama-3.1-70b-versatile';
      if (key === 'EMBEDDING_MODEL') return defaultValue || 'text-embedding-3-small';
      if (key === 'OPENAI_API_KEY') return 'test-openai-key';
      return defaultValue || '';
    });
  });

  describe('getGroqClient', () => {
    it('should return Groq client instance', () => {
      const client = getGroqClient();
      expect(client).toBeDefined();
    });

    it('should return same instance on multiple calls', () => {
      const client1 = getGroqClient();
      const client2 = getGroqClient();
      expect(client1).toBe(client2);
    });
  });

  describe('generateEmbedding', () => {
    it('should throw error if embedding model not configured', async () => {
      mockGetEnvVar.mockImplementation((key) => {
        if (key === 'EMBEDDING_MODEL') return 'invalid-model';
        if (key === 'OPENAI_API_KEY') return '';
        return '';
      });

      await expect(generateEmbedding('test')).rejects.toThrow('Embedding generation not properly configured');
    });
  });
});
