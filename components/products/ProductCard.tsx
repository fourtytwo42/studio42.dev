import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import StatusBadge from './StatusBadge';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.slug}`}
      style={{
        display: 'block',
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      <article
        className="product-card"
        style={{
          backgroundColor: 'var(--color-background)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-card)',
          transition: 'var(--transition-base)',
          cursor: 'pointer',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)';
          e.currentTarget.style.transform = 'translateY(-4px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = 'var(--shadow-card)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        {product.thumbnail && (
          <div
            style={{
              position: 'relative',
              width: '100%',
              paddingTop: '56.25%', // 16:9 aspect ratio
              backgroundColor: 'var(--color-background-tertiary)',
              overflow: 'hidden',
            }}
          >
            <Image
              src={product.thumbnail}
              alt={product.name}
              fill
              style={{
                objectFit: 'cover',
              }}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        )}

        <div
          style={{
            padding: 'var(--spacing-lg)',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: 'var(--spacing-sm)',
            }}
          >
            <h3
              style={{
                fontSize: 'var(--font-size-xl)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--color-text-primary)',
                margin: 0,
                flex: 1,
              }}
            >
              {product.name}
            </h3>
            <StatusBadge status={product.status} />
          </div>

          {product.tagline && (
            <p
              style={{
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--color-text-secondary)',
                margin: '0 0 var(--spacing-sm) 0',
              }}
            >
              {product.tagline}
            </p>
          )}

          <p
            className="line-clamp-3"
            style={{
              fontSize: 'var(--font-size-base)',
              color: 'var(--color-text-secondary)',
              lineHeight: 'var(--line-height-relaxed)',
              margin: '0 0 var(--spacing-md) 0',
              flex: 1,
            }}
          >
            {product.description}
          </p>

          {product.pricing && (
            <div
              style={{
                marginTop: 'auto',
                paddingTop: 'var(--spacing-md)',
                borderTop: '1px solid var(--color-background-tertiary)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--color-text-primary)',
              }}
            >
              {product.pricing}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}

