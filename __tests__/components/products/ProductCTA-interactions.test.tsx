import { render, screen } from '@testing-library/react';
import ProductCTA from '@/components/products/ProductCTA';
import { Product } from '@/types';

const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  slug: 'test-product',
  tagline: 'Test tagline',
  description: 'Test description',
  status: 'AVAILABLE',
  thumbnail: '/test.jpg',
  pricing: null,
  githubUrl: null,
  youtubeUrl: null,
  demoUrl: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('ProductCTA Interactions', () => {
  it('should render CTA section', () => {
    render(<ProductCTA product={mockProduct} />);
    expect(screen.getByText(/interested/i)).toBeInTheDocument();
  });

  it('should have contact link', () => {
    render(<ProductCTA product={mockProduct} />);
    const link = screen.getByText(/contact us/i).closest('a');
    expect(link).toHaveAttribute('href', '/contact?source=test-product');
  });

  it('should include product name in message', () => {
    render(<ProductCTA product={mockProduct} />);
    expect(screen.getByText(/test product/i)).toBeInTheDocument();
  });
});
