import { render, screen } from '@testing-library/react';
import ContactConfirmation from '@/components/contact/ContactConfirmation';

describe('ContactConfirmation', () => {
  it('should render confirmation message', () => {
    render(<ContactConfirmation />);
    expect(screen.getByText(/thank you/i)).toBeInTheDocument();
  });

  it('should render success message', () => {
    render(<ContactConfirmation />);
    expect(screen.getByText(/we've received your message/i)).toBeInTheDocument();
  });

  it('should render back to home link', () => {
    render(<ContactConfirmation />);
    const homeLink = screen.getByText('Back to Home');
    expect(homeLink.closest('a')).toHaveAttribute('href', '/');
  });

  it('should render send another message link', () => {
    render(<ContactConfirmation />);
    const contactLink = screen.getByText('Send Another Message');
    expect(contactLink.closest('a')).toHaveAttribute('href', '/contact');
  });
});

