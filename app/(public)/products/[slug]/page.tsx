import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Product } from '@/types';
import ProductHero from '@/components/products/ProductHero';
import ProductOverview from '@/components/products/ProductOverview';
import ProductFeatures from '@/components/products/ProductFeatures';
import ProductMedia from '@/components/products/ProductMedia';
import ProductLinks from '@/components/products/ProductLinks';
import ProductPricing from '@/components/products/ProductPricing';
import ProductCTA from '@/components/products/ProductCTA';
import Breadcrumb from '@/components/products/Breadcrumb';
import type { Metadata } from 'next';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string): Promise<(Product & {
  media?: Array<{
    id: string;
    type: string;
    url: string;
    thumbnail?: string | null;
    title?: string | null;
  }>;
}) | null> {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        media: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!product) {
      return null;
    }

    // Parse features if it's a JSON string
    let features = null;
    if (product.features) {
      try {
        features = typeof product.features === 'string'
          ? JSON.parse(product.features)
          : product.features;
      } catch {
        features = null;
      }
    }

    return {
      ...product,
      features,
    } as Product & {
      media?: Array<{
        id: string;
        type: string;
        url: string;
        thumbnail?: string | null;
        title?: string | null;
      }>;
      features?: Array<{ title: string; description: string }> | null;
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: `${product.name} - Studio42.dev`,
    description: product.tagline || product.description.substring(0, 160),
    openGraph: {
      title: product.name,
      description: product.tagline || product.description.substring(0, 160),
      images: product.thumbnail ? [product.thumbnail] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  return (
    <>
      <Breadcrumb productName={product.name} />
      <ProductHero product={product} />
      <ProductOverview product={product} />
      {product.features && product.features.length > 0 && (
        <ProductFeatures product={product} />
      )}
      {product.media && product.media.length > 0 && (
        <ProductMedia media={product.media} />
      )}
      <ProductLinks product={product} />
      {product.pricing && <ProductPricing product={product} />}
      <ProductCTA product={product} />
    </>
  );
}

