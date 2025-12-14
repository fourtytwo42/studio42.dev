import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const search = searchParams.get('search') || '';
    const inquiryType = searchParams.get('inquiryType') || '';
    const read = searchParams.get('read') || '';
    const responded = searchParams.get('responded') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
        { message: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (inquiryType) {
      where.inquiryType = inquiryType;
    }

    if (read === 'true') {
      where.read = true;
    } else if (read === 'false') {
      where.read = false;
    }

    if (responded === 'true') {
      where.responded = true;
    } else if (responded === 'false') {
      where.responded = false;
    }

    // Get total count for pagination
    const total = await prisma.contact.count({ where });

    // Get contacts
    const contacts = await prisma.contact.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
      select: {
        id: true,
        name: true,
        email: true,
        company: true,
        phone: true,
        product: true,
        inquiryType: true,
        message: true,
        preferredMethod: true,
        source: true,
        read: true,
        responded: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      contacts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}

