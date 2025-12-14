import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendEmail, verifySMTPConnection } from '@/lib/email';
import { generateTestEmail } from '@/lib/email-templates';

export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { to } = body;

    if (!to || typeof to !== 'string') {
      return NextResponse.json(
        { error: 'Email address is required' },
        { status: 400 }
      );
    }

    // Verify SMTP connection first
    const verification = await verifySMTPConnection();
    if (!verification.success) {
      return NextResponse.json(
        { error: verification.error || 'SMTP connection failed' },
        { status: 500 }
      );
    }

    // Generate test email
    const testEmail = generateTestEmail();

    // Send test email
    const result = await sendEmail(to, testEmail.subject, testEmail.html, testEmail.text);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to send test email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      messageId: result.messageId,
    });
  } catch (error) {
    console.error('Error sending test email:', error);
    return NextResponse.json(
      { error: 'Failed to send test email' },
      { status: 500 }
    );
  }
}

