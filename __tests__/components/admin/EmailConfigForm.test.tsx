import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EmailConfigForm from '@/components/admin/EmailConfigForm';

// Mock fetch
global.fetch = jest.fn();

describe('EmailConfigForm', () => {
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
          confirmationTemplate: 'Template',
          notificationTemplate: 'Template',
        },
      }),
    });
  });

  it('should render email configuration form', async () => {
    render(<EmailConfigForm />);

    await waitFor(() => {
      expect(screen.getByText(/email settings/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/smtp configuration/i)).toBeInTheDocument();
    expect(screen.getByText(/email addresses/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/enable email notifications/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/smtp host/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/smtp port/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/smtp username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/smtp password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/from email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/from name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/admin notification email/i)).toBeInTheDocument();
  });

  it('should display loading state initially', () => {
    render(<EmailConfigForm />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should handle form submission', async () => {
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
          smtpHost: 'smtp.example.com',
        },
      }),
    });

    const submitButton = screen.getByText(/save configuration/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/admin/email-config',
        expect.objectContaining({
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
        })
      );
    });
  });

  it('should display error message on fetch failure', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Failed to fetch' }),
    });

    render(<EmailConfigForm />);

    await waitFor(() => {
      expect(screen.getByText(/failed to load configuration/i)).toBeInTheDocument();
    });
  });

  it('should display error message on save failure', async () => {
    render(<EmailConfigForm />);

    await waitFor(() => {
      expect(screen.getByText(/save configuration/i)).toBeInTheDocument();
    });

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Failed to save' }),
    });

    const submitButton = screen.getByText(/save configuration/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/failed to save/i)).toBeInTheDocument();
    });
  });

  it('should display success message on successful save', async () => {
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

    const submitButton = screen.getByText(/save configuration/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/configuration saved successfully/i)).toBeInTheDocument();
    });
  });
});

