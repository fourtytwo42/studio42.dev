import { render, screen } from '@testing-library/react';
import ProductPricing from '@/components/products/ProductPricing';
import { Product } from '@/types';
import { ProductStatus } from '@prisma/client';

const mockProductWithPricing: Product = {
  id: '1',
  slug: 'lms',
  name: 'LMS',
  tagline: null,
  description: 'Test',
  status: ProductStatus.AVAILABLE,
  thumbnail: null,
  githubUrl: null,
  youtubeUrl: null,
  demoUrl: null,
  pricing: 'Starting at $99/month',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockProductWithoutPricing: Product = {
  ...mockProductWithPricing,
  pricing: null,
};

describe('ProductPricing', () => {
  it('should render pricing section when pricing exists', () => {
    render(<ProductPricing product={mockProductWithPricing} />);
    expect(screen.getByText('Pricing')).toBeInTheDocument();
    expect(screen.getByText('Starting at $99/month')).toBeInTheDocument();
  });

  it('should return null when no pricing', () => {
    const { container } = render(<ProductPricing product={mockProductWithoutPricing} />);
    expect(container.firstChild).toBeNull();
  });
});

