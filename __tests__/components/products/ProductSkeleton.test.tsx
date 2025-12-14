import { render } from '@testing-library/react';
import ProductSkeleton from '@/components/products/ProductSkeleton';

describe('ProductSkeleton', () => {
  it('should render skeleton structure', () => {
    const { container } = render(<ProductSkeleton />);
    const skeleton = container.querySelector('.product-skeleton');
    expect(skeleton).toBeInTheDocument();
  });

  it('should have image skeleton area', () => {
    const { container } = render(<ProductSkeleton />);
    const shimmer = container.querySelector('.skeleton-shimmer');
    expect(shimmer).toBeInTheDocument();
  });

  it('should have content skeleton areas', () => {
    const { container } = render(<ProductSkeleton />);
    const skeleton = container.querySelector('.product-skeleton');
    expect(skeleton).toBeInTheDocument();
  });
});

