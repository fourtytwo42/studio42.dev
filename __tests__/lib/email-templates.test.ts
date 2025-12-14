import {
  generateUserConfirmationEmail,
  generateAdminNotificationEmail,
  generateTestEmail,
} from '@/lib/email-templates';
import { Contact, EmailConfig } from '@prisma/client';

describe('Email Templates', () => {
  const mockContact: Contact = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    company: 'Acme Corp',
    phone: '+1234567890',
    product: 'lms',
    inquiryType: 'REQUEST_DEMO',
    message: 'I would like to request a demo',
    preferredMethod: 'EMAIL',
    source: 'website',
    read: false,
    responded: false,
    createdAt: new Date('2024-01-01T10:00:00Z'),
    updatedAt: new Date('2024-01-01T10:00:00Z'),
  };

  const mockConfig: EmailConfig = {
    id: 'default',
    enabled: true,
    smtpHost: 'smtp.example.com',
    smtpPort: 587,
    smtpUser: 'user@example.com',
    smtpPassword: 'password',
    smtpSecure: true,
    fromEmail: 'noreply@studio42.dev',
    fromName: 'Studio42',
    adminEmail: 'admin@studio42.dev',
    confirmationTemplate: null,
    notificationTemplate: null,
    updatedAt: new Date(),
    updatedBy: null,
  };

  describe('generateUserConfirmationEmail', () => {
    it('should generate user confirmation email with default template', () => {
      const email = generateUserConfirmationEmail(mockContact, mockConfig);

      expect(email.subject).toContain('Thank You');
      expect(email.html).toContain('John Doe');
      expect(email.html).toContain('I would like to request a demo');
      expect(email.text).toBeDefined();
    });

    it('should replace template variables', () => {
      const configWithTemplate = {
        ...mockConfig,
        confirmationTemplate: 'Hello {name}, your message: {message}',
      };

      const email = generateUserConfirmationEmail(mockContact, configWithTemplate);

      expect(email.html).toContain('John Doe');
      expect(email.html).toContain('I would like to request a demo');
    });

    it('should handle missing optional fields', () => {
      const contactWithoutOptional = {
        ...mockContact,
        company: null,
        phone: null,
        product: null,
      };

      const email = generateUserConfirmationEmail(contactWithoutOptional, mockConfig);

      expect(email.html).toContain('John Doe');
      // Template should still work with null values
      expect(email.html).toBeDefined();
    });
  });

  describe('generateAdminNotificationEmail', () => {
    it('should generate admin notification email with default template', () => {
      const email = generateAdminNotificationEmail(mockContact, mockConfig);

      expect(email.subject).toContain('New Contact');
      expect(email.html).toContain('John Doe');
      expect(email.html).toContain('john@example.com');
      expect(email.html).toContain('Acme Corp');
      expect(email.text).toBeDefined();
    });

    it('should replace template variables', () => {
      const configWithTemplate = {
        ...mockConfig,
        notificationTemplate: 'New contact from {name} ({email})',
      };

      const email = generateAdminNotificationEmail(mockContact, configWithTemplate);

      expect(email.html).toContain('John Doe');
      expect(email.html).toContain('john@example.com');
    });
  });

  describe('generateTestEmail', () => {
    it('should generate test email', () => {
      const email = generateTestEmail();

      expect(email.subject).toContain('Test Email');
      expect(email.html).toContain('test email');
      expect(email.text).toBeDefined();
    });
  });
});

