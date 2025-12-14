# Universal Contact System

Complete specification for the universal contact system that works across all product subdomains.

## Overview

The universal contact system allows any subdomain (e.g., `lms.studio42.dev`) to link to a central contact page on the main website (`studio42.dev/contact`) with automatic form population based on URL parameters.

## URL Parameter System

### Parameter Name

**Parameter:** `source`

**Usage:**
- From subdomain: `https://studio42.dev/contact?source=lms.studio42.dev`
- From product page: `https://studio42.dev/contact?source=lms`
- Direct access: `https://studio42.dev/contact` (no pre-population)

### Parameter Values

- **Subdomain format:** `lms.studio42.dev`, `product1.studio42.dev`, etc.
- **Product slug format:** `lms`, `product-1`, etc.
- **Custom format:** Any string (for tracking purposes)

## Contact Form Fields

### Form Layout

**Container:**
- Max-width: 800px
- Centered with auto margins
- Padding: 24px (mobile) to 48px (desktop)
- Background: White
- Border-radius: 16px
- Shadow: `0 4px 6px rgba(0,0,0,0.1)`

**Form Structure:**
- Two-column layout on desktop (fields side-by-side where appropriate)
- Single column on mobile
- Gap: 24px between fields
- Section spacing: 32px between groups

### Required Fields

1. **Name**
   - **Type:** Text input
   - **Label:** "Name" (required indicator: asterisk)
   - **Typography:** 
     - Label: 14px, 600 weight, color `#374151`
     - Input: 16px, 400 weight, color `#111827`
   - **Styling:**
     - Width: 100% (mobile) or 50% (desktop, if two-column)
     - Padding: 12px 16px
     - Border: 1px solid `#d1d5db`
     - Border-radius: 8px
     - Focus: Border `#6366f1`, outline 2px solid `#6366f1` with 20% opacity
   - **Validation:**
     - Required: Show error "Name is required"
     - Max length: 255 characters
     - Show character count if approaching limit (optional)
   - **Placeholder:** "Your name"
   - **Error Message:** 
     - Position: Below input, 8px margin
     - Color: `#ef4444`
     - Font: 14px, 400 weight
     - Icon: Small error icon (optional)

2. **Email**
   - **Type:** Email input
   - **Label:** "Email" (required indicator: asterisk)
   - **Typography:** Same as Name field
   - **Styling:** Same as Name field
   - **Validation:**
     - Required: Show error "Email is required"
     - Format: Valid email regex pattern
     - Error: "Please enter a valid email address"
   - **Placeholder:** "your.email@example.com"
   - **Auto-complete:** `email` attribute

3. **Inquiry Type**
   - **Type:** Select dropdown
   - **Label:** "Inquiry Type" (required indicator: asterisk)
   - **Typography:** Same as Name field
   - **Styling:**
     - Width: 100% (mobile) or 50% (desktop)
     - Padding: 12px 16px
     - Border: 1px solid `#d1d5db`
     - Border-radius: 8px
     - Background: White
     - Dropdown arrow: Custom styled
   - **Options:**
     - "Request Demo" (value: `REQUEST_DEMO`)
     - "Contact Sales" (value: `CONTACT_SALES`)
     - "General Inquiry" (value: `GENERAL_INQUIRY`)
     - "Technical Support" (value: `TECHNICAL_SUPPORT`)
     - "Other" (value: `OTHER`)
   - **Default:** "General Inquiry" (`GENERAL_INQUIRY`)
   - **Validation:** Required

4. **Message**
   - **Type:** Textarea
   - **Label:** "Message" (required indicator: asterisk)
   - **Typography:** Same as Name field
   - **Styling:**
     - Width: 100% (full width, always)
     - Padding: 12px 16px
     - Border: 1px solid `#d1d5db`
     - Border-radius: 8px
     - Min-height: 120px
     - Resize: Vertical only
   - **Validation:**
     - Required: Show error "Message is required"
     - Max length: 5000 characters
     - Character counter: Show remaining characters (e.g., "4,850 characters remaining")
   - **Placeholder:** "Tell us about your inquiry..."
   - **Character Counter:**
     - Position: Bottom-right of textarea
     - Typography: 12px, 400 weight, color `#6b7280`
     - Warning: Red when < 100 characters remaining

### Optional Fields

1. **Company/Organization**
   - **Type:** Text input
   - **Label:** "Company/Organization" (no asterisk)
   - **Typography:** Same as Name field
   - **Styling:** Same as Name field
   - **Width:** 100% (mobile) or 50% (desktop)
   - **Validation:**
     - Optional: No error if empty
     - Max length: 255 characters
   - **Placeholder:** "Your company (optional)"

2. **Phone**
   - **Type:** Tel input
   - **Label:** "Phone" (no asterisk)
   - **Typography:** Same as Name field
   - **Styling:** Same as Name field
   - **Width:** 100% (mobile) or 50% (desktop)
   - **Validation:**
     - Optional: No error if empty
     - Max length: 50 characters
     - Format: Accepts any format (no strict validation)
   - **Placeholder:** "+1 (555) 123-4567"
   - **Auto-complete:** `tel` attribute

3. **Product/Project** (Auto-populated)
   - **Type:** Select dropdown (editable)
   - **Label:** "Product/Project" (no asterisk)
   - **Typography:** Same as Name field
   - **Styling:** Same as Inquiry Type dropdown
   - **Width:** 100% (mobile) or 50% (desktop)
   - **Options:**
     - "General" (value: `null` or empty)
     - All products from database (value: product slug)
     - Format: Product name (e.g., "AI Microlearning LMS")
   - **Auto-population Logic:**
     ```typescript
     // Extract product identifier from source parameter
     function extractProductSlug(source: string | null): string | null {
       if (!source) return null;
       
       // If subdomain format: "lms.studio42.dev" → extract "lms"
       if (source.includes('.')) {
         const subdomain = source.split('.')[0];
         return subdomain;
       }
       
       // If slug format: "lms" → return as-is
       return source;
     }
     
     // Match to product in database
     const productSlug = extractProductSlug(searchParams.get('source'));
     const product = productSlug 
       ? await prisma.product.findUnique({ where: { slug: productSlug } })
       : null;
     ```
   - **Default:** "General" if no match or no source parameter
   - **User Editable:** Yes, user can change selection

4. **Preferred Contact Method**
   - **Type:** Radio button group
   - **Label:** "Preferred Contact Method" (no asterisk)
   - **Typography:** Same as Name field
   - **Layout:** Horizontal (side-by-side) on desktop, vertical on mobile
   - **Spacing:** 16px gap between options
   - **Options:**
     - "Email" (value: `EMAIL`) - Default selected
     - "Phone" (value: `PHONE`)
     - "Either" (value: `EITHER`)
   - **Styling:**
     - Radio button: 20px diameter
     - Border: 2px solid `#d1d5db`
     - Selected: Border `#6366f1`, inner circle `#6366f1`
     - Label: 16px, 400 weight, clickable
     - Hover: Border color change
   - **Default:** "Email" (`EMAIL`)

### Submit Button

**Styling:**
- Width: 100% (mobile) or auto (desktop, min 200px)
- Padding: 16px 32px
- Background: Brand primary color (`#6366f1`)
- Text: White, 16px, 600 weight
- Border-radius: 8px
- Border: None
- Hover: Darken background 10%, scale 1.02x
- Active: Scale 0.98x
- Transition: 200ms ease
- Disabled: Opacity 0.5, cursor not-allowed

**States:**
- **Default:** "Send Message"
- **Loading:** "Sending..." with spinner icon
- **Success:** Redirect to confirmation page
- **Error:** Show error message, keep form data

## Form Behavior

### Initial Load

1. **Read URL Parameter:**
   - Check for `?source=` parameter
   - Extract product identifier

2. **Product Matching:**
   - Query database for product matching the source
   - If match found, pre-select product dropdown
   - If no match, leave as "General"

3. **Form Display:**
   - Show form with pre-populated product field (if applicable)
   - All other fields empty
   - Form ready for user input

### Form Submission

1. **Client-Side Validation:**
   - Validate all required fields
   - Validate email format
   - Validate message length
   - Show inline error messages

2. **Submit to API:**
   - POST to `/api/contacts`
   - Include all form data
   - Include `source` parameter value

3. **Server-Side Processing:**
   - Validate all fields
   - Check rate limiting
   - Insert into database
   - Send emails (if enabled)
   - Return success response

4. **Redirect:**
   - Redirect to `/contact/confirmation`
   - Pass contact ID in URL or session

## Confirmation Page

### URL

`/contact/confirmation`

### Layout

**Container:**
- Max-width: 800px
- Centered with auto margins
- Padding: 48px (mobile) to 64px (desktop)
- Background: White
- Border-radius: 16px
- Shadow: `0 4px 6px rgba(0,0,0,0.1)`

### Content

1. **Success Icon:**
   - Large checkmark icon (64px × 64px)
   - Color: `#10b981` (green)
   - Centered, margin: 0 0 24px 0

2. **Success Message:**
   - **Heading:** "Thank you for contacting us!"
     - Typography: 32px (mobile) to 40px (desktop), 700 weight
     - Color: Primary text (`#111827`)
     - Alignment: Center
     - Margin: 0 0 16px 0
   - **Subheading:** "We'll get back to you soon."
     - Typography: 18px, 400 weight
     - Color: Secondary text (`#6b7280`)
     - Alignment: Center
     - Margin: 0 0 48px 0

3. **Contact Summary:**
   - **Container:** 
     - Background: `#f9fafb`
     - Border-radius: 12px
     - Padding: 24px
     - Margin: 0 0 32px 0
   - **Fields Display:**
     - Layout: Two-column on desktop, single column on mobile
     - Each field:
       - Label: 14px, 600 weight, color `#6b7280`
       - Value: 16px, 400 weight, color `#111827`
       - Spacing: 8px between label and value, 16px between fields
   - **Fields Shown:**
     - Name
     - Email
     - Company (if provided)
     - Phone (if provided)
     - Product (if not "General")
     - Inquiry Type
     - Preferred Contact Method
     - Message (truncated to 200 characters with "..." if longer)

4. **Next Steps:**
   - **Container:**
     - Background: `#eff6ff` (light blue)
     - Border: 1px solid `#bfdbfe`
     - Border-radius: 12px
     - Padding: 20px
     - Margin: 0 0 32px 0
   - **Content:**
     - Icon: Info icon (20px, color `#3b82f6`)
     - Text: 
       - "You'll receive a confirmation email shortly" (if email enabled)
       - "Our team will review your inquiry and respond within 24 hours"
     - Typography: 16px, 400 weight, color `#1e40af`
     - Line height: 1.6

5. **Actions:**
   - **Layout:** Flexbox, gap 16px
   - **Buttons:**
     - **Primary:** "Return to Home"
       - Link: `/`
       - Styling: Same as form submit button
     - **Secondary:** "View Product" (if product-specific)
       - Link: `/products/[slug]`
       - Styling: Outline style (transparent, border)
       - Condition: Only show if product is not "General"
   - **Mobile:** Stack vertically, full width
   - **Desktop:** Side by side, auto width

## Email Notifications

### User Confirmation Email

**Trigger:** After successful form submission (if email enabled)

**Recipient:** User's email address

**Content:**
- Subject: "Thank you for contacting Studio42"
- Body:
  - Greeting with user's name
  - Confirmation of inquiry received
  - Product they inquired about (if applicable)
  - Inquiry type
  - Expected response time
  - Contact information for follow-up

**Template Variables:**
- `{name}` - User's name
- `{product}` - Product name (if applicable)
- `{inquiryType}` - Inquiry type
- `{message}` - User's message (optional, may be truncated)

### Admin Notification Email

**Trigger:** After successful form submission (if email enabled)

**Recipient:** Admin email (from email config)

**Content:**
- Subject: "New Contact Form Submission - {Product}"
- Body:
  - All form fields
  - Source (which subdomain/page they came from)
  - Timestamp
  - Link to admin dashboard

**Template Variables:**
- All contact form fields
- `{source}` - Source URL parameter
- `{timestamp}` - Submission timestamp
- `{adminDashboardUrl}` - Link to admin dashboard

## Admin Dashboard Integration

### Contact Management Table

**Location:** `/admin/contacts`

**Features:**
- View all contact submissions
- Filter by:
  - Read/Unread
  - Product
  - Inquiry type
  - Date range
- Search by name or email
- Sort by date (newest first)
- Mark as read/responded
- View full contact details

### Contact Details View

**Shows:**
- All form fields
- Source (where they came from)
- Submission timestamp
- Read/responded status
- Actions:
  - Mark as read
  - Mark as responded
  - Delete (with confirmation)

## Email Configuration

### Admin Configuration Page

**Location:** `/admin/email-config`

**Settings:**
- Enable/Disable email notifications
- SMTP Configuration:
  - Host
  - Port
  - Username
  - Password (encrypted storage)
  - Secure (TLS/SSL)
- Email Addresses:
  - From email
  - From name
  - Admin notification email
- Email Templates:
  - User confirmation template
  - Admin notification template

### Template Editor

**Features:**
- Rich text editor (or markdown)
- Variable insertion (dropdown)
- Preview functionality
- Save/Cancel buttons

**Available Variables:**
- User: `{name}`, `{email}`, `{company}`, `{phone}`
- Product: `{product}`, `{productName}`
- Inquiry: `{inquiryType}`, `{message}`
- System: `{timestamp}`, `{source}`

## Implementation Details

### Frontend Component

**File:** `app/contact/page.tsx`

**Complete Implementation Example:**
```typescript
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Validation schema
const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
  email: z.string().email('Please enter a valid email address'),
  company: z.string().max(255, 'Company name is too long').optional(),
  phone: z.string().max(50, 'Phone number is too long').optional(),
  product: z.string().nullable().optional(),
  inquiryType: z.enum(['REQUEST_DEMO', 'CONTACT_SALES', 'GENERAL_INQUIRY', 'TECHNICAL_SUPPORT', 'OTHER']),
  message: z.string().min(1, 'Message is required').max(5000, 'Message is too long'),
  preferredMethod: z.enum(['EMAIL', 'PHONE', 'EITHER']).default('EMAIL'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Array<{ slug: string; name: string }>>([]);
  const source = searchParams.get('source');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      preferredMethod: 'EMAIL',
      inquiryType: 'GENERAL_INQUIRY',
      product: null,
    },
  });

  // Fetch products and match source parameter
  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts([{ slug: '', name: 'General' }, ...data.products]);

        // Match source parameter to product
        if (source) {
          const productSlug = extractProductSlug(source);
          const matchedProduct = data.products.find(
            (p: { slug: string }) => p.slug === productSlug
          );
          if (matchedProduct) {
            setValue('product', matchedProduct.slug);
          }
        }
      } catch (err) {
        console.error('Failed to load products:', err);
      }
    }
    loadProducts();
  }, [source, setValue]);

  function extractProductSlug(source: string): string | null {
    if (source.includes('.')) {
      return source.split('.')[0];
    }
    return source;
  }

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          source: source || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to submit form');
      }

      const result = await response.json();
      router.push(`/contact/confirmation?id=${result.contactId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsSubmitting(false);
    }
  };

  const messageLength = watch('message')?.length || 0;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Contact Us</h1>
      <p className={styles.subtitle}>
        Have a question? We'd love to hear from you.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        {/* Form fields with register() and error display */}
        {/* ... */}
        
        {error && (
          <div className={styles.errorMessage} role="alert">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={styles.submitButton}
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
}
```

### API Route

**File:** `app/api/contacts/route.ts`

**Complete Implementation Example:**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { rateLimit } from '@/lib/rate-limit';
import { sendEmail } from '@/lib/email';

const contactSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email(),
  company: z.string().max(255).optional().nullable(),
  phone: z.string().max(50).optional().nullable(),
  product: z.string().nullable().optional(),
  inquiryType: z.enum(['REQUEST_DEMO', 'CONTACT_SALES', 'GENERAL_INQUIRY', 'TECHNICAL_SUPPORT', 'OTHER']),
  message: z.string().min(1).max(5000),
  preferredMethod: z.enum(['EMAIL', 'PHONE', 'EITHER']),
  source: z.string().nullable().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    const { success } = await rateLimit.limit(ip);
    
    if (!success) {
      return NextResponse.json(
        { error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests. Please try again later.' } },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = contactSchema.parse(body);

    // Insert into database
    const contact = await prisma.contact.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        company: validatedData.company || null,
        phone: validatedData.phone || null,
        product: validatedData.product || null,
        inquiryType: validatedData.inquiryType,
        message: validatedData.message,
        preferredMethod: validatedData.preferredMethod,
        source: validatedData.source || null,
      },
    });

    // Send emails if enabled
    const emailConfig = await prisma.emailConfig.findFirst();
    if (emailConfig?.enabled) {
      try {
        // Send confirmation email to user
        await sendEmail({
          to: validatedData.email,
          subject: 'Thank you for contacting Studio42',
          template: emailConfig.confirmationTemplate || '',
          variables: {
            name: validatedData.name,
            product: validatedData.product || 'General',
            inquiryType: validatedData.inquiryType,
          },
        });

        // Send notification email to admin
        if (emailConfig.adminEmail) {
          await sendEmail({
            to: emailConfig.adminEmail,
            subject: `New Contact Form Submission - ${validatedData.product || 'General'}`,
            template: emailConfig.notificationTemplate || '',
            variables: {
              ...validatedData,
              timestamp: new Date().toISOString(),
              adminDashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/admin/contacts/${contact.id}`,
            },
          });
        }
      } catch (emailError) {
        // Log error but don't fail the request
        console.error('Failed to send email:', emailError);
      }
    }

    return NextResponse.json({
      success: true,
      contactId: contact.id,
      message: 'Contact submitted successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid form data',
            details: error.errors,
          },
        },
        { status: 400 }
      );
    }

    console.error('Contact submission error:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while submitting your form',
        },
      },
      { status: 500 }
    );
  }
}
```

### Database Schema

See [Database Schema](../database-schema.md) for `Contact` model specification.

## Security Considerations

1. **Rate Limiting:** 5 submissions per hour per IP
2. **Input Validation:** Server-side validation of all fields
3. **Email Validation:** Proper email format validation
4. **XSS Prevention:** Sanitize all user inputs
5. **CSRF Protection:** Next.js built-in CSRF protection
6. **SQL Injection:** Prisma ORM prevents SQL injection

## Testing Scenarios

1. **Form Submission:**
   - Valid submission with all fields
   - Valid submission with minimal fields
   - Invalid email format
   - Missing required fields
   - Message too long

2. **URL Parameters:**
   - Valid product slug
   - Invalid product slug
   - Subdomain format
   - No parameter

3. **Email Notifications:**
   - Email enabled, successful send
   - Email enabled, send failure
   - Email disabled

4. **Rate Limiting:**
   - Normal usage
   - Exceeding rate limit

5. **Admin Dashboard:**
   - View contacts
   - Filter contacts
   - Mark as read
   - View details

