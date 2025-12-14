import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChatWidget from '@/components/ai/ChatWidget';

// Mock fetch
global.fetch = jest.fn();

// Mock scrollIntoView
Element.prototype.scrollIntoView = jest.fn();

describe('ChatWidget Coverage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        message: 'Test response',
      }),
    });
  });

  it('should handle successful message send and display response', async () => {
    render(<ChatWidget />);
    
    const openButton = screen.getByLabelText(/open chat/i);
    fireEvent.click(openButton);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/type your message/i)).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText(/type your message/i);
    fireEvent.change(input, { target: { value: 'Hello' } });

    const sendButton = screen.getByText(/send/i);
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText('Hello')).toBeInTheDocument();
    }, { timeout: 3000 });

    await waitFor(() => {
      expect(screen.getByText('Test response')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('should handle API errors gracefully', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        error: 'API Error',
        message: 'Failed to process',
      }),
    });

    render(<ChatWidget />);
    
    const openButton = screen.getByLabelText(/open chat/i);
    fireEvent.click(openButton);

    await waitFor(() => {
      const input = screen.getByPlaceholderText(/type your message/i);
      fireEvent.change(input, { target: { value: 'Test' } });
    });

    const sendButton = screen.getByText(/send/i);
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText(/failed to process/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('should handle network errors', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    render(<ChatWidget />);
    
    const openButton = screen.getByLabelText(/open chat/i);
    fireEvent.click(openButton);

    await waitFor(() => {
      const input = screen.getByPlaceholderText(/type your message/i);
      fireEvent.change(input, { target: { value: 'Test' } });
    });

    const sendButton = screen.getByText(/send/i);
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('should disable send button while loading', async () => {
    let resolvePromise: (value: any) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    (global.fetch as jest.Mock).mockImplementation(() => promise);

    render(<ChatWidget />);
    
    const openButton = screen.getByLabelText(/open chat/i);
    fireEvent.click(openButton);

    await waitFor(() => {
      const input = screen.getByPlaceholderText(/type your message/i);
      fireEvent.change(input, { target: { value: 'Test' } });
    });

    const sendButton = screen.getByText(/send/i);
    fireEvent.click(sendButton);

    // Button should be disabled while loading
    expect(sendButton).toBeDisabled();

    // Resolve promise
    resolvePromise!({ ok: true, json: async () => ({ message: 'Response' }) });
  });
});

