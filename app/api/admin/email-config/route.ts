import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const config = await prisma.emailConfig.findFirst();

    if (!config) {
      return NextResponse.json(
        { error: 'Email configuration not found' },
        { status: 404 }
      );
    }

    // Don't return password
    const { smtpPassword, ...configWithoutPassword } = config;

    return NextResponse.json({ config: configWithoutPassword });
  } catch (error) {
    console.error('Error fetching email config:', error);
    return NextResponse.json(
      { error: 'Failed to fetch email configuration' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    const updateData: any = {
      enabled: body.enabled ?? false,
      smtpHost: body.smtpHost || null,
      smtpPort: body.smtpPort ? parseInt(body.smtpPort) : null,
      smtpUser: body.smtpUser || null,
      smtpPassword: body.smtpPassword || undefined, // Only update if provided
      smtpSecure: body.smtpSecure ?? true,
      fromEmail: body.fromEmail || null,
      fromName: body.fromName || null,
      adminEmail: body.adminEmail || null,
      confirmationTemplate: body.confirmationTemplate || null,
      notificationTemplate: body.notificationTemplate || null,
      updatedBy: session.user?.email || null,
    };

    // Remove undefined values
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    const config = await prisma.emailConfig.upsert({
      where: { id: 'default_email_config' },
      update: updateData,
      create: {
        id: 'default_email_config',
        ...updateData,
      },
    });

    // Reset email transporter cache after config update
    const { resetTransporterCache } = await import('@/lib/email');
    resetTransporterCache();

    // Don't return password
    const { smtpPassword, ...configWithoutPassword } = config;

    return NextResponse.json({ config: configWithoutPassword });
  } catch (error) {
    console.error('Error updating email config:', error);
    return NextResponse.json(
      { error: 'Failed to update email configuration' },
      { status: 500 }
    );
  }
}

