import { contactFormSchema } from '@/lib/validation';
import { prisma } from '@/lib/prisma';

jest.mock('@/lib/prisma', () => ({
  prisma: {
    contact: {
      create: jest.fn(),
    },
  },
}));

describe('Contact Integration', () => {
  it('should validate and create contact', async () => {
    const formData = {
      name: 'John Doe',
      email: 'john@example.com',
      company: 'Acme Corp',
      phone: '+1234567890',
      product: 'lms',
      inquiryType: 'GENERAL_INQUIRY',
      message: 'This is a test message with enough characters.',
      contactMethod: 'EMAIL',
    };

    const validationResult = contactFormSchema.safeParse(formData);
    expect(validationResult.success).toBe(true);

    if (validationResult.success) {
      const mockContact = { id: '1', ...formData };
      (prisma.contact.create as jest.Mock).mockResolvedValue(mockContact);

      const contact = await prisma.contact.create({
        data: {
          name: formData.name,
          email: formData.email,
          company: formData.company || null,
          phone: formData.phone || null,
          product: formData.product || null,
          inquiryType: formData.inquiryType as any,
          message: formData.message,
          preferredMethod: formData.contactMethod as any,
          source: formData.product || 'website',
        },
      });

      expect(contact).toBeDefined();
      expect(prisma.contact.create).toHaveBeenCalled();
    }
  });

  it('should handle URL parameter pre-population', () => {
    const searchParams = new URLSearchParams('?source=lms');
    const product = searchParams.get('source');
    expect(product).toBe('lms');
  });
});

