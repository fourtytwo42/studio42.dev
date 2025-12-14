import { render, screen } from '@testing-library/react';
import ProductCTA from '@/components/products/ProductCTA';
import { Product } from '@/types';
import { ProductStatus } from '@prisma/client';

const mockProduct: Product = {
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
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('ProductCTA', () => {
  it('should render CTA section', () => {
    render(<ProductCTA product={mockProduct} />);
    expect(screen.getByText(/Interested in LMS/i)).toBeInTheDocument();
  });

  it('should render contact link with product slug', () => {
    render(<ProductCTA product={mockProduct} />);
    const contactLink = screen.getByText('Contact Us');
    expect(contactLink.closest('a')).toHaveAttribute('href', '/contact?source=lms');
  });

  it('should render call to action text', () => {
    render(<ProductCTA product={mockProduct} />);
    expect(screen.getByText(/Get in touch with us/i)).toBeInTheDocument();
  });
});

