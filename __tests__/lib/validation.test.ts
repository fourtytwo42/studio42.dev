import { contactFormSchema, parseProductFromUrl } from '@/lib/validation';

describe('Contact Form Validation', () => {
  describe('contactFormSchema', () => {
    it('should validate valid contact form data', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        company: 'Acme Corp',
        phone: '+1234567890',
        product: 'lms',
        inquiryType: 'GENERAL_INQUIRY',
        message: 'This is a test message with enough characters.',
        contactMethod: 'EMAIL',
      };

      const result = contactFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject missing required fields', () => {
      const invalidData = {
        name: 'John Doe',
        // Missing email
        message: 'Test message',
      };

      const result = contactFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject invalid email', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'invalid-email',
        message: 'Test message with enough characters.',
        inquiryType: 'GENERAL_INQUIRY',
        contactMethod: 'EMAIL',
      };

      const result = contactFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject short name', () => {
      const invalidData = {
        name: 'J',
        email: 'john@example.com',
        message: 'Test message with enough characters.',
        inquiryType: 'GENERAL_INQUIRY',
        contactMethod: 'EMAIL',
      };

      const result = contactFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject short message', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Short',
        inquiryType: 'GENERAL_INQUIRY',
        contactMethod: 'EMAIL',
      };

      const result = contactFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should accept optional fields as empty strings', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        company: '',
        phone: '',
        product: '',
        inquiryType: 'GENERAL_INQUIRY',
        message: 'This is a test message with enough characters.',
        contactMethod: 'EMAIL',
      };

      const result = contactFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('parseProductFromUrl', () => {
    it('should extract product from URL search params', () => {
      const searchParams = new URLSearchParams('?source=lms');
      const product = parseProductFromUrl(searchParams);
      expect(product).toBe('lms');
    });

    it('should return null when no source parameter', () => {
      const searchParams = new URLSearchParams();
      const product = parseProductFromUrl(searchParams);
      expect(product).toBeNull();
    });

    it('should handle empty source parameter', () => {
      const searchParams = new URLSearchParams('?source=');
      const product = parseProductFromUrl(searchParams);
      // Empty string parameter returns empty string
      expect(product).toBe('');
    });
  });
});

