import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
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
        {
          status: 'asc', // AVAILABLE first
        },
        {
          name: 'asc',
        },
      ],
    });

    // Truncate descriptions for grid display
    const productsWithTruncatedDescriptions = products.map((product) => ({
      ...product,
      description:
        product.description.length > 150
          ? `${product.description.substring(0, 150)}...`
          : product.description,
    }));

    return NextResponse.json(
      { products: productsWithTruncatedDescriptions },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

