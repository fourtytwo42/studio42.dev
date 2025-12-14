import Link from 'next/link';

interface BreadcrumbProps {
  productName: string;
}

export default function Breadcrumb({ productName }: BreadcrumbProps) {
  return (
    <nav
      className="breadcrumb"
      style={{
        padding: 'var(--spacing-lg) var(--spacing-xl)',
        backgroundColor: 'var(--color-background-secondary)',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-sm)',
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-secondary)',
          }}
        >
          <Link
            href="/"
            style={{
              color: 'var(--color-text-secondary)',
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--color-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--color-text-secondary)';
            }}
          >
            Home
          </Link>
          <span>/</span>
          <Link
            href="/products"
            style={{
              color: 'var(--color-text-secondary)',
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--color-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--color-text-secondary)';
            }}
          >
            Products
          </Link>
          <span>/</span>
          <span style={{ color: 'var(--color-text-primary)' }}>{productName}</span>
        </div>
      </div>
    </nav>
  );
}

