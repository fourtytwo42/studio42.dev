'use client';

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const STORAGE_KEY = 'studio42-chat-messages';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load messages from localStorage on mount
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem(STORAGE_KEY);
      if (savedMessages) {
        const parsed = JSON.parse(savedMessages);
        // Convert timestamp strings back to Date objects
        const messagesWithDates = parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        setMessages(messagesWithDates);
      }
    } catch (error) {
      console.error('Error loading chat from localStorage:', error);
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      } catch (error) {
        console.error('Error saving chat to localStorage:', error);
      }
    }
  }, [messages]);

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

  const clearChat = () => {
    if (confirm('Clear chat history? This will start a new conversation.')) {
      setMessages([]);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (error) {
        console.error('Error clearing chat from localStorage:', error);
      }
    }
  };

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

    // Refocus input immediately after clearing
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);

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
      // Refocus input after response is received
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
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
        <>
          <style jsx global>{`
            /* Assistant message links - subtle blue for light mode */
            .chat-widget-container .chat-link-assistant,
            .chat-widget-container .chat-link-assistant:visited,
            .chat-widget-container .chat-link-assistant:link,
            .chat-widget-container .chat-link-assistant:hover,
            .chat-widget-container .chat-link-assistant:active,
            .chat-widget-container a.chat-link-assistant,
            .chat-widget-container a.chat-link-assistant:visited,
            .chat-widget-container a.chat-link-assistant:link,
            .chat-widget-container a.chat-link-assistant:hover,
            .chat-widget-container a.chat-link-assistant:active {
              color: #2563eb !important; /* Professional blue */
            }
            /* Dark mode: bright teal for all states */
            .dark .chat-widget-container .chat-link-assistant,
            .dark .chat-widget-container .chat-link-assistant:visited,
            .dark .chat-widget-container .chat-link-assistant:link,
            .dark .chat-widget-container .chat-link-assistant:hover,
            .dark .chat-widget-container .chat-link-assistant:active,
            .dark .chat-widget-container a.chat-link-assistant,
            .dark .chat-widget-container a.chat-link-assistant:visited,
            .dark .chat-widget-container a.chat-link-assistant:link,
            .dark .chat-widget-container a.chat-link-assistant:hover,
            .dark .chat-widget-container a.chat-link-assistant:active {
              color: #2dd4bf !important;
            }
            /* Assistant message table links - subtle blue for light mode */
            .chat-widget-container .chat-message-assistant table a,
            .chat-widget-container .chat-message-assistant table a:visited,
            .chat-widget-container .chat-message-assistant table a:link,
            .chat-widget-container .chat-message-assistant table a:hover,
            .chat-widget-container .chat-message-assistant table a:active {
              color: #2563eb !important; /* Professional blue */
              text-decoration: underline;
              font-weight: var(--font-weight-medium);
            }
            /* Dark mode: bright teal for all table link states */
            .dark .chat-widget-container .chat-message-assistant table a,
            .dark .chat-widget-container .chat-message-assistant table a:visited,
            .dark .chat-widget-container .chat-message-assistant table a:link,
            .dark .chat-widget-container .chat-message-assistant table a:hover,
            .dark .chat-widget-container .chat-message-assistant table a:active {
              color: #2dd4bf !important;
            }
            /* User message links - always white for all states */
            .chat-widget-container .chat-link-user,
            .chat-widget-container .chat-link-user:visited,
            .chat-widget-container .chat-link-user:link,
            .chat-widget-container .chat-link-user:hover,
            .chat-widget-container .chat-link-user:active {
              color: rgba(255, 255, 255, 0.95) !important;
            }
            /* User message table links - always white for all states */
            .chat-widget-container .chat-message-user table a,
            .chat-widget-container .chat-message-user table a:visited,
            .chat-widget-container .chat-message-user table a:link,
            .chat-widget-container .chat-message-user table a:hover,
            .chat-widget-container .chat-message-user table a:active {
              color: rgba(255, 255, 255, 0.95) !important;
              text-decoration: underline;
              font-weight: var(--font-weight-medium);
            }
            /* Light mode: subtle blue header instead of orange */
            :not(.dark) .chat-widget-container .chat-header {
              background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%) !important;
            }
            /* Dark mode: keep existing primary color */
            .dark .chat-widget-container .chat-header {
              background: var(--color-primary) !important;
            }
            /* Light mode: subtle blue send button instead of orange */
            :not(.dark) .chat-widget-container .chat-send-button:not(:disabled) {
              background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%) !important;
            }
            /* Dark mode: keep existing primary color for send button */
            .dark .chat-widget-container .chat-send-button:not(:disabled) {
              background: var(--color-primary) !important;
            }
            /* Light mode: blue user message bubbles instead of orange */
            :not(.dark) .chat-widget-container .chat-message-user {
              background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%) !important;
            }
            /* Dark mode: keep existing primary color for user messages */
            .dark .chat-widget-container .chat-message-user {
              background: var(--color-primary) !important;
            }
            /* Light mode: ensure input has proper styling */
            :not(.dark) .chat-widget-container .chat-input {
              background-color: white !important;
              color: var(--color-text-primary) !important;
              border-color: #d1d5db !important;
            }
            /* Dark mode: keep existing input styling */
            .dark .chat-widget-container .chat-input {
              background-color: var(--color-background) !important;
              color: var(--color-text-primary) !important;
            }
          `}</style>
          <div
            className="chat-widget-container"
            style={{
              position: 'fixed',
              bottom: isFullscreen ? 0 : 'var(--spacing-lg)',
              right: isFullscreen ? 0 : 'var(--spacing-lg)',
              left: isFullscreen ? 0 : 'auto',
              top: isFullscreen ? 0 : 'auto',
              width: isFullscreen ? '100vw' : '600px',
              maxWidth: isFullscreen ? '100vw' : 'calc(100vw - var(--spacing-xl))',
              height: isFullscreen ? '100vh' : '700px',
              maxHeight: isFullscreen ? '100vh' : 'calc(100vh - var(--spacing-xl))',
              backgroundColor: 'var(--color-background)',
              borderRadius: isFullscreen ? 0 : 'var(--radius-lg)',
              boxShadow: 'var(--shadow-xl)',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 1001,
              border: isFullscreen ? 'none' : '1px solid var(--color-background-tertiary)',
              transition: 'var(--transition-base)',
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
              borderRadius: isFullscreen ? 0 : 'var(--radius-lg) var(--radius-lg) 0 0',
              position: 'sticky',
              top: 0,
              zIndex: 10,
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
            <div style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'center' }}>
              {!isFullscreen && (
                <>
                  <button
                    onClick={clearChat}
                    disabled={messages.length === 0}
                    style={{
                      background: messages.length === 0 ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)',
                      border: 'none',
                      color: 'white',
                      fontSize: 'var(--font-size-sm)',
                      cursor: messages.length === 0 ? 'not-allowed' : 'pointer',
                      padding: 'var(--spacing-xs) var(--spacing-sm)',
                      borderRadius: 'var(--radius-sm)',
                      transition: 'var(--transition-base)',
                      opacity: messages.length === 0 ? 0.5 : 1,
                    }}
                    onMouseEnter={(e) => {
                      if (messages.length > 0) {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (messages.length > 0) {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                      }
                    }}
                    aria-label="Clear chat"
                    title="Clear chat history"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      border: 'none',
                      color: 'white',
                      fontSize: '18px',
                      cursor: 'pointer',
                      padding: 'var(--spacing-xs)',
                      borderRadius: 'var(--radius-sm)',
                      width: '30px',
                      height: '30px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'var(--transition-base)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                    }}
                    aria-label={isFullscreen ? 'Minimize chat' : 'Expand chat'}
                    title={isFullscreen ? 'Minimize chat' : 'Expand to full screen'}
                  >
                    {isFullscreen ? '🗗' : '🗖'}
                  </button>
                </>
              )}
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsFullscreen(false);
                }}
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
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              overflowX: 'hidden',
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
                  className={message.role === 'user' ? 'chat-message-user' : 'chat-message-assistant'}
                  style={{
                    maxWidth: '85%',
                    width: '100%',
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
                    overflow: 'hidden',
                  }}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    components={{
                      // Style markdown elements
                      p: ({ node, ...props }) => (
                        <p style={{ margin: '0 0 var(--spacing-sm) 0', lineHeight: 'var(--line-height-relaxed)' }} {...props} />
                      ),
                      ul: ({ node, ...props }) => (
                        <ul style={{ margin: '0 0 var(--spacing-sm) 0', paddingLeft: 'var(--spacing-lg)' }} {...props} />
                      ),
                      ol: ({ node, ...props }) => (
                        <ol style={{ margin: '0 0 var(--spacing-sm) 0', paddingLeft: 'var(--spacing-lg)' }} {...props} />
                      ),
                      li: ({ node, ...props }) => (
                        <li style={{ marginBottom: 'var(--spacing-xs)' }} {...props} />
                      ),
                      strong: ({ node, ...props }) => (
                        <strong style={{ fontWeight: 'var(--font-weight-bold)' }} {...props} />
                      ),
                      em: ({ node, ...props }) => (
                        <em style={{ fontStyle: 'italic' }} {...props} />
                      ),
                      code: ({ node, inline, ...props }: any) => {
                        if (inline) {
                          return (
                            <code
                              style={{
                                backgroundColor: message.role === 'user' 
                                  ? 'rgba(255, 255, 255, 0.2)' 
                                  : 'var(--color-background-tertiary)',
                                padding: '2px 6px',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: '0.9em',
                                fontFamily: 'var(--font-family-mono)',
                              }}
                              {...props}
                            />
                          );
                        }
                        return (
                          <code
                            style={{
                              display: 'block',
                              backgroundColor: message.role === 'user' 
                                ? 'rgba(255, 255, 255, 0.2)' 
                                : 'var(--color-background-tertiary)',
                              padding: 'var(--spacing-sm)',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '0.9em',
                              fontFamily: 'var(--font-family-mono)',
                              overflowX: 'auto',
                              margin: 'var(--spacing-sm) 0',
                            }}
                            {...props}
                          />
                        );
                      },
                      a: ({ node, ...props }) => {
                        // Remove color from any inline styles that ReactMarkdown might pass
                        const { style, ...restProps } = props as any;
                        const cleanStyle: React.CSSProperties = style ? { ...style } : {};
                        // Explicitly remove color to let CSS handle it
                        delete cleanStyle.color;
                        
                        return (
                          <a
                            className={message.role === 'user' ? 'chat-link-user' : 'chat-link-assistant'}
                            style={{
                              textDecoration: 'underline',
                              ...cleanStyle,
                            }}
                            target="_blank"
                            rel="noopener noreferrer"
                            {...restProps}
                          />
                        );
                      },
                      h1: ({ node, ...props }) => (
                        <h1 style={{ fontSize: 'var(--font-size-xl)', margin: '0 0 var(--spacing-sm) 0', fontWeight: 'var(--font-weight-bold)' }} {...props} />
                      ),
                      h2: ({ node, ...props }) => (
                        <h2 style={{ fontSize: 'var(--font-size-lg)', margin: '0 0 var(--spacing-sm) 0', fontWeight: 'var(--font-weight-bold)' }} {...props} />
                      ),
                      h3: ({ node, ...props }) => (
                        <h3 style={{ fontSize: 'var(--font-size-base)', margin: '0 0 var(--spacing-sm) 0', fontWeight: 'var(--font-weight-semibold)' }} {...props} />
                      ),
                      blockquote: ({ node, ...props }) => (
                        <blockquote
                          style={{
                            borderLeft: `3px solid ${message.role === 'user' ? 'rgba(255, 255, 255, 0.3)' : 'var(--color-primary)'}`,
                            paddingLeft: 'var(--spacing-md)',
                            margin: 'var(--spacing-sm) 0',
                            fontStyle: 'italic',
                          }}
                          {...props}
                        />
                      ),
                      table: ({ node, ...props }) => (
                        <div style={{ overflowX: 'auto', margin: 'var(--spacing-sm) 0', width: '100%' }}>
                          <table
                            style={{
                              width: '100%',
                              borderCollapse: 'collapse',
                              fontSize: '0.9em',
                              minWidth: '100%',
                            }}
                            {...props}
                          />
                        </div>
                      ),
                      thead: ({ node, ...props }) => (
                        <thead
                          style={{
                            backgroundColor: message.role === 'user' 
                              ? 'rgba(255, 255, 255, 0.1)' 
                              : 'var(--color-background-tertiary)',
                          }}
                          {...props}
                        />
                      ),
                      tbody: ({ node, ...props }) => (
                        <tbody {...props} />
                      ),
                      tr: ({ node, ...props }) => (
                        <tr
                          style={{
                            borderBottom: `1px solid ${message.role === 'user' ? 'rgba(255, 255, 255, 0.1)' : 'var(--color-border)'}`,
                          }}
                          {...props}
                        />
                      ),
                      th: ({ node, ...props }) => (
                        <th
                          style={{
                            padding: 'var(--spacing-xs) var(--spacing-sm)',
                            textAlign: 'left',
                            fontWeight: 'var(--font-weight-semibold)',
                          }}
                          {...props}
                        />
                      ),
                      td: ({ node, ...props }) => (
                        <td
                          style={{
                            padding: 'var(--spacing-xs) var(--spacing-sm)',
                          }}
                          {...props}
                        />
                      ),
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
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
              flexDirection: 'column',
              gap: 'var(--spacing-sm)',
            }}
          >
            {isFullscreen && (
              <div style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'center', justifyContent: 'flex-end' }}>
                <button
                  onClick={clearChat}
                  disabled={messages.length === 0}
                  style={{
                    background: messages.length === 0 ? 'var(--color-background-tertiary)' : 'var(--color-background-secondary)',
                    border: '1px solid var(--color-border)',
                    color: messages.length === 0 ? 'var(--color-text-tertiary)' : 'var(--color-text-primary)',
                    fontSize: 'var(--font-size-sm)',
                    cursor: messages.length === 0 ? 'not-allowed' : 'pointer',
                    padding: 'var(--spacing-xs) var(--spacing-sm)',
                    borderRadius: 'var(--radius-sm)',
                    transition: 'var(--transition-base)',
                    opacity: messages.length === 0 ? 0.5 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (messages.length > 0) {
                      e.currentTarget.style.backgroundColor = 'var(--color-background-tertiary)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (messages.length > 0) {
                      e.currentTarget.style.backgroundColor = 'var(--color-background-secondary)';
                    }
                  }}
                  aria-label="Clear chat"
                  title="Clear chat history"
                >
                  Clear
                </button>
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  style={{
                    background: 'var(--color-background-secondary)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text-primary)',
                    fontSize: '18px',
                    cursor: 'pointer',
                    padding: 'var(--spacing-xs)',
                    borderRadius: 'var(--radius-sm)',
                    width: '30px',
                    height: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'var(--transition-base)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-background-tertiary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-background-secondary)';
                  }}
                  aria-label={isFullscreen ? 'Minimize chat' : 'Expand chat'}
                  title={isFullscreen ? 'Minimize chat' : 'Expand to full screen'}
                >
                  {isFullscreen ? '🗗' : '🗖'}
                </button>
              </div>
            )}
            <div style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'center' }}>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={loading}
                className="chat-input"
                style={{
                  flex: 1,
                  padding: 'var(--spacing-sm) var(--spacing-md)',
                  border: '1px solid var(--color-text-tertiary)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--font-size-base)',
                  fontFamily: 'var(--font-family)',
                  backgroundColor: 'var(--color-background)',
                  color: 'var(--color-text-primary)',
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
        </div>
        </>
      )}
    </>
  );
}

