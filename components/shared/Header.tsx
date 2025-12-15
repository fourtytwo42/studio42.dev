'use client';

import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 'var(--z-sticky)',
        backgroundColor: 'var(--color-background)',
        borderBottom: '1px solid var(--color-border)',
        padding: 'var(--spacing-md) var(--spacing-xl)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link
          href="/"
          style={{
            fontSize: 'var(--font-size-xl)',
            fontWeight: 'var(--font-weight-bold)',
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textDecoration: 'none',
          }}
        >
          Studio42.dev
        </Link>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-lg)' }}>
          <Link
            href="/"
            style={{
              color: 'var(--color-text-secondary)',
              textDecoration: 'none',
              fontSize: 'var(--font-size-base)',
              transition: 'var(--transition-base)',
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
          <Link
            href="/contact"
            style={{
              color: 'var(--color-text-secondary)',
              textDecoration: 'none',
              fontSize: 'var(--font-size-base)',
              transition: 'var(--transition-base)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--color-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--color-text-secondary)';
            }}
          >
            Contact
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

