import { z } from 'zod';

/**
 * Contact form validation schema
 */
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: z
    .string()
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters'),
  company: z
    .string()
    .max(200, 'Company name must be less than 200 characters')
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .max(20, 'Phone number must be less than 20 characters')
    .optional()
    .or(z.literal('')),
  product: z
    .string()
    .max(100, 'Product name must be less than 100 characters')
    .optional()
    .or(z.literal('')),
  inquiryType: z.enum(['GENERAL_INQUIRY', 'REQUEST_DEMO', 'CONTACT_SALES', 'TECHNICAL_SUPPORT', 'OTHER']),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message must be less than 5000 characters'),
  contactMethod: z.enum(['EMAIL', 'PHONE', 'EITHER']),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

/**
 * Parse product slug from URL parameter
 */
export function parseProductFromUrl(searchParams: URLSearchParams): string | null {
  const source = searchParams.get('source');
  // Return empty string as-is, null only if parameter doesn't exist
  return source === null ? null : source;
}

