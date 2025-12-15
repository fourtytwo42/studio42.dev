'use client';

const features = [
  {
    icon: '🚀',
    title: 'Self-Hosted',
    description: 'Complete control over your data and infrastructure. Deploy on-premise or in your cloud.',
  },
  {
    icon: '🤝',
    title: 'Professional Support',
    description: 'Dedicated vendor support with expert guidance, training, and ongoing assistance.',
  },
  {
    icon: '🎨',
    title: 'Fully Customizable',
    description: 'White-label solutions that we can customize and brand to match your organization\'s needs.',
  },
  {
    icon: '⚡',
    title: 'Modern Stack',
    description: 'Built with Next.js 16, React 19, and PostgreSQL. Fast, scalable, and future-proof.',
  },
  {
    icon: '🔒',
    title: 'Enterprise Ready',
    description: 'Role-based access, security best practices, and features for large organizations.',
  },
  {
    icon: '💡',
    title: 'Active Development',
    description: 'Regular updates, new features, and continuous improvements from our development team.',
  },
];

export default function FeaturesSection() {
  return (
    <section
      className="features-section"
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
            Why Choose Studio42.dev?
          </h2>
          <p
            style={{
              fontSize: 'var(--font-size-lg)',
              color: 'var(--color-text-secondary)',
              maxWidth: '600px',
              margin: '0 auto',
            }}
          >
            We build premium SaaS products that give you control, flexibility, and peace of mind.
          </p>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 'var(--spacing-xl)',
          }}
        >
          {features.map((feature, index) => (
            <div
              key={index}
              style={{
                padding: 'var(--spacing-xl)',
                backgroundColor: 'var(--color-background)',
                borderRadius: 'var(--radius-lg)',
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
                {feature.icon}
              </div>
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

