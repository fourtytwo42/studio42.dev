'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          history,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to get response');
      }

      const data = await response.json();

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: 'assistant',
        content: error instanceof Error ? error.message : 'An error occurred. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: 'var(--spacing-lg)',
            right: 'var(--spacing-lg)',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            zIndex: 1000,
            transition: 'var(--transition-base)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
          aria-label="Open chat"
        >
          💬
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: 'var(--spacing-lg)',
            right: 'var(--spacing-lg)',
            width: '400px',
            maxWidth: 'calc(100vw - var(--spacing-xl))',
            height: '600px',
            maxHeight: 'calc(100vh - var(--spacing-xl))',
            backgroundColor: 'var(--color-background)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-xl)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1001,
            border: '1px solid var(--color-background-tertiary)',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: 'var(--spacing-md)',
              borderBottom: '1px solid var(--color-background-tertiary)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: 'var(--color-primary)',
              color: 'white',
              borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: 'var(--font-size-lg)',
                fontWeight: 'var(--font-weight-semibold)',
              }}
            >
              AI Assistant
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                fontSize: '24px',
                cursor: 'pointer',
                padding: 0,
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label="Close chat"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: 'var(--spacing-md)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-md)',
            }}
          >
            {messages.length === 0 && (
              <div
                style={{
                  textAlign: 'center',
                  color: 'var(--color-text-secondary)',
                  padding: 'var(--spacing-xl)',
                }}
              >
                <p>Hello! I'm your AI assistant. How can I help you today?</p>
              </div>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    maxWidth: '80%',
                    padding: 'var(--spacing-sm) var(--spacing-md)',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor:
                      message.role === 'user'
                        ? 'var(--color-primary)'
                        : 'var(--color-background-secondary)',
                    color:
                      message.role === 'user'
                        ? 'white'
                        : 'var(--color-text-primary)',
                    fontSize: 'var(--font-size-sm)',
                    lineHeight: 'var(--line-height-relaxed)',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {loading && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                }}
              >
                <div
                  style={{
                    padding: 'var(--spacing-sm) var(--spacing-md)',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-background-secondary)',
                    color: 'var(--color-text-secondary)',
                    fontSize: 'var(--font-size-sm)',
                  }}
                >
                  Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            style={{
              padding: 'var(--spacing-md)',
              borderTop: '1px solid var(--color-background-tertiary)',
              display: 'flex',
              gap: 'var(--spacing-sm)',
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={loading}
              style={{
                flex: 1,
                padding: 'var(--spacing-sm) var(--spacing-md)',
                border: '1px solid var(--color-text-tertiary)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--font-size-base)',
                fontFamily: 'var(--font-family)',
              }}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              style={{
                padding: 'var(--spacing-sm) var(--spacing-md)',
                backgroundColor:
                  loading || !input.trim()
                    ? 'var(--color-text-tertiary)'
                    : 'var(--color-primary)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                fontSize: 'var(--font-size-base)',
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}

