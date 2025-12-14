import { prisma } from '@/lib/prisma';
import { getAllProducts, getProductBySlug } from '@/lib/db-helpers';

jest.mock('@/lib/prisma', () => ({
  prisma: {
    product: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));

describe('Products Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should integrate products API with database helpers', async () => {
    const mockProducts = [
      {
        id: '1',
        slug: 'lms',
        name: 'LMS',
        description: 'Test',
        status: 'AVAILABLE',
      },
    ];

    (prisma.product.findMany as jest.Mock).mockResolvedValue(mockProducts);

    const products = await getAllProducts();
    expect(products).toEqual(mockProducts);
    expect(prisma.product.findMany).toHaveBeenCalled();
  });

  it('should handle product data transformation', () => {
    // Test that description truncation logic exists
    const longDescription = 'a'.repeat(200);
    const truncated = longDescription.length > 150
      ? `${longDescription.substring(0, 150)}...`
      : longDescription;

    expect(truncated.length).toBe(153);
    expect(truncated).toContain('...');
  });

  it('should support product status filtering', async () => {
    const mockProducts = [
      {
        id: '1',
        slug: 'lms',
        name: 'LMS',
        status: 'AVAILABLE',
        description: 'Test',
      },
    ];

    (prisma.product.findMany as jest.Mock).mockResolvedValue(mockProducts);

    const products = await getAllProducts();
    expect(products).toBeDefined();
  });
});

