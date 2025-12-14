import Link from 'next/link';
import { Product } from '@/types';

interface ProductCTAProps {
  product: Product;
}

export default function ProductCTA({ product }: ProductCTAProps) {
  return (
    <section
      className="product-cta"
      style={{
        padding: 'var(--spacing-5xl) var(--spacing-xl)',
        backgroundColor: 'var(--color-primary)',
        color: 'white',
      }}
    >
      <div className="container">
        <div
          style={{
            maxWidth: '800px',
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          <h2
            style={{
              fontSize: 'var(--font-size-3xl)',
              fontWeight: 'var(--font-weight-bold)',
              marginBottom: 'var(--spacing-lg)',
            }}
          >
            Interested in {product.name}?
          </h2>
          <p
            style={{
              fontSize: 'var(--font-size-lg)',
              marginBottom: 'var(--spacing-xl)',
              opacity: 0.9,
            }}
          >
            Get in touch with us to learn more or schedule a demo.
          </p>
          <Link
            href={`/contact?source=${product.slug}`}
            style={{
              display: 'inline-block',
              padding: 'var(--spacing-md) var(--spacing-2xl)',
              backgroundColor: 'white',
              color: 'var(--color-primary)',
              textDecoration: 'none',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--font-size-lg)',
              fontWeight: 'var(--font-weight-semibold)',
              transition: 'var(--transition-base)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}

