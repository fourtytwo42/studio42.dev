import { render, screen } from '@testing-library/react';
import ProductFeatures from '@/components/products/ProductFeatures';
import { Product } from '@/types';
import { ProductStatus } from '@prisma/client';

const mockProductWithFeatures: Product = {
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
  pricing: null,
  features: [
    { title: 'Feature 1', description: 'Description 1' },
    { title: 'Feature 2', description: 'Description 2' },
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockProductWithoutFeatures: Product = {
  ...mockProductWithFeatures,
  features: null,
};

describe('ProductFeatures', () => {
  it('should render features section when features exist', () => {
    render(<ProductFeatures product={mockProductWithFeatures} />);
    expect(screen.getByText('Features')).toBeInTheDocument();
    expect(screen.getByText('Feature 1')).toBeInTheDocument();
    expect(screen.getByText('Description 1')).toBeInTheDocument();
  });

  it('should render all features', () => {
    render(<ProductFeatures product={mockProductWithFeatures} />);
    expect(screen.getByText('Feature 1')).toBeInTheDocument();
    expect(screen.getByText('Feature 2')).toBeInTheDocument();
  });

  it('should return null when no features', () => {
    const { container } = render(<ProductFeatures product={mockProductWithoutFeatures} />);
    expect(container.firstChild).toBeNull();
  });

  it('should return null when features array is empty', () => {
    const productWithEmptyFeatures = { ...mockProductWithFeatures, features: [] };
    const { container } = render(<ProductFeatures product={productWithEmptyFeatures} />);
    expect(container.firstChild).toBeNull();
  });
});

