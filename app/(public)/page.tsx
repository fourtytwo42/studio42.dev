import { prisma } from '@/lib/prisma';
import ProductGrid from '@/components/products/ProductGrid';
import { Product } from '@/types';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import StatsSection from '@/components/home/StatsSection';
import ValueProposition from '@/components/home/ValueProposition';
import CTASection from '@/components/home/CTASection';

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
              Our Products
            </h2>
            <p
              style={{
                fontSize: 'var(--font-size-lg)',
                color: 'var(--color-text-secondary)',
                maxWidth: '600px',
                margin: '0 auto',
              }}
            >
              Explore our collection of premium, self-hosted SaaS solutions designed for modern organizations.
            </p>
          </div>
          <ProductGrid products={products} />
        </div>
      </section>
      <CTASection />
    </main>
  );
}

