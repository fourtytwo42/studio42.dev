import { render, screen } from '@testing-library/react';
import ProductCard from '@/components/products/ProductCard';
import { Product } from '@/types';
import { ProductStatus } from '@prisma/client';

const mockProduct: Product = {
  id: '1',
  slug: 'lms',
  name: 'AI Microlearning LMS',
  tagline: 'Intelligent learning management system',
  description: 'A comprehensive learning management system with AI-powered content recommendations.',
  status: ProductStatus.AVAILABLE,
  thumbnail: '/images/lms-thumbnail.jpg',
  githubUrl: 'https://github.com/studio42/lms',
  youtubeUrl: 'https://youtube.com/@studio42',
  demoUrl: 'https://lms.studio42.dev',
  pricing: 'Starting at $99/month',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('ProductCard', () => {
  it('should render product name', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('AI Microlearning LMS')).toBeInTheDocument();
  });

  it('should render product tagline', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Intelligent learning management system')).toBeInTheDocument();
  });

  it('should render product description', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText(/comprehensive learning management/i)).toBeInTheDocument();
  });

  it('should render status badge', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Available')).toBeInTheDocument();
  });

  it('should render pricing when available', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Starting at $99/month')).toBeInTheDocument();
  });

  it('should link to product page', () => {
    render(<ProductCard product={mockProduct} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/products/lms');
  });

  it('should handle product without tagline', () => {
    const productWithoutTagline = { ...mockProduct, tagline: null };
    render(<ProductCard product={productWithoutTagline} />);
    expect(screen.getByText('AI Microlearning LMS')).toBeInTheDocument();
  });

  it('should handle product without pricing', () => {
    const productWithoutPricing = { ...mockProduct, pricing: null };
    render(<ProductCard product={productWithoutPricing} />);
    expect(screen.getByText('AI Microlearning LMS')).toBeInTheDocument();
  });

  it('should handle product without thumbnail', () => {
    const productWithoutThumbnail = { ...mockProduct, thumbnail: null };
    render(<ProductCard product={productWithoutThumbnail} />);
    expect(screen.getByText('AI Microlearning LMS')).toBeInTheDocument();
  });
});

