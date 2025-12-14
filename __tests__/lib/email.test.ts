import { sendEmail, verifySMTPConnection, resetTransporterCache } from '@/lib/email';
import { prisma } from '@/lib/prisma';

jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => ({
    sendMail: jest.fn(),
    verify: jest.fn(),
  })),
}));

jest.mock('@/lib/prisma', () => ({
  prisma: {
    emailConfig: {
      findFirst: jest.fn(),
    },
  },
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe('Email Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetTransporterCache();
  });

  describe('sendEmail', () => {
    it('should return error if email is not enabled', async () => {
      mockPrisma.emailConfig.findFirst.mockResolvedValue({
        enabled: false,
      } as any);

      const result = await sendEmail('test@test.com', 'Subject', 'Body');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Email is not enabled');
    });

    it('should return error if from email is not configured', async () => {
      mockPrisma.emailConfig.findFirst.mockResolvedValue({
        enabled: true,
        fromEmail: null,
      } as any);

      const result = await sendEmail('test@test.com', 'Subject', 'Body');

      expect(result.success).toBe(false);
      expect(result.error).toBe('From email is not configured');
    });

    it('should send email successfully', async () => {
      const mockTransporter = {
        sendMail: jest.fn().mockResolvedValue({ messageId: 'test-id' }),
      };

      const nodemailer = require('nodemailer');
      nodemailer.createTransport.mockReturnValue(mockTransporter);

      mockPrisma.emailConfig.findFirst.mockResolvedValue({
        enabled: true,
        smtpHost: 'smtp.test.com',
        smtpPort: 587,
        smtpUser: 'user@test.com',
        smtpPassword: 'password',
        smtpSecure: false,
        fromEmail: 'noreply@test.com',
        fromName: 'Test',
      } as any);

      const result = await sendEmail('test@test.com', 'Subject', '<p>Body</p>', 'Body');

      expect(result.success).toBe(true);
      expect(result.messageId).toBe('test-id');
      expect(mockTransporter.sendMail).toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      const mockTransporter = {
        sendMail: jest.fn().mockRejectedValue(new Error('SMTP error')),
      };

      const nodemailer = require('nodemailer');
      nodemailer.createTransport.mockReturnValue(mockTransporter);

      mockPrisma.emailConfig.findFirst.mockResolvedValue({
        enabled: true,
        smtpHost: 'smtp.test.com',
        smtpPort: 587,
        smtpUser: 'user@test.com',
        smtpPassword: 'password',
        smtpSecure: false,
        fromEmail: 'noreply@test.com',
        fromName: 'Test',
      } as any);

      const result = await sendEmail('test@test.com', 'Subject', 'Body');

      expect(result.success).toBe(false);
      expect(result.error).toBe('SMTP error');
    });
  });

  describe('verifySMTPConnection', () => {
    it('should verify SMTP connection successfully', async () => {
      const mockTransporter = {
        verify: jest.fn().mockResolvedValue(true),
      };

      const nodemailer = require('nodemailer');
      nodemailer.createTransport.mockReturnValue(mockTransporter);

      mockPrisma.emailConfig.findFirst.mockResolvedValue({
        enabled: true,
        smtpHost: 'smtp.test.com',
        smtpPort: 587,
        smtpUser: 'user@test.com',
        smtpPassword: 'password',
        smtpSecure: false,
      } as any);

      const result = await verifySMTPConnection();

      expect(result.success).toBe(true);
    });

    it('should handle verification errors', async () => {
      const mockTransporter = {
        verify: jest.fn().mockRejectedValue(new Error('Connection failed')),
      };

      const nodemailer = require('nodemailer');
      nodemailer.createTransport.mockReturnValue(mockTransporter);

      mockPrisma.emailConfig.findFirst.mockResolvedValue({
        enabled: true,
        smtpHost: 'smtp.test.com',
        smtpPort: 587,
        smtpUser: 'user@test.com',
        smtpPassword: 'password',
        smtpSecure: false,
      } as any);

      const result = await verifySMTPConnection();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Connection failed');
    });
  });

  describe('resetTransporterCache', () => {
    it('should reset transporter cache', () => {
      resetTransporterCache();
      // Just verify it doesn't throw
      expect(true).toBe(true);
    });
  });
});

