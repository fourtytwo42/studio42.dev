import { render, screen } from '@testing-library/react';
import Breadcrumb from '@/components/products/Breadcrumb';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('Breadcrumb Interactions', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it('should render breadcrumb with home link', () => {
    render(<Breadcrumb productName="Test Product" />);
    expect(screen.getByText(/home/i)).toBeInTheDocument();
  });

  it('should render product name', () => {
    render(<Breadcrumb productName="Test Product" />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  it('should have correct structure', () => {
    render(<Breadcrumb productName="Test Product" />);
    const homeLink = screen.getByText(/home/i).closest('a');
    expect(homeLink).toHaveAttribute('href', '/');
  });
});
