import {
  getContacts,
  updateEmailConfig,
} from '@/lib/db-helpers';
import { prisma } from '@/lib/prisma';

jest.mock('@/lib/prisma', () => ({
  prisma: {
    contact: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
    emailConfig: {
      findFirst: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    },
  },
}));

describe('Database Helpers - Branch Coverage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getContacts', () => {
    it('should handle search filter', async () => {
      const mockContacts = [{ id: '1', name: 'Test' }];
      (prisma.contact.findMany as jest.Mock).mockResolvedValue(mockContacts);
      (prisma.contact.count as jest.Mock).mockResolvedValue(1);

      const result = await getContacts({
        search: 'test',
        page: 1,
        limit: 10,
      });

      expect(result.contacts).toEqual(mockContacts);
      expect(prisma.contact.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { name: { contains: 'test', mode: 'insensitive' } },
            { email: { contains: 'test', mode: 'insensitive' } },
            { message: { contains: 'test', mode: 'insensitive' } },
          ],
        },
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          productRelation: true,
        },
      });
    });

    it('should handle product filter', async () => {
      const mockContacts = [{ id: '1', product: 'lms' }];
      (prisma.contact.findMany as jest.Mock).mockResolvedValue(mockContacts);
      (prisma.contact.count as jest.Mock).mockResolvedValue(1);

      const result = await getContacts({
        product: 'lms',
      });

      expect(result.contacts).toEqual(mockContacts);
      expect(prisma.contact.findMany).toHaveBeenCalledWith({
        where: { product: 'lms' },
        skip: 0,
        take: 50,
        orderBy: { createdAt: 'desc' },
        include: {
          productRelation: true,
        },
      });
    });

    it('should handle read filter', async () => {
      const mockContacts = [{ id: '1', read: true }];
      (prisma.contact.findMany as jest.Mock).mockResolvedValue(mockContacts);
      (prisma.contact.count as jest.Mock).mockResolvedValue(1);

      const result = await getContacts({
        read: true,
      });

      expect(result.contacts).toEqual(mockContacts);
      expect(prisma.contact.findMany).toHaveBeenCalledWith({
        where: { read: true },
        skip: 0,
        take: 50,
        orderBy: { createdAt: 'desc' },
        include: {
          productRelation: true,
        },
      });
    });

    it('should handle pagination', async () => {
      const mockContacts = [{ id: '1' }];
      (prisma.contact.findMany as jest.Mock).mockResolvedValue(mockContacts);
      (prisma.contact.count as jest.Mock).mockResolvedValue(100);

      const result = await getContacts({
        page: 2,
        limit: 25,
      });

      expect(result.pagination.page).toBe(2);
      expect(result.pagination.limit).toBe(25);
      expect(result.pagination.total).toBe(100);
      expect(result.pagination.totalPages).toBe(4);
      expect(prisma.contact.findMany).toHaveBeenCalledWith({
        where: {},
        skip: 25,
        take: 25,
        orderBy: { createdAt: 'desc' },
        include: {
          productRelation: true,
        },
      });
    });
  });

  describe('updateEmailConfig', () => {
    it('should handle all config fields', async () => {
      const existingConfig = { id: 'default' };
      const updatedConfig = {
        id: 'default',
        enabled: true,
        smtpHost: 'smtp.example.com',
        smtpPort: 587,
        smtpUser: 'user',
        smtpPassword: 'pass',
        smtpSecure: false,
        fromEmail: 'from@example.com',
        fromName: 'Test',
        adminEmail: 'admin@example.com',
        confirmationTemplate: 'Template',
        notificationTemplate: 'Template',
        updatedBy: 'admin-1',
      };
      (prisma.emailConfig.findFirst as jest.Mock).mockResolvedValue(existingConfig);
      (prisma.emailConfig.update as jest.Mock).mockResolvedValue(updatedConfig);

      const result = await updateEmailConfig({
        enabled: true,
        smtpHost: 'smtp.example.com',
        smtpPort: 587,
        smtpUser: 'user',
        smtpPassword: 'pass',
        smtpSecure: false,
        fromEmail: 'from@example.com',
        fromName: 'Test',
        adminEmail: 'admin@example.com',
        confirmationTemplate: 'Template',
        notificationTemplate: 'Template',
        updatedBy: 'admin-1',
      });

      expect(result).toEqual(updatedConfig);
    });
  });
});

