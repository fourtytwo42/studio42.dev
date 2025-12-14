import { render, screen } from '@testing-library/react';
import AdminLoginPage from '@/app/admin/login/page';

// Mock next-auth
jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}));

describe('Admin Login Page', () => {
  it('should render login form', () => {
    render(<AdminLoginPage />);
    expect(screen.getByText('Admin Login')).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('should have email input field', () => {
    render(<AdminLoginPage />);
    const emailInput = screen.getByLabelText(/email/i);
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute('type', 'email');
  });

  it('should have password input field', () => {
    render(<AdminLoginPage />);
    const passwordInput = screen.getByLabelText(/password/i);
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('should have submit button', () => {
    render(<AdminLoginPage />);
    const submitButton = screen.getByRole('button', { name: /login/i });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveAttribute('type', 'submit');
  });

  it('should have form structure', () => {
    render(<AdminLoginPage />);
    const form = screen.getByRole('button', { name: /login/i }).closest('form');
    expect(form).toBeInTheDocument();
  });
});

