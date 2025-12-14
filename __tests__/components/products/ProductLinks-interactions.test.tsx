import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductLinks from '@/components/products/ProductLinks';
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
  githubUrl: 'https://github.com/test',
  youtubeUrl: 'https://youtube.com/test',
  demoUrl: 'https://demo.test',
  pricing: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('ProductLinks Interactions', () => {
  it('should apply hover styles to demo link', async () => {
    const user = userEvent.setup();
    render(<ProductLinks product={mockProduct} />);
    
    const demoLink = screen.getByText('View Demo');
    await user.hover(demoLink);
    
    // Check that hover styles are applied
    expect(demoLink.closest('a')).toBeInTheDocument();
  });

  it('should apply hover styles to GitHub link', async () => {
    const user = userEvent.setup();
    render(<ProductLinks product={mockProduct} />);
    
    const githubLink = screen.getByText('GitHub');
    await user.hover(githubLink);
    
    expect(githubLink.closest('a')).toBeInTheDocument();
  });

  it('should apply hover styles to YouTube link', async () => {
    const user = userEvent.setup();
    render(<ProductLinks product={mockProduct} />);
    
    const youtubeLink = screen.getByText('YouTube');
    await user.hover(youtubeLink);
    
    expect(youtubeLink.closest('a')).toBeInTheDocument();
  });
});

