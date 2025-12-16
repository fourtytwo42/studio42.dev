'use client';

import { useEffect, useRef, useState } from 'react';

const values = [
  {
    title: 'Control',
    icon: '🎛️',
    description: 'Self-hosted solutions mean you own your data and infrastructure. No dependencies on external services.',
    gradient: 'linear-gradient(135deg, #c2410c 0%, #ea580c 100%)',
  },
  {
    title: 'Partnership',
    icon: '🤝',
    description: 'Work directly with our team to customize, extend, and integrate solutions with your existing systems.',
    gradient: 'linear-gradient(135deg, #ea580c 0%, #d97706 100%)',
  },
  {
    title: 'Quality',
    icon: '✨',
    description: 'Built with modern technologies and best practices. Enterprise-grade reliability and performance.',
    gradient: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
  },
  {
    title: 'Support',
    icon: '💬',
    description: 'Professional support plans available. Active development and dedicated vendor relationship.',
    gradient: 'linear-gradient(135deg, #c2410c 0%, #d97706 50%, #e11d48 100%)',
  },
];

export default function ValueProposition() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="value-proposition"
      style={{
        padding: 'var(--spacing-5xl) var(--spacing-xl)',
        background: 'var(--color-background)',
        position: 'relative',
      }}
    >
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-5xl)' }}>
          <h2
            style={{
              fontSize: 'var(--font-size-4xl)',
              fontWeight: 'var(--font-weight-extrabold)',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--spacing-md)',
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            What We Stand For
          </h2>
          <p
            style={{
              fontSize: 'var(--font-size-lg)',
              color: 'var(--color-text-secondary)',
              maxWidth: '700px',
              margin: '0 auto',
              lineHeight: 'var(--line-height-relaxed)',
            }}
          >
            Our products are built on principles of transparency, control, and quality. 
            Every solution is designed with your organization's success in mind.
          </p>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'var(--spacing-xl)',
          }}
        >
          {values.map((value, index) => (
            <div
              key={index}
              style={{
                padding: 'var(--spacing-2xl)',
                backgroundColor: 'var(--color-background-secondary)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--color-border)',
                transition: 'var(--transition-base)',
                position: 'relative',
                overflow: 'hidden',
                transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                opacity: isVisible ? 1 : 0,
                transitionDelay: `${index * 100}ms`,
                transitionDuration: '600ms',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)';
                e.currentTarget.style.borderColor = 'var(--color-primary)';
                const icon = e.currentTarget.querySelector('[data-value-icon]') as HTMLElement;
                if (icon) {
                  icon.style.transform = 'scale(1.3) rotate(10deg)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'var(--color-border)';
                const icon = e.currentTarget.querySelector('[data-value-icon]') as HTMLElement;
                if (icon) {
                  icon.style.transform = 'scale(1) rotate(0deg)';
                }
              }}
            >
              {/* Gradient background on hover */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: value.gradient,
                  opacity: 0,
                  transition: 'var(--transition-base)',
                  pointerEvents: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.05';
                }}
              />
              
              <div
                data-value-icon
                style={{
                  fontSize: '48px',
                  marginBottom: 'var(--spacing-md)',
                  transition: 'var(--transition-base)',
                  display: 'inline-block',
                }}
              >
                {value.icon}
              </div>
              
              <h3
                style={{
                  fontSize: 'var(--font-size-xl)',
                  fontWeight: 'var(--font-weight-bold)',
                  background: value.gradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: 'var(--spacing-sm)',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                {value.title}
              </h3>
              <p
                style={{
                  fontSize: 'var(--font-size-base)',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 'var(--line-height-relaxed)',
                  position: 'relative',
                  zIndex: 1,
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

