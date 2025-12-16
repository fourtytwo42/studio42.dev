import { prisma } from '@/lib/prisma';
import ProductGrid from '@/components/products/ProductGrid';
import { Product } from '@/types';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import StatsSection from '@/components/home/StatsSection';
import ValueProposition from '@/components/home/ValueProposition';
import CTASection from '@/components/home/CTASection';

// Force dynamic rendering to always fetch fresh product data
export const dynamic = 'force-dynamic';

async function getProducts(): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        slug: true,
        name: true,
        tagline: true,
        description: true,
        status: true,
        thumbnail: true,
        githubUrl: true,
        youtubeUrl: true,
        demoUrl: true,
        pricing: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: [
        { status: 'asc' },
        { name: 'asc' },
      ],
    });

    // Truncate descriptions for grid display
    return products.map((product) => ({
      ...product,
      description:
        product.description.length > 150
          ? `${product.description.substring(0, 150)}...`
          : product.description,
    })) as Product[];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <main>
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <ValueProposition />
      <section
        id="products"
        className="products-section"
        style={{
          padding: 'var(--spacing-5xl) var(--spacing-xl)',
          backgroundColor: 'var(--color-background-secondary)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative background */}
        <div
          style={{
            position: 'absolute',
            top: '-50%',
            right: '-20%',
            width: '800px',
            height: '800px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(249, 115, 22, 0.08) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-50%',
            left: '-20%',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(220, 38, 38, 0.08) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-5xl)' }}>
            <div
              style={{
                display: 'inline-block',
                padding: 'var(--spacing-sm) var(--spacing-lg)',
                backgroundColor: 'var(--color-background)',
                borderRadius: 'var(--radius-full)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--color-primary)',
                marginBottom: 'var(--spacing-lg)',
                border: '1px solid var(--color-border)',
              }}
            >
              {products.length} Premium Products
            </div>
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
              Our Products
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
              Explore our collection of premium, self-hosted SaaS solutions designed for modern organizations. 
              Each product is built with enterprise-grade quality and complete customization options.
            </p>
          </div>
          <ProductGrid products={products} />
        </div>
      </section>
      <CTASection />
    </main>
  );
}

