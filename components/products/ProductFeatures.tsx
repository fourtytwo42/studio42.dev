import { Product } from '@/types';

interface ProductFeaturesProps {
  product: Product;
}

export default function ProductFeatures({ product }: ProductFeaturesProps) {
  if (!product.features || product.features.length === 0) {
    return null;
  }

  return (
    <section
      className="product-features"
      style={{
        padding: 'var(--spacing-5xl) var(--spacing-xl)',
        backgroundColor: 'var(--color-background-secondary)',
      }}
    >
      <div className="container">
        <h2
          style={{
            fontSize: 'var(--font-size-3xl)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-text-primary)',
            marginBottom: 'var(--spacing-xl)',
            textAlign: 'center',
          }}
        >
          Features
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 'var(--spacing-xl)',
          }}
        >
          {product.features.map((feature, index) => (
            <div
              key={index}
              style={{
                padding: 'var(--spacing-lg)',
                backgroundColor: 'var(--color-background)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <h3
                style={{
                  fontSize: 'var(--font-size-xl)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-text-primary)',
                  marginBottom: 'var(--spacing-sm)',
                }}
              >
                {feature.title}
              </h3>
              <p
                style={{
                  fontSize: 'var(--font-size-base)',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 'var(--line-height-relaxed)',
                }}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

