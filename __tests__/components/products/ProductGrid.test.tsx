import { render, screen } from '@testing-library/react';
import ProductGrid from '@/components/products/ProductGrid';
import { Product } from '@/types';
import { ProductStatus } from '@prisma/client';

const mockProducts: Product[] = [
  {
    id: '1',
    slug: 'lms',
    name: 'LMS',
    tagline: 'Learning System',
    description: 'Test description',
    status: ProductStatus.AVAILABLE,
    thumbnail: null,
    githubUrl: null,
    youtubeUrl: null,
    demoUrl: null,
    pricing: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

describe('ProductGrid', () => {
  it('should render products', () => {
    render(<ProductGrid products={mockProducts} />);
    expect(screen.getByText('LMS')).toBeInTheDocument();
  });

  it('should show loading skeletons when loading', () => {
    const { container } = render(<ProductGrid products={[]} isLoading={true} />);
    const skeletons = container.querySelectorAll('.product-skeleton');
    expect(skeletons.length).toBe(6);
  });

  it('should show empty state when no products', () => {
    render(<ProductGrid products={[]} />);
    expect(screen.getByText(/no products available/i)).toBeInTheDocument();
  });

  it('should render multiple products', () => {
    const multipleProducts = [
      ...mockProducts,
      {
        id: '2',
        slug: 'product-2',
        name: 'Product 2',
        tagline: null,
        description: 'Description 2',
        status: ProductStatus.COMING_SOON,
        thumbnail: null,
        githubUrl: null,
        youtubeUrl: null,
        demoUrl: null,
        pricing: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    render(<ProductGrid products={multipleProducts} />);
    expect(screen.getByText('LMS')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
  });

  it('should have grid layout', () => {
    const { container } = render(<ProductGrid products={mockProducts} />);
    const grid = container.querySelector('.product-grid');
    expect(grid).toBeInTheDocument();
  });
});

