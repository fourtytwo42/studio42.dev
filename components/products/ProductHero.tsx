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
          </div>
          {heroImage && (
            <div
              style={{
                position: 'relative',
                width: '100%',
                paddingTop: '56.25%',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                backgroundColor: 'var(--color-background-tertiary)',
              }}
            >
              <Image
                src={heroImage}
                alt={product.name}
                fill
                style={{
                  objectFit: 'cover',
                }}
                priority
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

