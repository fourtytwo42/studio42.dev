import nodemailer from 'nodemailer';
import { prisma } from './prisma';
import { getEnvVar } from './env';

let transporter: nodemailer.Transporter | null = null;

/**
 * Get or create email transporter
 */
async function getTransporter(): Promise<nodemailer.Transporter | null> {
  const config = await prisma.emailConfig.findFirst();

  if (!config || !config.enabled) {
    return null;
  }

  if (!config.smtpHost || !config.smtpPort || !config.smtpUser) {
    return null;
  }

  // Return cached transporter if config hasn't changed
  if (transporter) {
    return transporter;
  }

  transporter = nodemailer.createTransport({
    host: config.smtpHost,
    port: config.smtpPort,
    secure: config.smtpSecure, // true for 465, false for other ports
    auth: {
      user: config.smtpUser,
      pass: config.smtpPassword || undefined,
    },
  });

  return transporter;
}

/**
 * Send email
 */
export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  text?: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const config = await prisma.emailConfig.findFirst();

    if (!config || !config.enabled) {
      return {
        success: false,
        error: 'Email is not enabled',
      };
    }

    if (!config.fromEmail) {
      return {
        success: false,
        error: 'From email is not configured',
      };
    }

    const emailTransporter = await getTransporter();
    if (!emailTransporter) {
      return {
        success: false,
        error: 'Failed to create email transporter',
      };
    }

    const mailOptions = {
      from: config.fromName
        ? `${config.fromName} <${config.fromEmail}>`
        : config.fromEmail,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
    };

    const info = await emailTransporter.sendMail(mailOptions);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Verify SMTP connection
 */
export async function verifySMTPConnection(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const emailTransporter = await getTransporter();
    if (!emailTransporter) {
      return {
        success: false,
        error: 'Email transporter not available',
      };
    }

    await emailTransporter.verify();

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'SMTP verification failed',
    };
  }
}

/**
 * Reset transporter cache (useful after config changes)
 */
export function resetTransporterCache(): void {
  transporter = null;
}

