import Link from 'next/link';

export default function ContactConfirmation() {
  return (
    <div
      style={{
        maxWidth: '600px',
        margin: '0 auto',
        textAlign: 'center',
        padding: 'var(--spacing-5xl) var(--spacing-xl)',
      }}
    >
      <div
        style={{
          fontSize: '64px',
          marginBottom: 'var(--spacing-lg)',
        }}
      >
        ✓
      </div>
      <h1
        style={{
          fontSize: 'var(--font-size-4xl)',
          fontWeight: 'var(--font-weight-bold)',
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--spacing-md)',
        }}
      >
        Thank You!
      </h1>
      <p
        style={{
          fontSize: 'var(--font-size-lg)',
          color: 'var(--color-text-secondary)',
          marginBottom: 'var(--spacing-xl)',
        }}
      >
        We've received your message and will get back to you as soon as possible.
      </p>
      <div
        style={{
          display: 'flex',
          gap: 'var(--spacing-md)',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        <Link
          href="/"
          style={{
            display: 'inline-block',
            padding: 'var(--spacing-md) var(--spacing-xl)',
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--font-size-base)',
            fontWeight: 'var(--font-weight-medium)',
          }}
        >
          Back to Home
        </Link>
        <Link
          href="/contact"
          style={{
            display: 'inline-block',
            padding: 'var(--spacing-md) var(--spacing-xl)',
            backgroundColor: 'var(--color-background)',
            color: 'var(--color-text-primary)',
            textDecoration: 'none',
            borderRadius: 'var(--radius-md)',
            border: '2px solid var(--color-text-tertiary)',
            fontSize: 'var(--font-size-base)',
            fontWeight: 'var(--font-weight-medium)',
          }}
        >
          Send Another Message
        </Link>
      </div>
    </div>
  );
}

