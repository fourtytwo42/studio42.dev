'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import StatusBadge from './StatusBadge';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const handleDemoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (product.demoUrl) {
      window.open(product.demoUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
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
        position: 'relative',
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
      <Link
        href={`/products/${product.slug}`}
        style={{
          display: 'block',
          textDecoration: 'none',
          color: 'inherit',
          flex: 1,
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            paddingTop: '56.25%', // 16:9 aspect ratio
            backgroundColor: 'var(--color-background-tertiary)',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {product.thumbnail ? (
            <Image
              src={product.thumbnail}
              alt={product.name}
              fill
              style={{
                objectFit: 'cover',
              }}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
                fontSize: 'var(--font-size-lg)',
                fontWeight: 'var(--font-weight-medium)',
              }}
            >
              {product.name}
            </div>
          )}
        </div>

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
      </Link>
      
      {product.demoUrl && (
        <div
          style={{
            padding: 'var(--spacing-md) var(--spacing-lg)',
            borderTop: '1px solid var(--color-background-tertiary)',
          }}
        >
          <button
            onClick={handleDemoClick}
            style={{
              width: '100%',
              padding: 'var(--spacing-sm) var(--spacing-md)',
              background: 'var(--gradient-primary-subtle)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-semibold)',
              cursor: 'pointer',
              transition: 'var(--transition-base)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--gradient-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--gradient-primary-subtle)';
            }}
          >
            View Demo
          </button>
        </div>
      )}
    </article>
  );
}

