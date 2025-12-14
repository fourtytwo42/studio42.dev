import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactForm from '@/components/contact/ContactForm';

jest.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('ContactForm Validation', () => {
  it('should validate message length', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/message/i), 'Short');

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/message must be at least/i)).toBeInTheDocument();
    });
  });

  it('should validate inquiry type selection', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/message/i), 'This is a test message with enough characters.');

    // Inquiry type should have a default value
    const inquiryType = screen.getByLabelText(/inquiry type/i);
    expect(inquiryType).toHaveValue('GENERAL_INQUIRY');
  });

  it('should validate contact method selection', async () => {
    render(<ContactForm />);

    const contactMethod = screen.getByLabelText(/preferred contact method/i);
    expect(contactMethod).toHaveValue('EMAIL');
  });
});

