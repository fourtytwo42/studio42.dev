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
    emailConfig: {
      findFirst: jest.fn(),
      upsert: jest.fn(),
    },
  },
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe('Admin Email Config API Route', () => {
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

      const { GET } = await import('@/app/api/admin/email-config/route');
      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('should return email configuration', async () => {
      const mockConfig = {
        id: 'default_email_config',
        enabled: true,
        smtpHost: 'smtp.example.com',
        smtpPort: 587,
        smtpUser: 'user@example.com',
        smtpPassword: 'password',
        smtpSecure: true,
        fromEmail: 'noreply@example.com',
        fromName: 'Test',
        adminEmail: 'admin@example.com',
        confirmationTemplate: 'Template',
        notificationTemplate: 'Template',
      };

      mockPrisma.emailConfig.findFirst.mockResolvedValue(mockConfig as any);

      const { GET } = await import('@/app/api/admin/email-config/route');
      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.config).toBeDefined();
      expect(data.config.smtpPassword).toBeUndefined();
    });

    it('should return 404 if config not found', async () => {
      mockPrisma.emailConfig.findFirst.mockResolvedValue(null);

      const { GET } = await import('@/app/api/admin/email-config/route');
      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Email configuration not found');
    });
  });

  describe('PUT', () => {
    it('should return 401 if not authenticated', async () => {
      const authModule = await import('@/lib/auth');
      (authModule.auth as jest.MockedFunction<any>).mockResolvedValue(null);

      const { PUT } = await import('@/app/api/admin/email-config/route');
      const request = {
        json: async () => ({ enabled: true }),
      } as any;
      const response = await PUT(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('should update email configuration', async () => {
      const mockConfig = {
        id: 'default_email_config',
        enabled: true,
        smtpHost: 'smtp.example.com',
        smtpPort: 587,
        smtpUser: 'user@example.com',
        smtpPassword: 'password',
        smtpSecure: true,
        fromEmail: 'noreply@example.com',
        fromName: 'Test',
        adminEmail: 'admin@example.com',
        confirmationTemplate: 'Template',
        notificationTemplate: 'Template',
      };

      mockPrisma.emailConfig.upsert.mockResolvedValue(mockConfig as any);

      const { PUT } = await import('@/app/api/admin/email-config/route');
      const request = {
        json: async () => ({
          enabled: true,
          smtpHost: 'smtp.example.com',
          smtpPort: 587,
          smtpUser: 'user@example.com',
          fromEmail: 'noreply@example.com',
        }),
      } as any;
      const response = await PUT(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.config).toBeDefined();
      expect(data.config.smtpPassword).toBeUndefined();
    });

    it('should handle errors', async () => {
      mockPrisma.emailConfig.upsert.mockRejectedValue(new Error('Database error'));

      const { PUT } = await import('@/app/api/admin/email-config/route');
      const request = {
        json: async () => ({ enabled: true }),
      } as any;
      const response = await PUT(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to update email configuration');
    });
  });
});

