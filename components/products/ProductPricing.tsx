import { Product } from '@/types';

interface ProductPricingProps {
  product: Product;
}

export default function ProductPricing({ product }: ProductPricingProps) {
  if (!product.pricing) {
    return null;
  }

  return (
    <section
      className="product-pricing"
      style={{
        padding: 'var(--spacing-5xl) var(--spacing-xl)',
      }}
    >
      <div className="container">
        <div
          style={{
            maxWidth: '600px',
            margin: '0 auto',
            textAlign: 'center',
            padding: 'var(--spacing-5xl)',
            backgroundColor: 'var(--color-background-secondary)',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <h2
            style={{
              fontSize: 'var(--font-size-3xl)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--spacing-lg)',
            }}
          >
            Pricing
          </h2>
          <p
            className="product-pricing-text"
            style={{
              fontSize: 'var(--font-size-2xl)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--color-secondary-light)',
            }}
          >
            {product.pricing}
          </p>
        </div>
      </div>
    </section>
  );
}

