import { prisma } from '@/lib/prisma';

jest.mock('@/lib/auth', () => ({
  auth: jest.fn(),
}));

jest.mock('@/lib/prisma', () => ({
  prisma: {
    contact: {
      count: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data, init) => ({
      json: async () => data,
      status: init?.status || 200,
    })),
  },
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe('Admin Contacts API Route', () => {
  let mockAuth: jest.MockedFunction<any>;

  beforeEach(async () => {
    jest.clearAllMocks();
    const authModule = await import('@/lib/auth');
    mockAuth = authModule.auth as jest.MockedFunction<any>;
    mockAuth.mockResolvedValue({
      user: { id: '1', email: 'admin@test.com', name: 'Admin' },
    });
  });

  describe('GET', () => {
    it('should return 401 if not authenticated', async () => {
      const authModule = await import('@/lib/auth');
      (authModule.auth as jest.MockedFunction<any>).mockResolvedValue(null);

      const { GET } = await import('@/app/api/admin/contacts/route');
      const request = {
        url: 'http://localhost/api/admin/contacts',
      } as any;
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('should return contacts with pagination', async () => {
      const mockContacts = [
        {
          id: '1',
          name: 'Test User',
          email: 'test@test.com',
          company: 'Test Co',
          phone: null,
          product: null,
          inquiryType: 'GENERAL_INQUIRY',
          message: 'Test message',
          preferredMethod: 'EMAIL',
          source: null,
          read: false,
          responded: false,
          createdAt: new Date(),
        },
      ];

      mockPrisma.contact.count.mockResolvedValue(1);
      mockPrisma.contact.findMany.mockResolvedValue(mockContacts as any);

      const { GET } = await import('@/app/api/admin/contacts/route');
      const request = {
        url: 'http://localhost/api/admin/contacts?page=1&limit=20',
      } as any;
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.contacts).toHaveLength(1);
      expect(data.pagination.page).toBe(1);
      expect(data.pagination.limit).toBe(20);
      expect(data.pagination.total).toBe(1);
    });

    it('should filter by search query', async () => {
      mockPrisma.contact.count.mockResolvedValue(1);
      mockPrisma.contact.findMany.mockResolvedValue([] as any);

      const { GET } = await import('@/app/api/admin/contacts/route');
      const request = {
        url: 'http://localhost/api/admin/contacts?search=test',
      } as any;
      await GET(request);

      expect(mockPrisma.contact.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              { name: { contains: 'test', mode: 'insensitive' } },
              { email: { contains: 'test', mode: 'insensitive' } },
            ]),
          }),
        })
      );
    });

    it('should filter by inquiry type', async () => {
      mockPrisma.contact.count.mockResolvedValue(0);
      mockPrisma.contact.findMany.mockResolvedValue([] as any);

      const { GET } = await import('@/app/api/admin/contacts/route');
      const request = {
        url: 'http://localhost/api/admin/contacts?inquiryType=GENERAL_INQUIRY',
      } as any;
      await GET(request);

      expect(mockPrisma.contact.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            inquiryType: 'GENERAL_INQUIRY',
          }),
        })
      );
    });

    it('should filter by read status', async () => {
      mockPrisma.contact.count.mockResolvedValue(0);
      mockPrisma.contact.findMany.mockResolvedValue([] as any);

      const { GET } = await import('@/app/api/admin/contacts/route');
      const request = {
        url: 'http://localhost/api/admin/contacts?read=false',
      } as any;
      await GET(request);

      expect(mockPrisma.contact.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            read: false,
          }),
        })
      );
    });

    it('should filter by responded status', async () => {
      mockPrisma.contact.count.mockResolvedValue(0);
      mockPrisma.contact.findMany.mockResolvedValue([] as any);

      const { GET } = await import('@/app/api/admin/contacts/route');
      const request = {
        url: 'http://localhost/api/admin/contacts?responded=true',
      } as any;
      await GET(request);

      expect(mockPrisma.contact.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            responded: true,
          }),
        })
      );
    });

    it('should handle errors', async () => {
      mockPrisma.contact.count.mockRejectedValue(new Error('Database error'));

      const { GET } = await import('@/app/api/admin/contacts/route');
      const request = {
        url: 'http://localhost/api/admin/contacts',
      } as any;
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to fetch contacts');
    });
  });
});

describe('Admin Contacts [id] API Route', () => {
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

    const { GET } = await import('@/app/api/admin/contacts/[id]/route');
    const request = {} as any;
    const response = await GET(request, { params: Promise.resolve({ id: '1' }) });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('should return contact by id', async () => {
    const mockContact = {
      id: '1',
      name: 'Test User',
      email: 'test@test.com',
      company: 'Test Co',
      phone: null,
      product: null,
      inquiryType: 'GENERAL_INQUIRY',
      message: 'Test message',
      preferredMethod: 'EMAIL',
      source: null,
      read: false,
      responded: false,
      createdAt: new Date(),
    };

    mockPrisma.contact.findUnique = jest.fn().mockResolvedValue(mockContact);

    const { GET } = await import('@/app/api/admin/contacts/[id]/route');
    const request = {} as any;
    const response = await GET(request, { params: Promise.resolve({ id: '1' }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.contact).toBeDefined();
  });

  it('should update contact', async () => {
    const mockContact = {
      id: '1',
      name: 'Test User',
      email: 'test@test.com',
      read: true,
      responded: true,
    };

    mockPrisma.contact.update = jest.fn().mockResolvedValue(mockContact);

    const { PATCH } = await import('@/app/api/admin/contacts/[id]/route');
    const request = {
      json: async () => ({ read: true }),
    } as any;
    const response = await PATCH(request, { params: Promise.resolve({ id: '1' }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.contact).toBeDefined();
  });
});

