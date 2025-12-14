import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChatWidget from '@/components/ai/ChatWidget';

// Mock fetch
global.fetch = jest.fn();

describe('ChatWidget', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        message: 'Test response',
      }),
    });
  });

  it('should render chat button when closed', () => {
    render(<ChatWidget />);
    expect(screen.getByLabelText(/open chat/i)).toBeInTheDocument();
  });

  it('should open chat window when button is clicked', () => {
    render(<ChatWidget />);
    const button = screen.getByLabelText(/open chat/i);
    fireEvent.click(button);
    expect(screen.getByRole('heading', { name: /ai assistant/i })).toBeInTheDocument();
  });

  it('should close chat window when close button is clicked', () => {
    render(<ChatWidget />);
    const openButton = screen.getByLabelText(/open chat/i);
    fireEvent.click(openButton);
    
    const closeButton = screen.getByLabelText(/close chat/i);
    fireEvent.click(closeButton);
    
    expect(screen.queryByRole('heading', { name: /ai assistant/i })).not.toBeInTheDocument();
  });

  it('should have input field when open', () => {
    render(<ChatWidget />);
    const openButton = screen.getByLabelText(/open chat/i);
    fireEvent.click(openButton);
    
    expect(screen.getByPlaceholderText(/type your message/i)).toBeInTheDocument();
  });

  it('should have send button when open', () => {
    render(<ChatWidget />);
    const openButton = screen.getByLabelText(/open chat/i);
    fireEvent.click(openButton);
    
    expect(screen.getByText(/send/i)).toBeInTheDocument();
  });

  it('should display welcome message when no messages', () => {
    render(<ChatWidget />);
    const openButton = screen.getByLabelText(/open chat/i);
    fireEvent.click(openButton);
    
    expect(screen.getByText(/hello.*i'm your ai assistant/i)).toBeInTheDocument();
  });
});
