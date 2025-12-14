import { Product } from '@/types';
import ProductCard from './ProductCard';
import ProductSkeleton from './ProductSkeleton';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
}

export default function ProductGrid({ products, isLoading }: ProductGridProps) {
  if (isLoading) {
    return (
      <div
        className="product-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 'var(--spacing-xl)',
          padding: 'var(--spacing-xl) 0',
        }}
      >
        {[...Array(6)].map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div
        className="product-grid-empty"
        style={{
          textAlign: 'center',
          padding: 'var(--spacing-5xl) var(--spacing-xl)',
          color: 'var(--color-text-secondary)',
        }}
      >
        <p style={{ fontSize: 'var(--font-size-lg)' }}>
          No products available at this time.
        </p>
      </div>
    );
  }

  return (
    <div
      className="product-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 'var(--spacing-xl)',
        padding: 'var(--spacing-xl) 0',
      }}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

