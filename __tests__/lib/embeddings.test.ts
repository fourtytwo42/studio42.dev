import { createEmbedding, createEmbeddings, cosineSimilarity } from '@/lib/embeddings';
import { generateEmbedding } from '@/lib/groq';

jest.mock('@/lib/groq', () => ({
  generateEmbedding: jest.fn(),
}));

const mockGenerateEmbedding = generateEmbedding as jest.MockedFunction<typeof generateEmbedding>;

describe('Embeddings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createEmbedding', () => {
    it('should generate embedding for text', async () => {
      const mockEmbedding = new Array(1536).fill(0).map(() => Math.random());
      mockGenerateEmbedding.mockResolvedValue(mockEmbedding);

      const result = await createEmbedding('test text');

      expect(result).toEqual(mockEmbedding);
      expect(mockGenerateEmbedding).toHaveBeenCalledWith('test text');
    });

    it('should throw error for empty text', async () => {
      await expect(createEmbedding('')).rejects.toThrow('Text cannot be empty');
      await expect(createEmbedding('   ')).rejects.toThrow('Text cannot be empty');
    });

    it('should handle errors', async () => {
      mockGenerateEmbedding.mockRejectedValue(new Error('API error'));

      await expect(createEmbedding('test')).rejects.toThrow('Failed to generate embedding');
    });
  });

  describe('createEmbeddings', () => {
    it('should generate embeddings for multiple texts', async () => {
      const mockEmbedding1 = new Array(1536).fill(0).map(() => Math.random());
      const mockEmbedding2 = new Array(1536).fill(0).map(() => Math.random());

      mockGenerateEmbedding
        .mockResolvedValueOnce(mockEmbedding1)
        .mockResolvedValueOnce(mockEmbedding2);

      const result = await createEmbeddings(['text1', 'text2']);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(mockEmbedding1);
      expect(result[1]).toEqual(mockEmbedding2);
    });
  });

  describe('cosineSimilarity', () => {
    it('should calculate cosine similarity', () => {
      const a = [1, 0, 0];
      const b = [1, 0, 0];
      const similarity = cosineSimilarity(a, b);
      expect(similarity).toBe(1);
    });

    it('should calculate cosine similarity for orthogonal vectors', () => {
      const a = [1, 0, 0];
      const b = [0, 1, 0];
      const similarity = cosineSimilarity(a, b);
      expect(similarity).toBe(0);
    });

    it('should throw error for different length vectors', () => {
      const a = [1, 2, 3];
      const b = [1, 2];
      expect(() => cosineSimilarity(a, b)).toThrow('Embeddings must have the same length');
    });

    it('should handle zero vectors', () => {
      const a = [0, 0, 0];
      const b = [0, 0, 0];
      const similarity = cosineSimilarity(a, b);
      expect(similarity).toBe(0);
    });
  });
});

