'use client';

import { Product } from '@/types';

interface ProductTechStackProps {
  product: Product;
}

const techStack = [
  { name: 'Next.js 16', category: 'Framework', description: 'Server-side rendering and API routes' },
  { name: 'React 19', category: 'UI Library', description: 'Modern React with Server Components' },
  { name: 'PostgreSQL 15+', category: 'Database', description: 'Robust relational database with pgvector' },
  { name: 'Prisma', category: 'ORM', description: 'Type-safe database access' },
  { name: 'TypeScript', category: 'Language', description: 'Type-safe development' },
  { name: 'Tailwind CSS 4', category: 'Styling', description: 'Utility-first CSS framework' },
];

export default function ProductTechStack({ product }: ProductTechStackProps) {
  return (
    <section
      className="product-tech-stack"
      style={{
        padding: 'var(--spacing-5xl) var(--spacing-xl)',
        backgroundColor: 'var(--color-background-secondary)',
      }}
    >
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-5xl)' }}>
          <h2
            style={{
              fontSize: 'var(--font-size-3xl)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--spacing-md)',
            }}
          >
            Built With Modern Technology
          </h2>
          <p
            style={{
              fontSize: 'var(--font-size-lg)',
              color: 'var(--color-text-secondary)',
              maxWidth: '600px',
              margin: '0 auto',
            }}
          >
            Powered by industry-leading technologies for performance, scalability, and developer experience.
          </p>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 'var(--spacing-lg)',
          }}
        >
          {techStack.map((tech, index) => (
            <div
              key={index}
              style={{
                padding: 'var(--spacing-lg)',
                backgroundColor: 'var(--color-background)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)',
                transition: 'var(--transition-base)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-primary)';
                e.currentTarget.style.boxShadow = 'var(--shadow-card)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div
                style={{
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--color-primary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: 'var(--spacing-xs)',
                }}
              >
                {tech.category}
              </div>
              <h3
                style={{
                  fontSize: 'var(--font-size-lg)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-text-primary)',
                  marginBottom: 'var(--spacing-xs)',
                }}
              >
                {tech.name}
              </h3>
              <p
                style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 'var(--line-height-relaxed)',
                }}
              >
                {tech.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

