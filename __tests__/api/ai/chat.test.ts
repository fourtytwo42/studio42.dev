import { checkRateLimit } from '@/lib/rate-limit';
import { searchKnowledgeBase } from '@/lib/semantic-search';
import { prisma } from '@/lib/prisma';

jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data, init) => ({
      json: async () => data,
      status: init?.status || 200,
    })),
  },
}));

jest.mock('groq-sdk', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@/lib/rate-limit');
jest.mock('@/lib/semantic-search');
jest.mock('@/lib/groq', () => ({
  getGroqClient: jest.fn(),
  generateChatCompletion: jest.fn(),
  generateEmbedding: jest.fn(),
}));
jest.mock('@/lib/prisma', () => ({
  prisma: {
    contact: {
      create: jest.fn(),
    },
  },
}));

const mockCheckRateLimit = checkRateLimit as jest.MockedFunction<typeof checkRateLimit>;
const mockSearchKnowledgeBase = searchKnowledgeBase as jest.MockedFunction<typeof searchKnowledgeBase>;
const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe('AI Chat API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCheckRateLimit.mockResolvedValue({
      allowed: true,
      remaining: 10,
      resetAt: new Date(),
    });
  });

  it('should return 429 if rate limited', async () => {
    mockCheckRateLimit.mockResolvedValue({
      allowed: false,
      remaining: 0,
      resetAt: new Date(),
    });

    const request = {
      headers: {
        get: jest.fn((key) => (key === 'x-forwarded-for' ? '127.0.0.1' : null)),
      },
      json: async () => ({ message: 'test' }),
    } as any;

    const { POST } = await import('@/app/api/ai/chat/route');
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(429);
    expect(data.error).toBe('Rate limit exceeded');
  });

  it('should return 400 if message is missing', async () => {
    const request = {
      headers: {
        get: jest.fn(() => null),
      },
      json: async () => ({}),
    } as any;

    const { POST } = await import('@/app/api/ai/chat/route');
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Message is required');
  });

  it('should process chat message', async () => {
    const { generateChatCompletion } = await import('@/lib/groq');
    const mockGenerateChatCompletion = generateChatCompletion as jest.MockedFunction<typeof generateChatCompletion>;
    
    mockSearchKnowledgeBase.mockResolvedValue([]);
    mockGenerateChatCompletion.mockResolvedValue({
      choices: [
        {
          message: {
            content: 'Test response',
            tool_calls: undefined,
          },
        },
      ],
    } as any);

    const request = {
      headers: {
        get: jest.fn(() => null),
      },
      json: async () => ({ message: 'test message' }),
    } as any;

    const { POST } = await import('@/app/api/ai/chat/route');
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toBe('Test response');
  });

  it('should handle tool calls', async () => {
    const { generateChatCompletion } = await import('@/lib/groq');
    const mockGenerateChatCompletion = generateChatCompletion as jest.MockedFunction<typeof generateChatCompletion>;
    
    mockSearchKnowledgeBase.mockResolvedValue([
      {
        id: '1',
        title: 'Test',
        content: 'Test content',
        category: 'product',
        similarity: 0.9,
      },
    ]);

    mockGenerateChatCompletion
      .mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: null,
              tool_calls: [
                {
                  id: 'call-1',
                  function: {
                    name: 'search_knowledge_base',
                    arguments: JSON.stringify({ query: 'test' }),
                  },
                },
              ],
            },
          },
        ],
      } as any)
      .mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: 'Response with context',
            },
          },
        ],
      } as any);

    const request = {
      headers: {
        get: jest.fn(() => null),
      },
      json: async () => ({ message: 'test message' }),
    } as any;

    const { POST } = await import('@/app/api/ai/chat/route');
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toBe('Response with context');
  });

  it('should handle errors', async () => {
    mockSearchKnowledgeBase.mockRejectedValue(new Error('Search error'));

    const request = {
      headers: {
        get: jest.fn(() => null),
      },
      json: async () => ({ message: 'test message' }),
    } as any;

    const { POST } = await import('@/app/api/ai/chat/route');
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200); // Should still return 200, just without KB context
  });
});

