import { Suspense } from 'react';
import ContactForm from '@/components/contact/ContactForm';

export const metadata = {
  title: 'Contact Us - Studio42.dev',
  description: 'Get in touch with Studio42.dev. We\'d love to hear from you.',
};

function ContactFormWrapper() {
  return (
    <Suspense fallback={<div>Loading form...</div>}>
      <ContactForm />
    </Suspense>
  );
}

export default function ContactPage() {
  return (
    <main>
      <section
        style={{
          padding: 'var(--spacing-5xl) var(--spacing-xl)',
          textAlign: 'center',
          backgroundColor: 'var(--color-background-secondary)',
        }}
      >
        <div className="container">
          <h1
            style={{
              fontSize: 'var(--font-size-5xl)',
              fontWeight: 'var(--font-weight-extrabold)',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--spacing-lg)',
            }}
          >
            Contact Us
          </h1>
          <p
            style={{
              fontSize: 'var(--font-size-xl)',
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--spacing-2xl)',
            }}
          >
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      <section
        style={{
          padding: 'var(--spacing-5xl) var(--spacing-xl)',
        }}
      >
        <div className="container">
          <ContactFormWrapper />
        </div>
      </section>
    </main>
  );
}

