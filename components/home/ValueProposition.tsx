'use client';

const values = [
  {
    title: 'Control',
    description: 'Self-hosted solutions mean you own your data and infrastructure. No dependencies on external services.',
  },
  {
    title: 'Partnership',
    description: 'Work directly with our team to customize, extend, and integrate solutions with your existing systems.',
  },
  {
    title: 'Quality',
    description: 'Built with modern technologies and best practices. Enterprise-grade reliability and performance.',
  },
  {
    title: 'Support',
    description: 'Professional support plans available. Active development and dedicated vendor relationship.',
  },
];

export default function ValueProposition() {
  return (
    <section
      className="value-proposition"
      style={{
        padding: 'var(--spacing-5xl) var(--spacing-xl)',
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
            What We Stand For
          </h2>
          <p
            style={{
              fontSize: 'var(--font-size-lg)',
              color: 'var(--color-text-secondary)',
              maxWidth: '600px',
              margin: '0 auto',
            }}
          >
            Our products are built on principles of transparency, control, and quality.
          </p>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 'var(--spacing-xl)',
          }}
        >
          {values.map((value, index) => (
            <div
              key={index}
              style={{
                padding: 'var(--spacing-xl)',
                backgroundColor: 'var(--color-background-secondary)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)',
                transition: 'var(--transition-base)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateX(4px)';
                e.currentTarget.style.borderColor = 'var(--color-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.borderColor = 'var(--color-border)';
              }}
            >
              <h3
                style={{
                  fontSize: 'var(--font-size-xl)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-primary)',
                  marginBottom: 'var(--spacing-sm)',
                }}
              >
                {value.title}
              </h3>
              <p
                style={{
                  fontSize: 'var(--font-size-base)',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 'var(--line-height-relaxed)',
                }}
              >
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

