'use client';

import Link from 'next/link';

export default function CTASection() {
  return (
    <section
      className="cta-section"
      style={{
        padding: 'var(--spacing-5xl) var(--spacing-xl)',
        background: 'var(--gradient-primary)',
        color: 'white',
        textAlign: 'center',
      }}
    >
      <div className="container">
        <div
          style={{
            maxWidth: '700px',
            margin: '0 auto',
          }}
        >
          <h2
            style={{
              fontSize: 'var(--font-size-3xl)',
              fontWeight: 'var(--font-weight-bold)',
              marginBottom: 'var(--spacing-lg)',
            }}
          >
            Ready to Get Started?
          </h2>
          <p
            style={{
              fontSize: 'var(--font-size-lg)',
              marginBottom: 'var(--spacing-xl)',
              opacity: 0.95,
              lineHeight: 'var(--line-height-relaxed)',
            }}
          >
            Explore our products, schedule a demo, or get in touch to learn more about how we can help your organization.
          </p>
          <div
            style={{
              display: 'flex',
              gap: 'var(--spacing-lg)',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Link
              href="#products"
              style={{
                display: 'inline-block',
                padding: 'var(--spacing-md) var(--spacing-2xl)',
                backgroundColor: 'white',
                color: 'var(--color-primary)',
                textDecoration: 'none',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--font-size-lg)',
                fontWeight: 'var(--font-weight-semibold)',
                transition: 'var(--transition-base)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              View Products
            </Link>
            <Link
              href="/contact"
              style={{
                display: 'inline-block',
                padding: 'var(--spacing-md) var(--spacing-2xl)',
                backgroundColor: 'transparent',
                color: 'white',
                textDecoration: 'none',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--font-size-lg)',
                fontWeight: 'var(--font-weight-semibold)',
                border: '2px solid white',
                transition: 'var(--transition-base)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

