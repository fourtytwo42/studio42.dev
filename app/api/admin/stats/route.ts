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

    const [
      totalContacts,
      unreadContacts,
      respondedContacts,
      contactsByType,
      recentContacts,
    ] = await Promise.all([
      prisma.contact.count(),
      prisma.contact.count({ where: { read: false } }),
      prisma.contact.count({ where: { responded: true } }),
      prisma.contact.groupBy({
        by: ['inquiryType'],
        _count: true,
      }),
      prisma.contact.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          inquiryType: true,
          createdAt: true,
        },
      }),
    ]);

    return NextResponse.json({
      totalContacts,
      unreadContacts,
      respondedContacts,
      contactsByType: contactsByType.reduce((acc, item) => {
        acc[item.inquiryType] = item._count;
        return acc;
      }, {} as Record<string, number>),
      recentContacts,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}

