import { prisma } from './prisma';
import { ProductStatus, InquiryType, ContactMethod } from '@prisma/client';

/**
 * Database helper functions
 */

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      media: {
        orderBy: { order: 'asc' },
      },
    },
  });
}

export async function getAllProducts() {
  return prisma.product.findMany({
    orderBy: [
      { status: 'asc' },
      { name: 'asc' },
    ],
  });
}

export async function getProductsByStatus(status: ProductStatus) {
  return prisma.product.findMany({
    where: { status },
    orderBy: { name: 'asc' },
  });
}

export async function createContact(data: {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  product?: string;
  inquiryType: InquiryType;
  message: string;
  preferredMethod?: ContactMethod;
  source?: string;
}) {
  return prisma.contact.create({
    data: {
      name: data.name,
      email: data.email,
      company: data.company,
      phone: data.phone,
      product: data.product,
      inquiryType: data.inquiryType,
      message: data.message,
      preferredMethod: data.preferredMethod || ContactMethod.EMAIL,
      source: data.source,
    },
  });
}

export async function getContactById(id: string) {
  return prisma.contact.findUnique({
    where: { id },
    include: {
      productRelation: true,
    },
  });
}

export async function getContacts(filters?: {
  read?: boolean;
  product?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const page = filters?.page || 1;
  const limit = filters?.limit || 50;
  const skip = (page - 1) * limit;

  const where: any = {};
  if (filters?.read !== undefined) {
    where.read = filters.read;
  }
  if (filters?.product) {
    where.product = filters.product;
  }
  if (filters?.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { email: { contains: filters.search, mode: 'insensitive' } },
      { message: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  const [contacts, total] = await Promise.all([
    prisma.contact.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        productRelation: true,
      },
    }),
    prisma.contact.count({ where }),
  ]);

  return {
    contacts,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function markContactAsRead(id: string) {
  return prisma.contact.update({
    where: { id },
    data: { read: true },
  });
}

export async function markContactAsResponded(id: string) {
  return prisma.contact.update({
    where: { id },
    data: { responded: true },
  });
}

export async function getContactStats() {
  const [total, unread, responded] = await Promise.all([
    prisma.contact.count(),
    prisma.contact.count({ where: { read: false } }),
    prisma.contact.count({ where: { responded: true } }),
  ]);

  return {
    total,
    unread,
    responded,
    read: total - unread,
  };
}

export async function getEmailConfig() {
  return prisma.emailConfig.findFirst();
}

export async function updateEmailConfig(data: {
  enabled?: boolean;
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPassword?: string;
  smtpSecure?: boolean;
  fromEmail?: string;
  fromName?: string;
  adminEmail?: string;
  confirmationTemplate?: string;
  notificationTemplate?: string;
  updatedBy?: string;
}) {
  const existing = await prisma.emailConfig.findFirst();
  
  if (existing) {
    return prisma.emailConfig.update({
      where: { id: existing.id },
      data,
    });
  } else {
    return prisma.emailConfig.create({
      data: {
        enabled: data.enabled || false,
        smtpHost: data.smtpHost,
        smtpPort: data.smtpPort,
        smtpUser: data.smtpUser,
        smtpPassword: data.smtpPassword,
        smtpSecure: data.smtpSecure ?? true,
        fromEmail: data.fromEmail,
        fromName: data.fromName,
        adminEmail: data.adminEmail,
        confirmationTemplate: data.confirmationTemplate,
        notificationTemplate: data.notificationTemplate,
        updatedBy: data.updatedBy,
      },
    });
  }
}

export async function getAdminByEmail(email: string) {
  return prisma.admin.findUnique({
    where: { email },
  });
}

export async function updateAdminLastLogin(id: string) {
  return prisma.admin.update({
    where: { id },
    data: { lastLogin: new Date() },
  });
}

