'use client';

import Image from 'next/image';
import { Product } from '@/types';
import StatusBadge from './StatusBadge';

interface ProductHeroProps {
  product: Product & {
    media?: Array<{
      id: string;
      type: string;
      url: string;
      thumbnail?: string | null;
    }>;
  };
}

export default function ProductHero({ product }: ProductHeroProps) {
  const heroImage = product.media?.find((m) => m.type === 'IMAGE')?.url || product.thumbnail;

  const handleDemoClick = () => {
    if (product.demoUrl) {
      window.open(product.demoUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section
      className="product-hero"
      style={{
        position: 'relative',
        minHeight: '400px',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'var(--color-background-secondary)',
        padding: 'var(--spacing-5xl) var(--spacing-xl)',
      }}
    >
      <div className="container" style={{ width: '100%' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'var(--spacing-5xl)',
            alignItems: 'center',
          }}
        >
          <div>
            <StatusBadge status={product.status} />
            <h1
              style={{
                fontSize: 'var(--font-size-5xl)',
                fontWeight: 'var(--font-weight-extrabold)',
                color: 'var(--color-text-primary)',
                marginTop: 'var(--spacing-md)',
                marginBottom: 'var(--spacing-lg)',
                lineHeight: 'var(--line-height-tight)',
              }}
            >
              {product.name}
            </h1>
            {product.tagline && (
              <p
                style={{
                  fontSize: 'var(--font-size-xl)',
                  color: 'var(--color-text-secondary)',
                  marginBottom: 'var(--spacing-xl)',
                }}
              >
                {product.tagline}
              </p>
            )}
            {product.demoUrl && (
              <div style={{ marginTop: 'var(--spacing-lg)' }}>
                <button
                  onClick={handleDemoClick}
                  style={{
                    padding: 'var(--spacing-md) var(--spacing-2xl)',
                    background: 'var(--gradient-primary-subtle)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--font-size-lg)',
                    fontWeight: 'var(--font-weight-semibold)',
                    cursor: 'pointer',
                    transition: 'var(--transition-base)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-sm)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--gradient-primary)';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--gradient-primary-subtle)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <span>🚀</span>
                  <span>Try Live Demo</span>
                </button>
              </div>
            )}
          </div>
          <div
            style={{
              position: 'relative',
              width: '100%',
              paddingTop: '56.25%',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              backgroundColor: 'var(--color-background-tertiary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {heroImage ? (
              <Image
                src={heroImage}
                alt={product.name}
                fill
                style={{
                  objectFit: 'cover',
                }}
                priority
              />
            ) : (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-text-tertiary)',
                  fontSize: 'var(--font-size-2xl)',
                  fontWeight: 'var(--font-weight-semibold)',
                  textAlign: 'center',
                  padding: 'var(--spacing-xl)',
                }}
              >
                {product.name}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

