import { POST } from '@/app/api/admin/email-config/test/route';
import { auth } from '@/lib/auth';
import { sendEmail, verifySMTPConnection } from '@/lib/email';
import { generateTestEmail } from '@/lib/email-templates';

jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data, init) => ({
      json: async () => data,
      status: init?.status || 200,
    })),
  },
}));

jest.mock('@/lib/auth', () => ({
  auth: jest.fn(),
}));

jest.mock('@/lib/email', () => ({
  sendEmail: jest.fn(),
  verifySMTPConnection: jest.fn(),
}));

jest.mock('@/lib/email-templates', () => ({
  generateTestEmail: jest.fn(),
}));

const mockAuth = auth as jest.MockedFunction<typeof auth>;
const mockSendEmail = sendEmail as jest.MockedFunction<typeof sendEmail>;
const mockVerifySMTPConnection = verifySMTPConnection as jest.MockedFunction<typeof verifySMTPConnection>;
const mockGenerateTestEmail = generateTestEmail as jest.MockedFunction<typeof generateTestEmail>;

describe('Email Config Test API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuth.mockResolvedValue({
      user: { id: '1', email: 'admin@test.com', name: 'Admin' },
    } as any);
  });

  it('should return 401 if not authenticated', async () => {
    mockAuth.mockResolvedValue(null);

    const request = {
      json: async () => ({ to: 'test@test.com' }),
    } as any;

    const { POST } = await import('@/app/api/admin/email-config/test/route');
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('should return 400 if email address is missing', async () => {
    const request = {
      json: async () => ({}),
    } as any;

    const { POST } = await import('@/app/api/admin/email-config/test/route');
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Email address is required');
  });

  it('should verify SMTP connection before sending', async () => {
    mockVerifySMTPConnection.mockResolvedValue({ success: true });
    mockGenerateTestEmail.mockReturnValue({
      subject: 'Test',
      html: '<p>Test</p>',
      text: 'Test',
    });
    mockSendEmail.mockResolvedValue({
      success: true,
      messageId: 'test-id',
    });

    const request = {
      json: async () => ({ to: 'test@test.com' }),
    } as any;

    const { POST } = await import('@/app/api/admin/email-config/test/route');
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(mockVerifySMTPConnection).toHaveBeenCalled();
    expect(mockSendEmail).toHaveBeenCalled();
  });

  it('should return error if SMTP verification fails', async () => {
    mockVerifySMTPConnection.mockResolvedValue({
      success: false,
      error: 'Connection failed',
    });

    const request = {
      json: async () => ({ to: 'test@test.com' }),
    } as any;

    const { POST } = await import('@/app/api/admin/email-config/test/route');
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Connection failed');
  });

  it('should return error if email sending fails', async () => {
    mockVerifySMTPConnection.mockResolvedValue({ success: true });
    mockGenerateTestEmail.mockReturnValue({
      subject: 'Test',
      html: '<p>Test</p>',
      text: 'Test',
    });
    mockSendEmail.mockResolvedValue({
      success: false,
      error: 'Send failed',
    });

    const request = {
      json: async () => ({ to: 'test@test.com' }),
    } as any;

    const { POST } = await import('@/app/api/admin/email-config/test/route');
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Send failed');
  });
});

