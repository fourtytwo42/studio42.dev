import {
  getProductBySlug,
  getAllProducts,
  getProductsByStatus,
  createContact,
  getContactById,
  getContacts,
  markContactAsRead,
  markContactAsResponded,
  getContactStats,
  getEmailConfig,
  updateEmailConfig,
  getAdminByEmail,
  updateAdminLastLogin,
} from '@/lib/db-helpers';
import { prisma } from '@/lib/prisma';
import { ProductStatus, InquiryType, ContactMethod } from '@prisma/client';

// Mock Prisma client
jest.mock('@/lib/prisma', () => ({
  prisma: {
    product: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
    contact: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
    },
    emailConfig: {
      findFirst: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    },
    admin: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

describe('Database Helpers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Product Helpers', () => {
    it('should get product by slug', async () => {
      const mockProduct = { id: '1', slug: 'lms', name: 'LMS' };
      (prisma.product.findUnique as jest.Mock).mockResolvedValue(mockProduct);

      const result = await getProductBySlug('lms');
      expect(result).toEqual(mockProduct);
      expect(prisma.product.findUnique).toHaveBeenCalledWith({
        where: { slug: 'lms' },
        include: {
          media: {
            orderBy: { order: 'asc' },
          },
        },
      });
    });

    it('should get all products', async () => {
      const mockProducts = [{ id: '1', name: 'Product 1' }];
      (prisma.product.findMany as jest.Mock).mockResolvedValue(mockProducts);

      const result = await getAllProducts();
      expect(result).toEqual(mockProducts);
      expect(prisma.product.findMany).toHaveBeenCalledWith({
        orderBy: [
          { status: 'asc' },
          { name: 'asc' },
        ],
      });
    });

    it('should get products by status', async () => {
      const mockProducts = [{ id: '1', status: ProductStatus.AVAILABLE }];
      (prisma.product.findMany as jest.Mock).mockResolvedValue(mockProducts);

      const result = await getProductsByStatus(ProductStatus.AVAILABLE);
      expect(result).toEqual(mockProducts);
      expect(prisma.product.findMany).toHaveBeenCalledWith({
        where: { status: ProductStatus.AVAILABLE },
        orderBy: { name: 'asc' },
      });
    });
  });

  describe('Contact Helpers', () => {
    it('should create contact', async () => {
      const contactData = {
        name: 'Test User',
        email: 'test@example.com',
        inquiryType: InquiryType.GENERAL_INQUIRY,
        message: 'Test message',
      };
      const mockContact = { id: '1', ...contactData };
      (prisma.contact.create as jest.Mock).mockResolvedValue(mockContact);

      const result = await createContact(contactData);
      expect(result).toEqual(mockContact);
      expect(prisma.contact.create).toHaveBeenCalledWith({
        data: {
          ...contactData,
          preferredMethod: ContactMethod.EMAIL,
        },
      });
    });

    it('should get contact by id', async () => {
      const mockContact = { id: '1', name: 'Test User' };
      (prisma.contact.findUnique as jest.Mock).mockResolvedValue(mockContact);

      const result = await getContactById('1');
      expect(result).toEqual(mockContact);
      expect(prisma.contact.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: {
          productRelation: true,
        },
      });
    });

    it('should get contacts with filters', async () => {
      const mockContacts = [{ id: '1', name: 'Test' }];
      const mockCount = 1;
      (prisma.contact.findMany as jest.Mock).mockResolvedValue(mockContacts);
      (prisma.contact.count as jest.Mock).mockResolvedValue(mockCount);

      const result = await getContacts({
        read: false,
        page: 1,
        limit: 10,
      });

      expect(result.contacts).toEqual(mockContacts);
      expect(result.pagination.total).toBe(mockCount);
      expect(prisma.contact.findMany).toHaveBeenCalled();
    });

    it('should mark contact as read', async () => {
      const mockContact = { id: '1', read: true };
      (prisma.contact.update as jest.Mock).mockResolvedValue(mockContact);

      const result = await markContactAsRead('1');
      expect(result).toEqual(mockContact);
      expect(prisma.contact.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { read: true },
      });
    });

    it('should mark contact as responded', async () => {
      const mockContact = { id: '1', responded: true };
      (prisma.contact.update as jest.Mock).mockResolvedValue(mockContact);

      const result = await markContactAsResponded('1');
      expect(result).toEqual(mockContact);
      expect(prisma.contact.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { responded: true },
      });
    });

    it('should get contact stats', async () => {
      (prisma.contact.count as jest.Mock)
        .mockResolvedValueOnce(10) // total
        .mockResolvedValueOnce(3)  // unread
        .mockResolvedValueOnce(5); // responded

      const result = await getContactStats();
      expect(result).toEqual({
        total: 10,
        unread: 3,
        responded: 5,
        read: 7,
      });
    });
  });

  describe('Email Config Helpers', () => {
    it('should get email config', async () => {
      const mockConfig = { id: 'default', enabled: false };
      (prisma.emailConfig.findFirst as jest.Mock).mockResolvedValue(mockConfig);

      const result = await getEmailConfig();
      expect(result).toEqual(mockConfig);
    });

    it('should update existing email config', async () => {
      const existingConfig = { id: 'default', enabled: false };
      const updatedConfig = { id: 'default', enabled: true };
      (prisma.emailConfig.findFirst as jest.Mock).mockResolvedValue(existingConfig);
      (prisma.emailConfig.update as jest.Mock).mockResolvedValue(updatedConfig);

      const result = await updateEmailConfig({ enabled: true });
      expect(result).toEqual(updatedConfig);
      expect(prisma.emailConfig.update).toHaveBeenCalledWith({
        where: { id: 'default' },
        data: { enabled: true },
      });
    });

    it('should create email config if not exists', async () => {
      const newConfig = { id: 'default', enabled: true };
      (prisma.emailConfig.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.emailConfig.create as jest.Mock).mockResolvedValue(newConfig);

      const result = await updateEmailConfig({ enabled: true });
      expect(result).toEqual(newConfig);
      expect(prisma.emailConfig.create).toHaveBeenCalled();
    });
  });

  describe('Admin Helpers', () => {
    it('should get admin by email', async () => {
      const mockAdmin = { id: '1', email: 'admin@example.com' };
      (prisma.admin.findUnique as jest.Mock).mockResolvedValue(mockAdmin);

      const result = await getAdminByEmail('admin@example.com');
      expect(result).toEqual(mockAdmin);
      expect(prisma.admin.findUnique).toHaveBeenCalledWith({
        where: { email: 'admin@example.com' },
      });
    });

    it('should update admin last login', async () => {
      const mockAdmin = { id: '1', lastLogin: new Date() };
      (prisma.admin.update as jest.Mock).mockResolvedValue(mockAdmin);

      const result = await updateAdminLastLogin('1');
      expect(result).toEqual(mockAdmin);
      expect(prisma.admin.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { lastLogin: expect.any(Date) },
      });
    });
  });
});

