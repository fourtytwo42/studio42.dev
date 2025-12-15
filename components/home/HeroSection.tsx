'use client';

import Link from 'next/link';

export default function HeroSection() {
  return (
    <section
      className="hero-section"
      style={{
        position: 'relative',
        padding: 'var(--spacing-5xl) var(--spacing-xl)',
        textAlign: 'center',
        background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
        color: 'white',
        overflow: 'hidden',
      }}
    >
      {/* Background decoration */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          backgroundImage: 'radial-gradient(circle at 20% 50%, white 0%, transparent 50%), radial-gradient(circle at 80% 80%, white 0%, transparent 50%)',
        }}
      />
      
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div
          style={{
            maxWidth: '800px',
            margin: '0 auto',
          }}
        >
          <h1
            style={{
              fontSize: 'var(--font-size-6xl)',
              fontWeight: 'var(--font-weight-extrabold)',
              marginBottom: 'var(--spacing-lg)',
              lineHeight: 'var(--line-height-tight)',
            }}
          >
            Studio42.dev
          </h1>
          <p
            style={{
              fontSize: 'var(--font-size-2xl)',
              marginBottom: 'var(--spacing-md)',
              opacity: 0.95,
            }}
          >
            Premium SaaS Products
          </p>
          <p
            style={{
              fontSize: 'var(--font-size-lg)',
              marginBottom: 'var(--spacing-2xl)',
              opacity: 0.9,
              lineHeight: 'var(--line-height-relaxed)',
            }}
          >
            Building powerful, self-hosted solutions for modern organizations. 
            Premium quality, fully customizable, and enterprise-ready.
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
              Get in Touch
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

