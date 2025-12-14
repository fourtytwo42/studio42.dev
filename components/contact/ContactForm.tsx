'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactFormSchema, parseProductFromUrl, type ContactFormData } from '@/lib/validation';
import { InquiryType, ContactMethod } from '@prisma/client';

export default function ContactForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      inquiryType: 'GENERAL_INQUIRY',
      contactMethod: 'EMAIL',
    },
  });

  // Pre-populate product from URL parameter
  useEffect(() => {
    const productSlug = parseProductFromUrl(searchParams);
    if (productSlug) {
      setValue('product', productSlug);
    }
  }, [searchParams, setValue]);

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit contact form');
      }

      // Redirect to confirmation page
      router.push('/contact/confirmation');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{
        maxWidth: '800px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-lg)',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 'var(--spacing-md)',
        }}
      >
        <div>
          <label
            htmlFor="name"
            style={{
              display: 'block',
              marginBottom: 'var(--spacing-xs)',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--color-text-primary)',
            }}
          >
            Name <span style={{ color: 'var(--color-error)' }}>*</span>
          </label>
          <input
            id="name"
            type="text"
            {...register('name')}
            style={{
              width: '100%',
              padding: 'var(--spacing-sm) var(--spacing-md)',
              border: errors.name ? '2px solid var(--color-error)' : '1px solid var(--color-text-tertiary)',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--font-size-base)',
              fontFamily: 'var(--font-family)',
            }}
          />
          {errors.name && (
            <p style={{ marginTop: 'var(--spacing-xs)', fontSize: 'var(--font-size-sm)', color: 'var(--color-error)' }}>
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            style={{
              display: 'block',
              marginBottom: 'var(--spacing-xs)',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--color-text-primary)',
            }}
          >
            Email <span style={{ color: 'var(--color-error)' }}>*</span>
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            style={{
              width: '100%',
              padding: 'var(--spacing-sm) var(--spacing-md)',
              border: errors.email ? '2px solid var(--color-error)' : '1px solid var(--color-text-tertiary)',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--font-size-base)',
              fontFamily: 'var(--font-family)',
            }}
          />
          {errors.email && (
            <p style={{ marginTop: 'var(--spacing-xs)', fontSize: 'var(--font-size-sm)', color: 'var(--color-error)' }}>
              {errors.email.message}
            </p>
          )}
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 'var(--spacing-md)',
        }}
      >
        <div>
          <label
            htmlFor="company"
            style={{
              display: 'block',
              marginBottom: 'var(--spacing-xs)',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--color-text-primary)',
            }}
          >
            Company
          </label>
          <input
            id="company"
            type="text"
            {...register('company')}
            style={{
              width: '100%',
              padding: 'var(--spacing-sm) var(--spacing-md)',
              border: '1px solid var(--color-text-tertiary)',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--font-size-base)',
              fontFamily: 'var(--font-family)',
            }}
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            style={{
              display: 'block',
              marginBottom: 'var(--spacing-xs)',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--color-text-primary)',
            }}
          >
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            {...register('phone')}
            style={{
              width: '100%',
              padding: 'var(--spacing-sm) var(--spacing-md)',
              border: '1px solid var(--color-text-tertiary)',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--font-size-base)',
              fontFamily: 'var(--font-family)',
            }}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="product"
          style={{
            display: 'block',
            marginBottom: 'var(--spacing-xs)',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 'var(--font-weight-medium)',
            color: 'var(--color-text-primary)',
          }}
        >
          Product (if applicable)
        </label>
        <input
          id="product"
          type="text"
          {...register('product')}
          style={{
            width: '100%',
            padding: 'var(--spacing-sm) var(--spacing-md)',
            border: '1px solid var(--color-text-tertiary)',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--font-size-base)',
            fontFamily: 'var(--font-family)',
          }}
        />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 'var(--spacing-md)',
        }}
      >
        <div>
          <label
            htmlFor="inquiryType"
            style={{
              display: 'block',
              marginBottom: 'var(--spacing-xs)',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--color-text-primary)',
            }}
          >
            Inquiry Type <span style={{ color: 'var(--color-error)' }}>*</span>
          </label>
          <select
            id="inquiryType"
            {...register('inquiryType')}
            style={{
              width: '100%',
              padding: 'var(--spacing-sm) var(--spacing-md)',
              border: errors.inquiryType ? '2px solid var(--color-error)' : '1px solid var(--color-text-tertiary)',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--font-size-base)',
              fontFamily: 'var(--font-family)',
            }}
          >
            <option value="GENERAL_INQUIRY">General Inquiry</option>
            <option value="REQUEST_DEMO">Request Demo</option>
            <option value="CONTACT_SALES">Contact Sales</option>
            <option value="TECHNICAL_SUPPORT">Technical Support</option>
            <option value="OTHER">Other</option>
          </select>
          {errors.inquiryType && (
            <p style={{ marginTop: 'var(--spacing-xs)', fontSize: 'var(--font-size-sm)', color: 'var(--color-error)' }}>
              {errors.inquiryType.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="contactMethod"
            style={{
              display: 'block',
              marginBottom: 'var(--spacing-xs)',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--color-text-primary)',
            }}
          >
            Preferred Contact Method <span style={{ color: 'var(--color-error)' }}>*</span>
          </label>
          <select
            id="contactMethod"
            {...register('contactMethod')}
            style={{
              width: '100%',
              padding: 'var(--spacing-sm) var(--spacing-md)',
              border: errors.contactMethod ? '2px solid var(--color-error)' : '1px solid var(--color-text-tertiary)',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--font-size-base)',
              fontFamily: 'var(--font-family)',
            }}
          >
            <option value="EMAIL">Email</option>
            <option value="PHONE">Phone</option>
            <option value="EITHER">Either</option>
          </select>
          {errors.contactMethod && (
            <p style={{ marginTop: 'var(--spacing-xs)', fontSize: 'var(--font-size-sm)', color: 'var(--color-error)' }}>
              {errors.contactMethod.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="message"
          style={{
            display: 'block',
            marginBottom: 'var(--spacing-xs)',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 'var(--font-weight-medium)',
            color: 'var(--color-text-primary)',
          }}
        >
          Message <span style={{ color: 'var(--color-error)' }}>*</span>
        </label>
        <textarea
          id="message"
          rows={8}
          {...register('message')}
          style={{
            width: '100%',
            padding: 'var(--spacing-sm) var(--spacing-md)',
            border: errors.message ? '2px solid var(--color-error)' : '1px solid var(--color-text-tertiary)',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--font-size-base)',
            fontFamily: 'var(--font-family)',
            resize: 'vertical',
          }}
        />
        {errors.message && (
          <p style={{ marginTop: 'var(--spacing-xs)', fontSize: 'var(--font-size-sm)', color: 'var(--color-error)' }}>
            {errors.message.message}
          </p>
        )}
      </div>

      {error && (
        <div
          style={{
            padding: 'var(--spacing-md)',
            backgroundColor: 'var(--color-error)',
            color: 'white',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--font-size-sm)',
          }}
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        style={{
          padding: 'var(--spacing-md) var(--spacing-xl)',
          backgroundColor: isSubmitting ? 'var(--color-text-tertiary)' : 'var(--color-primary)',
          color: 'white',
          border: 'none',
          borderRadius: 'var(--radius-md)',
          fontSize: 'var(--font-size-lg)',
          fontWeight: 'var(--font-weight-semibold)',
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
          transition: 'var(--transition-base)',
        }}
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}

