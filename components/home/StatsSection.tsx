'use client';

import { useEffect, useRef, useState } from 'react';

const stats = [
  { value: '100%', label: 'Self-Hosted', icon: '🔒' },
  { value: 'Premium', label: 'Quality & Support', icon: '⭐' },
  { value: 'Enterprise', label: 'Ready', icon: '🏢' },
  { value: '24/7', label: 'Support Available', icon: '💬' },
];

export default function StatsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="stats-section"
      style={{
        padding: 'var(--spacing-5xl) var(--spacing-xl)',
        background: 'var(--color-background)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative background elements */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 50% 0%, rgba(249, 115, 22, 0.05) 0%, transparent 50%)',
          pointerEvents: 'none',
        }}
      />
      
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 'var(--spacing-2xl)',
            textAlign: 'center',
          }}
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              style={{
                padding: 'var(--spacing-xl)',
                backgroundColor: 'var(--color-background-secondary)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--color-border)',
                transition: 'var(--transition-base)',
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                opacity: isVisible ? 1 : 0,
                transitionDelay: `${index * 100}ms`,
                transitionDuration: '600ms',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)';
                e.currentTarget.style.borderColor = 'var(--color-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'var(--color-border)';
              }}
            >
              <div
                style={{
                  fontSize: '48px',
                  marginBottom: 'var(--spacing-md)',
                }}
              >
                {stat.icon}
              </div>
              <div
                style={{
                  fontSize: 'var(--font-size-4xl)',
                  fontWeight: 'var(--font-weight-extrabold)',
                  background: 'var(--gradient-primary)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
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

