import { render, screen } from '@testing-library/react';
import Breadcrumb from '@/components/products/Breadcrumb';

describe('Breadcrumb', () => {
  it('should render breadcrumb navigation', () => {
    render(<Breadcrumb productName="Test Product" />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  it('should link to home', () => {
    render(<Breadcrumb productName="Test Product" />);
    const homeLink = screen.getByText('Home');
    expect(homeLink.closest('a')).toHaveAttribute('href', '/');
  });

  it('should link to products', () => {
    render(<Breadcrumb productName="Test Product" />);
    const productsLink = screen.getByText('Products');
    expect(productsLink.closest('a')).toHaveAttribute('href', '/products');
  });

  it('should display product name as text (not link)', () => {
    render(<Breadcrumb productName="Test Product" />);
    const productName = screen.getByText('Test Product');
    expect(productName.closest('a')).toBeNull();
  });
});

