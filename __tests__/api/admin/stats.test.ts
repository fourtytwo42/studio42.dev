import { prisma } from '@/lib/prisma';

jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data, init) => ({
      json: async () => data,
      status: init?.status || 200,
    })),
  },
}));

jest.mock('@/lib/auth', () => ({
  auth: jest.fn(),
}));

jest.mock('@/lib/prisma', () => ({
  prisma: {
    contact: {
      count: jest.fn(),
      groupBy: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe('Admin Stats API Route', () => {
  let mockAuth: jest.MockedFunction<any>;

  beforeEach(async () => {
    jest.clearAllMocks();
    const authModule = await import('@/lib/auth');
    mockAuth = authModule.auth as jest.MockedFunction<any>;
    mockAuth.mockResolvedValue({
      user: { id: '1', email: 'admin@test.com', name: 'Admin' },
    });
  });

  it('should return 401 if not authenticated', async () => {
    const authModule = await import('@/lib/auth');
    (authModule.auth as jest.MockedFunction<any>).mockResolvedValue(null);

    const { GET } = await import('@/app/api/admin/stats/route');
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('should return statistics', async () => {
    mockPrisma.contact.count
      .mockResolvedValueOnce(100) // total
      .mockResolvedValueOnce(25) // unread
      .mockResolvedValueOnce(50); // responded

    mockPrisma.contact.groupBy.mockResolvedValue([
      { inquiryType: 'GENERAL_INQUIRY', _count: 30 },
      { inquiryType: 'REQUEST_DEMO', _count: 20 },
    ] as any);

    mockPrisma.contact.findMany.mockResolvedValue([
      {
        id: '1',
        name: 'Test User',
        email: 'test@test.com',
        inquiryType: 'GENERAL_INQUIRY',
        createdAt: new Date(),
      },
    ] as any);

    const { GET } = await import('@/app/api/admin/stats/route');
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.totalContacts).toBe(100);
    expect(data.unreadContacts).toBe(25);
    expect(data.respondedContacts).toBe(50);
    expect(data.contactsByType).toBeDefined();
    expect(data.recentContacts).toHaveLength(1);
  });

  it('should handle errors', async () => {
    mockPrisma.contact.count.mockRejectedValue(new Error('Database error'));

    const { GET } = await import('@/app/api/admin/stats/route');
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to fetch statistics');
  });
});

