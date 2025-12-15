'use client';

const stats = [
  { value: '100%', label: 'Self-Hosted' },
  { value: 'Premium', label: 'Quality & Support' },
  { value: 'Enterprise', label: 'Ready' },
  { value: '24/7', label: 'Support Available' },
];

export default function StatsSection() {
  return (
    <section
      className="stats-section"
      style={{
        padding: 'var(--spacing-5xl) var(--spacing-xl)',
        background: 'linear-gradient(135deg, var(--color-background-secondary) 0%, var(--color-background-tertiary) 100%)',
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
                  color: 'var(--color-primary)',
                  marginBottom: 'var(--spacing-sm)',
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: 'var(--font-size-base)',
                  color: 'var(--color-text-secondary)',
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

