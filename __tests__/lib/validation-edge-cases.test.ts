import { contactFormSchema } from '@/lib/validation';

describe('Contact Form Validation Edge Cases', () => {
  it('should validate all inquiry types', () => {
    const types = ['GENERAL_INQUIRY', 'REQUEST_DEMO', 'CONTACT_SALES', 'TECHNICAL_SUPPORT', 'OTHER'];
    
    types.forEach((type) => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        inquiryType: type,
        message: 'This is a test message with enough characters.',
        contactMethod: 'EMAIL',
      };

      const result = contactFormSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  it('should validate all contact methods', () => {
    const methods = ['EMAIL', 'PHONE', 'EITHER'];
    
    methods.forEach((method) => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        inquiryType: 'GENERAL_INQUIRY',
        message: 'This is a test message with enough characters.',
        contactMethod: method,
      };

      const result = contactFormSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  it('should reject invalid inquiry type', () => {
    const data = {
      name: 'John Doe',
      email: 'john@example.com',
      inquiryType: 'INVALID',
      message: 'This is a test message with enough characters.',
      contactMethod: 'EMAIL',
    };

    const result = contactFormSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('should reject invalid contact method', () => {
    const data = {
      name: 'John Doe',
      email: 'john@example.com',
      inquiryType: 'GENERAL',
      message: 'This is a test message with enough characters.',
      contactMethod: 'INVALID',
    };

    const result = contactFormSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('should validate max length constraints', () => {
    const longName = 'a'.repeat(101);
    const data = {
      name: longName,
      email: 'john@example.com',
      inquiryType: 'GENERAL',
      message: 'This is a test message with enough characters.',
      contactMethod: 'EMAIL',
    };

    const result = contactFormSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('should validate message max length', () => {
    const longMessage = 'a'.repeat(5001);
    const data = {
      name: 'John Doe',
      email: 'john@example.com',
      inquiryType: 'GENERAL',
      message: longMessage,
      contactMethod: 'EMAIL',
    };

    const result = contactFormSchema.safeParse(data);
    expect(result.success).toBe(false);
  });
});

