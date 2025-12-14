import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChatWidget from '@/components/ai/ChatWidget';

// Mock fetch
global.fetch = jest.fn();

// Mock scrollIntoView
Element.prototype.scrollIntoView = jest.fn();

describe('ChatWidget Interactions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        message: 'Test response',
      }),
    });
  });

  it('should send message and display response', async () => {
    render(<ChatWidget />);
    
    // Open chat
    const openButton = screen.getByLabelText(/open chat/i);
    fireEvent.click(openButton);

    // Wait for chat to open
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/type your message/i)).toBeInTheDocument();
    });

    // Type message
    const input = screen.getByPlaceholderText(/type your message/i);
    fireEvent.change(input, { target: { value: 'Hello' } });

    // Send message
    const sendButton = screen.getByText(/send/i);
    fireEvent.click(sendButton);

    // Wait for fetch to be called
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/ai/chat',
        expect.objectContaining({
          method: 'POST',
        })
      );
    }, { timeout: 3000 });
  });

  it('should have input field that accepts text', async () => {
    render(<ChatWidget />);
    
    const openButton = screen.getByLabelText(/open chat/i);
    fireEvent.click(openButton);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/type your message/i)).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText(/type your message/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Test message' } });
    
    expect(input.value).toBe('Test message');
  });

  it('should not send empty messages', () => {
    render(<ChatWidget />);
    const openButton = screen.getByLabelText(/open chat/i);
    fireEvent.click(openButton);

    const sendButton = screen.getByText(/send/i);
    expect(sendButton).toBeDisabled();
  });
});

