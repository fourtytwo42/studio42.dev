'use client';

import { Product } from '@/types';

interface ProductOverviewProps {
  product: Product;
}

export default function ProductOverview({ product }: ProductOverviewProps) {
  const description = product.description || '';
  const paragraphs = description.split('\n').filter(p => p.trim());

  return (
    <section
      className="product-overview"
      style={{
        padding: 'var(--spacing-5xl) var(--spacing-xl)',
      }}
    >
      <div className="container">
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2
            style={{
              fontSize: 'var(--font-size-3xl)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--spacing-xl)',
            }}
          >
            Overview
          </h2>
          <div
            style={{
              fontSize: 'var(--font-size-lg)',
              color: 'var(--color-text-secondary)',
              lineHeight: 'var(--line-height-relaxed)',
            }}
          >
            {paragraphs.length > 0 ? (
              paragraphs.map((paragraph, index) => (
                <p key={index} style={{ marginBottom: 'var(--spacing-lg)' }}>
                  {paragraph}
                </p>
              ))
            ) : (
              <p style={{ marginBottom: 'var(--spacing-lg)' }}>{description}</p>
            )}
          </div>
          
          {/* Key Highlights */}
          <div
            style={{
              marginTop: 'var(--spacing-5xl)',
              padding: 'var(--spacing-xl)',
              backgroundColor: 'var(--color-background-secondary)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
            }}
          >
            <h3
              style={{
                fontSize: 'var(--font-size-xl)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--spacing-lg)',
              }}
            >
              Key Highlights
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: 'var(--spacing-lg)',
              }}
            >
              <div>
                <div
                  className="product-highlight-text"
                  style={{
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--color-secondary-light)',
                    marginBottom: 'var(--spacing-xs)',
                  }}
                >
                  ✓ Enterprise Ready
                </div>
                <div
                  style={{
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  Built for organizations of all sizes
                </div>
              </div>
              <div>
                <div
                  className="product-highlight-text"
                  style={{
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--color-secondary-light)',
                    marginBottom: 'var(--spacing-xs)',
                  }}
                >
                  ✓ Self-Hosted
                </div>
                <div
                  style={{
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  Complete control over your data
                </div>
              </div>
              <div>
                <div
                  className="product-highlight-text"
                  style={{
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--color-secondary-light)',
                    marginBottom: 'var(--spacing-xs)',
                  }}
                >
                  ✓ Professional Support
                </div>
                <div
                  style={{
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  Dedicated vendor partnership
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

