'use client';

import { Product } from '@/types';

interface ProductBenefitsProps {
  product: Product;
}

const benefits = [
  {
    title: 'Self-Hosted & Private',
    description: 'Complete control over your data with on-premise deployment. No vendor lock-in, no data sharing.',
  },
  {
    title: 'Cost Effective',
    description: 'Transparent pricing with no per-user licensing fees. Pay only for the solution and optional professional support.',
  },
  {
    title: 'Fully Customizable',
    description: 'White-label solution that you can brand and customize to match your organization\'s identity.',
  },
  {
    title: 'Modern Technology',
    description: 'Built with Next.js 16, React 19, and PostgreSQL. Fast, scalable, and future-proof architecture.',
  },
  {
    title: 'Comprehensive Analytics',
    description: 'Track learner progress, completion rates, and engagement metrics with detailed reporting dashboards.',
  },
  {
    title: 'Enterprise Ready',
    description: 'Role-based access control, bulk operations, and advanced features for large organizations.',
  },
];

export default function ProductBenefits({ product }: ProductBenefitsProps) {
  return (
    <section
      className="product-benefits"
      style={{
        padding: 'var(--spacing-5xl) var(--spacing-xl)',
      }}
    >
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-5xl)' }}>
          <h2
            style={{
              fontSize: 'var(--font-size-3xl)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--spacing-md)',
            }}
          >
            Why Choose {product.name}?
          </h2>
          <p
            style={{
              fontSize: 'var(--font-size-lg)',
              color: 'var(--color-text-secondary)',
              maxWidth: '600px',
              margin: '0 auto',
            }}
          >
            Experience the benefits of a modern, flexible learning management system designed for the future.
          </p>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'var(--spacing-xl)',
          }}
        >
          {benefits.map((benefit, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                gap: 'var(--spacing-lg)',
                padding: 'var(--spacing-lg)',
                backgroundColor: 'var(--color-background-secondary)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)',
                transition: 'var(--transition-base)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateX(4px)';
                e.currentTarget.style.borderColor = 'var(--color-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.borderColor = 'var(--color-border)';
              }}
            >
              <div
                style={{
                  flexShrink: 0,
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-primary)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  fontWeight: 'var(--font-weight-bold)',
                }}
              >
                ✓
              </div>
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    fontSize: 'var(--font-size-lg)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--color-text-primary)',
                    marginBottom: 'var(--spacing-xs)',
                  }}
                >
                  {benefit.title}
                </h3>
                <p
                  style={{
                    fontSize: 'var(--font-size-base)',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 'var(--line-height-relaxed)',
                  }}
                >
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

