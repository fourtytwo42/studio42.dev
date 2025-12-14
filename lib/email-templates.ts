import { Contact } from '@prisma/client';
import { EmailConfig } from '@prisma/client';

/**
 * Replace template variables with actual values
 */
function replaceVariables(template: string, variables: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`\\{${key}\\}`, 'g');
    result = result.replace(regex, value);
  }
  return result;
}

/**
 * Generate user confirmation email
 */
export function generateUserConfirmationEmail(
  contact: Contact,
  config: EmailConfig
): { subject: string; html: string; text: string } {
  const defaultTemplate = `
    <h2>Thank You for Contacting Studio42.dev</h2>
    <p>Hello {name},</p>
    <p>We have received your inquiry and will get back to you as soon as possible.</p>
    <p><strong>Your Message:</strong></p>
    <p>{message}</p>
    <p>Best regards,<br>The Studio42.dev Team</p>
  `;

  const template = config.confirmationTemplate || defaultTemplate;

  const variables: Record<string, string> = {
    name: contact.name,
    email: contact.email,
    company: contact.company || 'N/A',
    phone: contact.phone || 'N/A',
    product: contact.product || 'General Inquiry',
    inquiryType: contact.inquiryType,
    message: contact.message,
    source: contact.source || 'website',
    timestamp: new Date(contact.createdAt).toLocaleString(),
    adminDashboardUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/admin/contacts/${contact.id}`,
  };

  const html = replaceVariables(template, variables);
  const text = html.replace(/<[^>]*>/g, ''); // Strip HTML for text version

  return {
    subject: `Thank You for Contacting Studio42.dev - ${contact.inquiryType}`,
    html,
    text,
  };
}

/**
 * Generate admin notification email
 */
export function generateAdminNotificationEmail(
  contact: Contact,
  config: EmailConfig
): { subject: string; html: string; text: string } {
  const defaultTemplate = `
    <h2>New Contact Form Submission</h2>
    <p>A new contact form has been submitted:</p>
    <ul>
      <li><strong>Name:</strong> {name}</li>
      <li><strong>Email:</strong> {email}</li>
      <li><strong>Company:</strong> {company}</li>
      <li><strong>Phone:</strong> {phone}</li>
      <li><strong>Product:</strong> {product}</li>
      <li><strong>Inquiry Type:</strong> {inquiryType}</li>
      <li><strong>Message:</strong> {message}</li>
      <li><strong>Source:</strong> {source}</li>
      <li><strong>Submitted:</strong> {timestamp}</li>
    </ul>
    <p><a href="{adminDashboardUrl}">View in Admin Dashboard</a></p>
  `;

  const template = config.notificationTemplate || defaultTemplate;

  const variables: Record<string, string> = {
    name: contact.name,
    email: contact.email,
    company: contact.company || 'N/A',
    phone: contact.phone || 'N/A',
    product: contact.product || 'General Inquiry',
    inquiryType: contact.inquiryType,
    message: contact.message,
    source: contact.source || 'website',
    timestamp: new Date(contact.createdAt).toLocaleString(),
    adminDashboardUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/admin/contacts/${contact.id}`,
  };

  const html = replaceVariables(template, variables);
  const text = html.replace(/<[^>]*>/g, ''); // Strip HTML for text version

  return {
    subject: `New Contact: ${contact.name} - ${contact.inquiryType}`,
    html,
    text,
  };
}

/**
 * Generate test email
 */
export function generateTestEmail(): { subject: string; html: string; text: string } {
  const html = `
    <h2>Test Email from Studio42.dev</h2>
    <p>This is a test email to verify your email configuration is working correctly.</p>
    <p>If you received this email, your SMTP settings are configured properly!</p>
    <p>Sent at: ${new Date().toLocaleString()}</p>
  `;

  const text = html.replace(/<[^>]*>/g, '');

  return {
    subject: 'Test Email - Studio42.dev',
    html,
    text,
  };
}

