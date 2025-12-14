import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

// Mock Prisma client
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    admin: {
      upsert: jest.fn(),
    },
    emailConfig: {
      upsert: jest.fn(),
    },
    product: {
      upsert: jest.fn(),
    },
    productMedia: {
      upsert: jest.fn(),
    },
    $disconnect: jest.fn(),
  })),
}));

// Mock bcrypt
jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
}));

describe('Seed Script', () => {
  let mockPrisma: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockPrisma = new PrismaClient();
  });

  it('should hash password correctly', async () => {
    const mockHash = 'hashed_password';
    (bcrypt.hash as jest.Mock).mockResolvedValue(mockHash);

    const result = await bcrypt.hash('admin123', 10);
    expect(result).toBe(mockHash);
    expect(bcrypt.hash).toHaveBeenCalledWith('admin123', 10);
  });

  it('should create admin user', async () => {
    const mockAdmin = {
      id: '1',
      email: 'admin@studio42.dev',
      name: 'Admin User',
    };
    (mockPrisma.admin.upsert as jest.Mock).mockResolvedValue(mockAdmin);

    const result = await mockPrisma.admin.upsert({
      where: { email: 'admin@studio42.dev' },
      update: {},
      create: {
        email: 'admin@studio42.dev',
        passwordHash: 'hashed',
        name: 'Admin User',
      },
    });

    expect(result).toEqual(mockAdmin);
  });

  it('should create email config', async () => {
    const mockConfig = { id: 'default', enabled: false };
    (mockPrisma.emailConfig.upsert as jest.Mock).mockResolvedValue(mockConfig);

    const result = await mockPrisma.emailConfig.upsert({
      where: { id: 'default' },
      update: {},
      create: {
        id: 'default',
        enabled: false,
      },
    });

    expect(result).toEqual(mockConfig);
  });

  it('should create products', async () => {
    const mockProduct = {
      id: '1',
      slug: 'lms',
      name: 'AI Microlearning LMS',
    };
    (mockPrisma.product.upsert as jest.Mock).mockResolvedValue(mockProduct);

    const result = await mockPrisma.product.upsert({
      where: { slug: 'lms' },
      update: {},
      create: {
        slug: 'lms',
        name: 'AI Microlearning LMS',
        description: 'Test',
        status: 'AVAILABLE',
      },
    });

    expect(result).toEqual(mockProduct);
  });
});

