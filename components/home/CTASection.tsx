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
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated background elements */}
      <div
        style={{
          position: 'absolute',
          top: '-30%',
          right: '-10%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'pulse 8s ease-in-out infinite',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-30%',
          left: '-10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'pulse 10s ease-in-out infinite reverse',
        }}
      />

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.2); opacity: 0.8; }
        }
      `}</style>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div
          style={{
            maxWidth: '800px',
            margin: '0 auto',
          }}
        >
          <div
            style={{
              display: 'inline-block',
              padding: 'var(--spacing-sm) var(--spacing-lg)',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: 'var(--radius-full)',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-medium)',
              marginBottom: 'var(--spacing-lg)',
              backdropFilter: 'blur(10px)',
            }}
          >
            🚀 Let's Build Something Great
          </div>
          
          <h2
            style={{
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 'var(--font-weight-extrabold)',
              marginBottom: 'var(--spacing-lg)',
              lineHeight: 'var(--line-height-tight)',
            }}
          >
            Ready to Transform Your Organization?
          </h2>
          <p
            style={{
              fontSize: 'var(--font-size-xl)',
              marginBottom: 'var(--spacing-md)',
              opacity: 0.95,
              fontWeight: 'var(--font-weight-semibold)',
            }}
          >
            Explore our products, schedule a demo, or get in touch
          </p>
          <p
            style={{
              fontSize: 'var(--font-size-lg)',
              marginBottom: 'var(--spacing-3xl)',
              opacity: 0.9,
              lineHeight: 'var(--line-height-relaxed)',
            }}
          >
            Learn more about how we can help your organization achieve its goals with premium, self-hosted solutions.
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
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--spacing-sm)',
                padding: 'var(--spacing-md) var(--spacing-2xl)',
                backgroundColor: 'white',
                color: 'var(--color-primary)',
                textDecoration: 'none',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--font-size-lg)',
                fontWeight: 'var(--font-weight-semibold)',
                transition: 'var(--transition-base)',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 0, 0, 0.15)';
              }}
            >
              <span>Explore Products</span>
              <span>→</span>
            </Link>
            <Link
              href="/contact"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--spacing-sm)',
                padding: 'var(--spacing-md) var(--spacing-2xl)',
                backgroundColor: 'transparent',
                color: 'white',
                textDecoration: 'none',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--font-size-lg)',
                fontWeight: 'var(--font-weight-semibold)',
                border: '2px solid rgba(255, 255, 255, 0.8)',
                transition: 'var(--transition-base)',
                backdropFilter: 'blur(10px)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                e.currentTarget.style.borderColor = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.8)';
              }}
            >
              <span>Get in Touch</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

