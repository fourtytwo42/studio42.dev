import { render, screen } from '@testing-library/react';
import ProductLinks from '@/components/products/ProductLinks';
import { Product } from '@/types';
import { ProductStatus } from '@prisma/client';

describe('ProductLinks Partial Links', () => {
  it('should render only demo link when others are missing', () => {
    const product: Product = {
      id: '1',
      slug: 'lms',
      name: 'LMS',
      tagline: null,
      description: 'Test',
      status: ProductStatus.AVAILABLE,
      thumbnail: null,
      githubUrl: null,
      youtubeUrl: null,
      demoUrl: 'https://demo.test',
      pricing: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    render(<ProductLinks product={product} />);
    expect(screen.getByText('View Demo')).toBeInTheDocument();
    expect(screen.queryByText('GitHub')).not.toBeInTheDocument();
    expect(screen.queryByText('YouTube')).not.toBeInTheDocument();
  });

  it('should render only GitHub link when others are missing', () => {
    const product: Product = {
      id: '1',
      slug: 'lms',
      name: 'LMS',
      tagline: null,
      description: 'Test',
      status: ProductStatus.AVAILABLE,
      thumbnail: null,
      githubUrl: 'https://github.com/test',
      youtubeUrl: null,
      demoUrl: null,
      pricing: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    render(<ProductLinks product={product} />);
    expect(screen.getByText('GitHub')).toBeInTheDocument();
    expect(screen.queryByText('View Demo')).not.toBeInTheDocument();
  });

  it('should render only YouTube link when others are missing', () => {
    const product: Product = {
      id: '1',
      slug: 'lms',
      name: 'LMS',
      tagline: null,
      description: 'Test',
      status: ProductStatus.AVAILABLE,
      thumbnail: null,
      githubUrl: null,
      youtubeUrl: 'https://youtube.com/test',
      demoUrl: null,
      pricing: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    render(<ProductLinks product={product} />);
    expect(screen.getByText('YouTube')).toBeInTheDocument();
    expect(screen.queryByText('View Demo')).not.toBeInTheDocument();
  });
});

