import { searchKnowledgeBase, upsertKnowledgeBaseEntry } from '@/lib/semantic-search';
import { prisma } from '@/lib/prisma';
import { createEmbedding } from '@/lib/embeddings';

jest.mock('@/lib/prisma', () => ({
  prisma: {
    $queryRaw: jest.fn(),
    $executeRaw: jest.fn(),
  },
}));

jest.mock('@/lib/embeddings', () => ({
  createEmbedding: jest.fn(),
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;
const mockCreateEmbedding = createEmbedding as jest.MockedFunction<typeof createEmbedding>;

describe('Semantic Search', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('searchKnowledgeBase', () => {
    it('should perform semantic search', async () => {
      const mockEmbedding = new Array(1536).fill(0.1);
      mockCreateEmbedding.mockResolvedValue(mockEmbedding);

      const mockResults = [
        {
          id: '1',
          title: 'Test Title',
          content: 'Test content',
          category: 'product',
          similarity: 0.95,
        },
      ];

      mockPrisma.$queryRaw.mockResolvedValue(mockResults);

      const results = await searchKnowledgeBase('test query', 5);

      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('Test Title');
      expect(mockCreateEmbedding).toHaveBeenCalledWith('test query');
    });

    it('should handle errors', async () => {
      mockCreateEmbedding.mockRejectedValue(new Error('Embedding error'));

      await expect(searchKnowledgeBase('test')).rejects.toThrow('Failed to perform semantic search');
    });
  });

  describe('upsertKnowledgeBaseEntry', () => {
    it('should upsert knowledge base entry with embedding', async () => {
      const mockEmbedding = new Array(1536).fill(0.1);
      mockCreateEmbedding.mockResolvedValue(mockEmbedding);
      mockPrisma.$executeRaw.mockResolvedValue(1);

      await upsertKnowledgeBaseEntry('test-id', 'Test Title', 'Test content', 'product');

      expect(mockCreateEmbedding).toHaveBeenCalledWith('Test Title Test content');
      expect(mockPrisma.$executeRaw).toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      mockCreateEmbedding.mockRejectedValue(new Error('Embedding error'));

      await expect(
        upsertKnowledgeBaseEntry('test-id', 'Test Title', 'Test content', 'product')
      ).rejects.toThrow('Failed to upsert knowledge base entry');
    });
  });
});

