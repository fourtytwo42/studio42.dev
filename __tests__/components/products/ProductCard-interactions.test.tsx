import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductCard from '@/components/products/ProductCard';
import { Product } from '@/types';
import { ProductStatus } from '@prisma/client';

const mockProduct: Product = {
  id: '1',
  slug: 'lms',
  name: 'AI Microlearning LMS',
  tagline: 'Intelligent learning management system',
  description: 'A comprehensive learning management system with AI-powered content recommendations.',
  status: ProductStatus.AVAILABLE,
  thumbnail: null, // No thumbnail to avoid Image component issues
  githubUrl: 'https://github.com/studio42/lms',
  youtubeUrl: 'https://youtube.com/@studio42',
  demoUrl: 'https://lms.studio42.dev',
  pricing: 'Starting at $99/month',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('ProductCard Interactions', () => {
  it('should apply hover styles on mouse enter', async () => {
    const user = userEvent.setup();
    const { container } = render(<ProductCard product={mockProduct} />);
    const card = container.querySelector('.product-card') as HTMLElement;

    expect(card).toBeInTheDocument();
    
    // Simulate hover
    await user.hover(card);
    
    // Check that styles are applied
    expect(card.style.transform).toBe('translateY(-4px)');
    expect(card.style.boxShadow).toBeTruthy();
  });

  it('should remove hover styles on mouse leave', async () => {
    const user = userEvent.setup();
    const { container } = render(<ProductCard product={mockProduct} />);
    const card = container.querySelector('.product-card') as HTMLElement;

    await user.hover(card);
    expect(card.style.transform).toBe('translateY(-4px)');
    
    await user.unhover(card);
    expect(card.style.transform).toBe('translateY(0)');
  });
});

