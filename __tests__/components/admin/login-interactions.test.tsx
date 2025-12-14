import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdminLoginPage from '@/app/admin/login/page';

// Mock next-auth
const mockSignIn = jest.fn();
jest.mock('next-auth/react', () => ({
  signIn: (...args: any[]) => mockSignIn(...args),
}));

// Mock next/navigation
const mockPush = jest.fn();
const mockRefresh = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}));

describe('Admin Login Page Interactions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should allow typing in email field', async () => {
    const user = userEvent.setup();
    render(<AdminLoginPage />);

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, 'test@example.com');

    expect(emailInput).toHaveValue('test@example.com');
  });

  it('should allow typing in password field', async () => {
    const user = userEvent.setup();
    render(<AdminLoginPage />);

    const passwordInput = screen.getByLabelText(/password/i);
    await user.type(passwordInput, 'password123');

    expect(passwordInput).toHaveValue('password123');
  });

  it('should call signIn on form submission', async () => {
    mockSignIn.mockResolvedValue({ error: null });
    const user = userEvent.setup();
    render(<AdminLoginPage />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    // Wait for async operation
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(mockSignIn).toHaveBeenCalledWith('credentials', {
      email: 'test@example.com',
      password: 'password123',
      redirect: false,
    });
  });

  it('should show loading state when submitting', async () => {
    mockSignIn.mockImplementation(() => new Promise(() => {})); // Never resolves
    const user = userEvent.setup();
    render(<AdminLoginPage />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    // Button should show loading state
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(submitButton).toHaveTextContent(/logging in/i);
  });
});

