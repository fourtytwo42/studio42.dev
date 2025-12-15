'use client';

import { Product } from '@/types';

interface ProductUseCasesProps {
  product: Product;
}

const getUseCases = (productSlug: string) => {
  if (productSlug === 'ai-microlearning-lms') {
    return [
      {
        title: 'Corporate Training',
        description: 'Transform training materials into adaptive microlearning with zero authoring. Perfect for onboarding, compliance, and skill development.',
        icon: '🏢',
      },
      {
        title: 'Educational Institutions',
        description: 'Automatically convert textbooks and course materials into interactive, multimedia learning nuggets with AI tutoring.',
        icon: '🎓',
      },
      {
        title: 'Professional Development',
        description: 'Create personalized learning paths that adapt to knowledge gaps, delivering targeted training for every role.',
        icon: '📈',
      },
      {
        title: 'Customer Education',
        description: 'Turn product documentation into engaging microlearning experiences that help customers master your products faster.',
        icon: '👥',
      },
    ];
  }
  
  // Default use cases
  return [
    {
      title: 'Corporate Training',
      description: 'Deliver comprehensive employee onboarding, compliance training, and skill development programs at scale.',
      icon: '🏢',
    },
    {
      title: 'Educational Institutions',
      description: 'Manage courses, track student progress, and deliver engaging educational content for schools and universities.',
      icon: '🎓',
    },
    {
      title: 'Professional Development',
      description: 'Enable continuous learning with certification programs, workshops, and professional skill enhancement.',
      icon: '📈',
    },
    {
      title: 'Customer Education',
      description: 'Train customers on your products and services, reducing support burden and increasing satisfaction.',
      icon: '👥',
    },
  ];
};

export default function ProductUseCases({ product }: ProductUseCasesProps) {
  const useCases = getUseCases(product.slug);
  return (
    <section
      className="product-use-cases"
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
            Perfect For
          </h2>
          <p
            style={{
              fontSize: 'var(--font-size-lg)',
              color: 'var(--color-text-secondary)',
              maxWidth: '600px',
              margin: '0 auto',
            }}
          >
            Whether you're training employees, educating students, or building skills, our platform scales with your needs.
          </p>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'var(--spacing-xl)',
          }}
        >
          {useCases.map((useCase, index) => (
            <div
              key={index}
              style={{
                padding: 'var(--spacing-xl)',
                backgroundColor: 'var(--color-background)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-card)',
                border: '1px solid var(--color-border)',
                transition: 'var(--transition-base)',
                textAlign: 'center',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)';
                e.currentTarget.style.borderColor = 'var(--color-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-card)';
                e.currentTarget.style.borderColor = 'var(--color-border)';
              }}
            >
              <div
                style={{
                  fontSize: '48px',
                  marginBottom: 'var(--spacing-md)',
                }}
              >
                {useCase.icon}
              </div>
              <h3
                style={{
                  fontSize: 'var(--font-size-xl)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-text-primary)',
                  marginBottom: 'var(--spacing-sm)',
                }}
              >
                {useCase.title}
              </h3>
              <p
                style={{
                  fontSize: 'var(--font-size-base)',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 'var(--line-height-relaxed)',
                }}
              >
                {useCase.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

