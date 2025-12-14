import { prisma } from '@/lib/prisma';
import ProductGrid from '@/components/products/ProductGrid';
import { Product } from '@/types';

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
      <section
        className="hero-section"
        style={{
          padding: 'var(--spacing-5xl) var(--spacing-xl)',
          textAlign: 'center',
          backgroundColor: 'var(--color-background-secondary)',
        }}
      >
        <div className="container">
          <h1
            style={{
              fontSize: 'var(--font-size-5xl)',
              fontWeight: 'var(--font-weight-extrabold)',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--spacing-lg)',
              lineHeight: 'var(--line-height-tight)',
            }}
          >
            Studio42.dev
          </h1>
          <p
            style={{
              fontSize: 'var(--font-size-xl)',
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--spacing-2xl)',
            }}
          >
            Premium SaaS Products
          </p>
        </div>
      </section>

      <section
        className="products-section"
        style={{
          padding: 'var(--spacing-5xl) var(--spacing-xl)',
        }}
      >
        <div className="container">
          <h2
            style={{
              fontSize: 'var(--font-size-3xl)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--spacing-xl)',
              textAlign: 'center',
            }}
          >
            Our Products
          </h2>
          <ProductGrid products={products} />
        </div>
      </section>
    </main>
  );
}

