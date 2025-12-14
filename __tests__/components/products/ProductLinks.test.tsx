import { render, screen } from '@testing-library/react';
import ProductLinks from '@/components/products/ProductLinks';
import { Product } from '@/types';
import { ProductStatus } from '@prisma/client';

const mockProductWithLinks: Product = {
  id: '1',
  slug: 'lms',
  name: 'LMS',
  tagline: null,
  description: 'Test',
  status: ProductStatus.AVAILABLE,
  thumbnail: null,
  githubUrl: 'https://github.com/test',
  youtubeUrl: 'https://youtube.com/test',
  demoUrl: 'https://demo.test',
  pricing: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockProductWithoutLinks: Product = {
  ...mockProductWithLinks,
  githubUrl: null,
  youtubeUrl: null,
  demoUrl: null,
};

describe('ProductLinks', () => {
  it('should render links section when links exist', () => {
    render(<ProductLinks product={mockProductWithLinks} />);
    expect(screen.getByText('Links')).toBeInTheDocument();
  });

  it('should render demo link', () => {
    render(<ProductLinks product={mockProductWithLinks} />);
    const demoLink = screen.getByText('View Demo');
    expect(demoLink).toBeInTheDocument();
    expect(demoLink.closest('a')).toHaveAttribute('href', 'https://demo.test');
  });

  it('should render GitHub link', () => {
    render(<ProductLinks product={mockProductWithLinks} />);
    const githubLink = screen.getByText('GitHub');
    expect(githubLink).toBeInTheDocument();
    expect(githubLink.closest('a')).toHaveAttribute('href', 'https://github.com/test');
  });

  it('should render YouTube link', () => {
    render(<ProductLinks product={mockProductWithLinks} />);
    const youtubeLink = screen.getByText('YouTube');
    expect(youtubeLink).toBeInTheDocument();
    expect(youtubeLink.closest('a')).toHaveAttribute('href', 'https://youtube.com/test');
  });

  it('should return null when no links', () => {
    const { container } = render(<ProductLinks product={mockProductWithoutLinks} />);
    expect(container.firstChild).toBeNull();
  });

  it('should open links in new tab', () => {
    render(<ProductLinks product={mockProductWithLinks} />);
    const links = screen.getAllByRole('link');
    links.forEach((link) => {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });
});

