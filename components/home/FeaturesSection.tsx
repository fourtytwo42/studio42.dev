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
                padding: 'var(--spacing-2xl)',
                backgroundColor: 'var(--color-background)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--color-border)',
                transition: 'var(--transition-base)',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)';
                e.currentTarget.style.borderColor = 'var(--color-primary)';
                const icon = e.currentTarget.querySelector('[data-icon]') as HTMLElement;
                const accent = e.currentTarget.querySelector('.gradient-accent') as HTMLElement;
                if (icon) {
                  icon.style.transform = 'scale(1.2) rotate(5deg)';
                }
                if (accent) {
                  accent.style.opacity = '1';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = 'var(--shadow-card)';
                e.currentTarget.style.borderColor = 'var(--color-border)';
                const icon = e.currentTarget.querySelector('[data-icon]') as HTMLElement;
                const accent = e.currentTarget.querySelector('.gradient-accent') as HTMLElement;
                if (icon) {
                  icon.style.transform = 'scale(1) rotate(0deg)';
                }
                if (accent) {
                  accent.style.opacity = '0';
                }
              }}
            >
              {/* Gradient accent */}
              <div
                className="gradient-accent"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'var(--gradient-primary)',
                  opacity: 0,
                  transition: 'var(--transition-base)',
                }}
              />
              <div
                data-icon
                style={{
                  fontSize: '56px',
                  marginBottom: 'var(--spacing-md)',
                  transition: 'var(--transition-base)',
                  display: 'inline-block',
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

