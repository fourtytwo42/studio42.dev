'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || 600;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Enhanced animated particles with variety
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      type: 'circle' | 'star' | 'diamond';
      rotation: number;
      rotationSpeed: number;
    }> = [];

    // Create more particles with variety
    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * (0.3 + Math.random() * 0.7),
        vy: (Math.random() - 0.5) * (0.3 + Math.random() * 0.7),
        size: Math.random() * 4 + 1,
        opacity: Math.random() * 0.6 + 0.2,
        type: Math.random() > 0.7 ? (Math.random() > 0.5 ? 'star' : 'diamond') : 'circle',
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
      });
    }

    const drawStar = (x: number, y: number, size: number, rotation: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
        const px = Math.cos(angle) * size;
        const py = Math.sin(angle) * size;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.restore();
    };

    const drawDiamond = (x: number, y: number, size: number, rotation: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.lineTo(size, 0);
      ctx.lineTo(0, size);
      ctx.lineTo(-size, 0);
      ctx.closePath();
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.rotation += particle.rotationSpeed;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
        ctx.strokeStyle = `rgba(255, 255, 255, ${particle.opacity * 0.5})`;
        ctx.lineWidth = 1;

        if (particle.type === 'star') {
          drawStar(particle.x, particle.y, particle.size, particle.rotation);
          ctx.fill();
          ctx.stroke();
        } else if (particle.type === 'diamond') {
          drawDiamond(particle.x, particle.y, particle.size, particle.rotation);
          ctx.fill();
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <section
      className="hero-section"
      style={{
        position: 'relative',
        padding: 'var(--spacing-5xl) var(--spacing-xl)',
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        textAlign: 'center',
        background: 'var(--hero-background)',
        color: 'var(--hero-text-color)',
        overflow: 'hidden',
      }}
    >
      {/* Animated canvas background */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0.3,
        }}
      />

      {/* Subtle sunrise orbs - like sun just coming up (light mode) / Dark mode orbs */}
      <div
        className="sunrise-orb-main"
        style={{
          position: 'absolute',
          bottom: '-15%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '800px',
          height: '800px',
          borderRadius: '50%',
          filter: 'blur(80px)',
          animation: 'sunrise 20s ease-in-out infinite',
        }}
      />
      <div
        className="sunrise-orb-secondary"
        style={{
          position: 'absolute',
          top: '20%',
          right: '10%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          filter: 'blur(60px)',
          animation: 'float 25s ease-in-out infinite reverse',
        }}
      />
      <div
        className="sunrise-orb-tertiary"
        style={{
          position: 'absolute',
          top: '10%',
          left: '15%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          filter: 'blur(50px)',
          animation: 'float 30s ease-in-out infinite',
        }}
      />

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -30px) scale(1.1); }
        }
        @keyframes sunrise {
          0%, 100% { transform: translateX(-50%) translateY(0) scale(1); opacity: 0.6; }
          50% { transform: translateX(-50%) translateY(-20px) scale(1.05); opacity: 0.8; }
        }
      `}</style>
      
      <div className="container" style={{ position: 'relative', zIndex: 1, width: '100%' }}>
        <div
          style={{
            maxWidth: '900px',
            margin: '0 auto',
          }}
        >
          <div
            style={{
              display: 'inline-block',
              padding: 'var(--spacing-sm) var(--spacing-lg)',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: 'var(--radius-full)',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-medium)',
              marginBottom: 'var(--spacing-lg)',
              backdropFilter: 'blur(10px)',
            }}
          >
            🚀 Premium Self-Hosted SaaS Solutions
          </div>
          
          <h1
            style={{
              fontSize: 'clamp(2.5rem, 8vw, 5rem)',
              fontWeight: 'var(--font-weight-extrabold)',
              marginBottom: 'var(--spacing-lg)',
              lineHeight: 'var(--line-height-tight)',
              color: 'var(--hero-text-color)',
            }}
          >
            Build. Deploy. Control.
          </h1>
          
          <p
            style={{
              fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
              marginBottom: 'var(--spacing-md)',
              opacity: 0.95,
              fontWeight: 'var(--font-weight-semibold)',
            }}
          >
            Enterprise-grade SaaS products that you host yourself
          </p>
          
          <p
            style={{
              fontSize: 'var(--font-size-lg)',
              marginBottom: 'var(--spacing-3xl)',
              opacity: 0.9,
              lineHeight: 'var(--line-height-relaxed)',
              maxWidth: '700px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            Transform your organization with powerful, self-hosted solutions. 
            Complete data control, premium support, and enterprise-ready features.
          </p>
          
          <div
            style={{
              display: 'flex',
              gap: 'var(--spacing-lg)',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: 'var(--spacing-3xl)',
            }}
          >
            <Link
              href="#products"
              className="hero-cta-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--spacing-sm)',
                padding: 'var(--spacing-md) var(--spacing-2xl)',
                textDecoration: 'none',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--font-size-lg)',
                fontWeight: 'var(--font-weight-semibold)',
                transition: 'var(--transition-base)',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 0, 0, 0.15)';
              }}
            >
              <span>Explore Products</span>
              <span>→</span>
            </Link>
            <Link
              href="/contact"
              className="hero-cta-secondary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--spacing-sm)',
                padding: 'var(--spacing-md) var(--spacing-2xl)',
                backgroundColor: 'transparent',
                textDecoration: 'none',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--font-size-lg)',
                fontWeight: 'var(--font-weight-semibold)',
                border: '2px solid',
                transition: 'var(--transition-base)',
                backdropFilter: 'blur(10px)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.8';
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
              }}
            >
              <span>Get Started</span>
              <span>→</span>
            </Link>
          </div>

          {/* Trust indicators */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 'var(--spacing-3xl)',
              flexWrap: 'wrap',
              opacity: 0.8,
              fontSize: 'var(--font-size-sm)',
            }}
          >
            <div>✓ Self-Hosted</div>
            <div>✓ Enterprise Ready</div>
            <div>✓ Premium Support</div>
          </div>
        </div>
      </div>
    </section>
  );
}

