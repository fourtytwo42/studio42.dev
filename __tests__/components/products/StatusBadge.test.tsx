import { render, screen } from '@testing-library/react';
import StatusBadge from '@/components/products/StatusBadge';
import { ProductStatus } from '@prisma/client';

describe('StatusBadge', () => {
  it('should render Available status', () => {
    render(<StatusBadge status={ProductStatus.AVAILABLE} />);
    expect(screen.getByText('Available')).toBeInTheDocument();
  });

  it('should render Coming Soon status', () => {
    render(<StatusBadge status={ProductStatus.COMING_SOON} />);
    expect(screen.getByText('Coming Soon')).toBeInTheDocument();
  });

  it('should render In Development status', () => {
    render(<StatusBadge status={ProductStatus.IN_DEVELOPMENT} />);
    expect(screen.getByText('In Development')).toBeInTheDocument();
  });

  it('should have correct className for Available', () => {
    const { container } = render(<StatusBadge status={ProductStatus.AVAILABLE} />);
    const badge = container.querySelector('.status-badge-available');
    expect(badge).toBeInTheDocument();
  });

  it('should have correct className for Coming Soon', () => {
    const { container } = render(<StatusBadge status={ProductStatus.COMING_SOON} />);
    const badge = container.querySelector('.status-badge-coming-soon');
    expect(badge).toBeInTheDocument();
  });

  it('should have correct className for In Development', () => {
    const { container } = render(<StatusBadge status={ProductStatus.IN_DEVELOPMENT} />);
    const badge = container.querySelector('.status-badge-in-development');
    expect(badge).toBeInTheDocument();
  });
});

