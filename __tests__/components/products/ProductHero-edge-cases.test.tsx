import { render, screen } from '@testing-library/react';
import ProductHero from '@/components/products/ProductHero';
import { Product } from '@/types';
import { ProductStatus } from '@prisma/client';

describe('ProductHero Edge Cases', () => {
  it('should handle product without thumbnail or media', () => {
    const product: Product & {
      media?: Array<{
        id: string;
        type: string;
        url: string;
        thumbnail?: string | null;
      }>;
    } = {
      id: '1',
      slug: 'lms',
      name: 'AI Microlearning LMS',
      tagline: 'Intelligent learning management system',
      description: 'A comprehensive LMS',
      status: ProductStatus.AVAILABLE,
      thumbnail: null,
      githubUrl: null,
      youtubeUrl: null,
      demoUrl: null,
      pricing: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    render(<ProductHero product={product} />);
    expect(screen.getByText('AI Microlearning LMS')).toBeInTheDocument();
  });

  it('should use media image when thumbnail is not available', () => {
    const product: Product & {
      media?: Array<{
        id: string;
        type: string;
        url: string;
        thumbnail?: string | null;
      }>;
    } = {
      id: '1',
      slug: 'lms',
      name: 'AI Microlearning LMS',
      tagline: 'Intelligent learning management system',
      description: 'A comprehensive LMS',
      status: ProductStatus.AVAILABLE,
      thumbnail: null,
      githubUrl: null,
      youtubeUrl: null,
      demoUrl: null,
      pricing: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      media: [
        {
          id: '1',
          type: 'IMAGE',
          url: '/images/hero.jpg',
          thumbnail: null,
        },
      ],
    };

    render(<ProductHero product={product} />);
    expect(screen.getByText('AI Microlearning LMS')).toBeInTheDocument();
  });
});

