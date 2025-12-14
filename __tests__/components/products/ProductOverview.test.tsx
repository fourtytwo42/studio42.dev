import { render, screen } from '@testing-library/react';
import ProductOverview from '@/components/products/ProductOverview';
import { Product } from '@/types';
import { ProductStatus } from '@prisma/client';

const mockProduct: Product = {
  id: '1',
  slug: 'lms',
  name: 'LMS',
  tagline: null,
  description: 'This is a comprehensive learning management system.\nIt has many features.',
  status: ProductStatus.AVAILABLE,
  thumbnail: null,
  githubUrl: null,
  youtubeUrl: null,
  demoUrl: null,
  pricing: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('ProductOverview', () => {
  it('should render overview section', () => {
    render(<ProductOverview product={mockProduct} />);
    expect(screen.getByText('Overview')).toBeInTheDocument();
  });

  it('should render product description', () => {
    render(<ProductOverview product={mockProduct} />);
    expect(screen.getByText(/comprehensive learning management/i)).toBeInTheDocument();
  });

  it('should split description by newlines', () => {
    render(<ProductOverview product={mockProduct} />);
    expect(screen.getByText(/This is a comprehensive/i)).toBeInTheDocument();
    expect(screen.getByText(/It has many features/i)).toBeInTheDocument();
  });
});

