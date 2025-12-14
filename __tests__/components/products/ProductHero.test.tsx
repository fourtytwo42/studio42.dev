import { render, screen } from '@testing-library/react';
import ProductHero from '@/components/products/ProductHero';
import { Product } from '@/types';
import { ProductStatus } from '@prisma/client';

const mockProduct: Product & {
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
  thumbnail: '/images/lms-thumbnail.jpg',
  githubUrl: null,
  youtubeUrl: null,
  demoUrl: null,
  pricing: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('ProductHero', () => {
  it('should render product name', () => {
    render(<ProductHero product={mockProduct} />);
    expect(screen.getByText('AI Microlearning LMS')).toBeInTheDocument();
  });

  it('should render product tagline', () => {
    render(<ProductHero product={mockProduct} />);
    expect(screen.getByText('Intelligent learning management system')).toBeInTheDocument();
  });

  it('should render status badge', () => {
    render(<ProductHero product={mockProduct} />);
    expect(screen.getByText('Available')).toBeInTheDocument();
  });

  it('should handle product without tagline', () => {
    const productWithoutTagline = { ...mockProduct, tagline: null };
    render(<ProductHero product={productWithoutTagline} />);
    expect(screen.getByText('AI Microlearning LMS')).toBeInTheDocument();
  });
});

