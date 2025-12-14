import { Product } from '@/types';

interface ProductOverviewProps {
  product: Product;
}

export default function ProductOverview({ product }: ProductOverviewProps) {
  return (
    <section
      className="product-overview"
      style={{
        padding: 'var(--spacing-5xl) var(--spacing-xl)',
      }}
    >
      <div className="container">
        <h2
          style={{
            fontSize: 'var(--font-size-3xl)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-text-primary)',
            marginBottom: 'var(--spacing-lg)',
          }}
        >
          Overview
        </h2>
        <div
          style={{
            fontSize: 'var(--font-size-lg)',
            color: 'var(--color-text-secondary)',
            lineHeight: 'var(--line-height-relaxed)',
            maxWidth: '800px',
          }}
        >
          {product.description.split('\n').map((paragraph, index) => (
            <p key={index} style={{ marginBottom: 'var(--spacing-md)' }}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

