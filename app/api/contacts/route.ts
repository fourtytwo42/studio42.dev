import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { contactFormSchema } from '@/lib/validation';
import { sendEmail } from '@/lib/email';
import { generateUserConfirmationEmail, generateAdminNotificationEmail } from '@/lib/email-templates';
import { InquiryType, ContactMethod } from '@prisma/client';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate form data
    const validationResult = contactFormSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Create contact record
    const contact = await prisma.contact.create({
      data: {
        name: data.name,
        email: data.email,
        company: data.company || null,
        phone: data.phone || null,
        product: data.product || null,
        inquiryType: data.inquiryType as InquiryType,
        message: data.message,
        preferredMethod: data.contactMethod as ContactMethod,
        source: data.product || 'website',
      },
    });

    // Send email notifications if enabled
    try {
      const emailConfig = await prisma.emailConfig.findFirst();
      if (emailConfig?.enabled) {
        // Send user confirmation email
        const userEmail = generateUserConfirmationEmail(contact, emailConfig);
        await sendEmail(contact.email, userEmail.subject, userEmail.html, userEmail.text);

        // Send admin notification email
        if (emailConfig.adminEmail) {
          const adminEmail = generateAdminNotificationEmail(contact, emailConfig);
          await sendEmail(emailConfig.adminEmail, adminEmail.subject, adminEmail.html, adminEmail.text);
        }
      }
    } catch (emailError) {
      // Log email error but don't fail the contact submission
      console.error('Error sending email notifications:', emailError);
    }

    return NextResponse.json(
      { success: true, id: contact.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating contact:', error);
    return NextResponse.json(
      { error: 'Failed to submit contact form' },
      { status: 500 }
    );
  }
}

