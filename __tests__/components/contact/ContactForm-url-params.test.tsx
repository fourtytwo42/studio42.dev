import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactForm from '@/components/contact/ContactForm';

// Mock next/navigation with URL params
const mockPush = jest.fn();
const mockSearchParams = new URLSearchParams('?source=lms');

jest.mock('next/navigation', () => ({
  useSearchParams: () => mockSearchParams,
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock fetch
global.fetch = jest.fn();

describe('ContactForm URL Parameters', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });
  });

  it('should pre-populate product field from URL parameter', async () => {
    render(<ContactForm />);
    
    await waitFor(() => {
      const productInput = screen.getByLabelText(/product/i);
      expect(productInput).toHaveValue('lms');
    });
  });

  it('should handle form submission with pre-populated product', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/message/i), 'This is a test message with enough characters.');

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });
});

