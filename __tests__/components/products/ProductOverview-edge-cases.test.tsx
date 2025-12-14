import { render, screen } from '@testing-library/react';
import ProductOverview from '@/components/products/ProductOverview';
import { Product } from '@/types';
import { ProductStatus } from '@prisma/client';

describe('ProductOverview Edge Cases', () => {
  it('should handle single paragraph description', () => {
    const product: Product = {
      id: '1',
      slug: 'lms',
      name: 'LMS',
      tagline: null,
      description: 'Single paragraph description.',
      status: ProductStatus.AVAILABLE,
      thumbnail: null,
      githubUrl: null,
      youtubeUrl: null,
      demoUrl: null,
      pricing: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    render(<ProductOverview product={product} />);
    expect(screen.getByText('Single paragraph description.')).toBeInTheDocument();
  });

  it('should handle description with multiple newlines', () => {
    const product: Product = {
      id: '1',
      slug: 'lms',
      name: 'LMS',
      tagline: null,
      description: 'First paragraph.\n\nSecond paragraph.\n\nThird paragraph.',
      status: ProductStatus.AVAILABLE,
      thumbnail: null,
      githubUrl: null,
      youtubeUrl: null,
      demoUrl: null,
      pricing: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    render(<ProductOverview product={product} />);
    expect(screen.getByText('First paragraph.')).toBeInTheDocument();
    expect(screen.getByText('Second paragraph.')).toBeInTheDocument();
    expect(screen.getByText('Third paragraph.')).toBeInTheDocument();
  });
});

