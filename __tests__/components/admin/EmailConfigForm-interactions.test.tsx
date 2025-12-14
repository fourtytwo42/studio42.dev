import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EmailConfigForm from '@/components/admin/EmailConfigForm';

// Mock fetch
global.fetch = jest.fn();

describe('EmailConfigForm Interactions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        config: {
          id: 'default_email_config',
          enabled: true,
          smtpHost: 'smtp.example.com',
          smtpPort: 587,
          smtpUser: 'user@example.com',
          smtpSecure: true,
          fromEmail: 'noreply@example.com',
          fromName: 'Test',
          adminEmail: 'admin@example.com',
          confirmationTemplate: null,
          notificationTemplate: null,
        },
      }),
    });
  });

  it('should send test email', async () => {
    render(<EmailConfigForm />);

    await waitFor(() => {
      expect(screen.getByText(/save configuration/i)).toBeInTheDocument();
    });

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        message: 'Test email sent successfully',
      }),
    });

    const testButton = screen.getByText(/send test email/i);
    fireEvent.click(testButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/admin/email-config/test',
        expect.objectContaining({
          method: 'POST',
        })
      );
    });
  });

  it('should save configuration', async () => {
    render(<EmailConfigForm />);

    await waitFor(() => {
      expect(screen.getByText(/save configuration/i)).toBeInTheDocument();
    });

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        config: {
          id: 'default_email_config',
          enabled: true,
        },
      }),
    });

    const saveButton = screen.getByText(/save configuration/i);
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/admin/email-config',
        expect.objectContaining({
          method: 'PUT',
        })
      );
    });
  });
});

