'use client';

import { Product } from '@/types';

interface ProductStatsProps {
  product: Product;
}

const stats = [
  { label: 'Self-Hosted', value: '100%' },
  { label: 'Premium Quality', value: 'Enterprise' },
  { label: 'Customizable', value: 'Fully' },
  { label: 'Support', value: 'Available' },
];

export default function ProductStats({ product }: ProductStatsProps) {
  return (
    <section
      className="product-stats"
      style={{
        padding: 'var(--spacing-5xl) var(--spacing-xl)',
        background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
        color: 'white',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--spacing-2xl)',
            textAlign: 'center',
          }}
        >
          {stats.map((stat, index) => (
            <div key={index}>
              <div
                style={{
                  fontSize: 'var(--font-size-4xl)',
                  fontWeight: 'var(--font-weight-extrabold)',
                  marginBottom: 'var(--spacing-sm)',
                  opacity: 0.95,
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: 'var(--font-size-base)',
                  opacity: 0.9,
                  fontWeight: 'var(--font-weight-medium)',
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

