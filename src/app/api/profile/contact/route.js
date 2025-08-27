import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  const contact = await prisma.contact.findFirst({
    include: { socialLinks: { orderBy: { order: 'asc' } } },
  });

  if (!contact) {
    return NextResponse.json({
      status: 'success',
      data: {
        address: {},
        phone: {},
        email: {},
        hours: {},
        social: [],
      },
    });
  }

  const formatted = {
    address: {
      street: contact.addressStreet,
      city: contact.addressCity,
      province: contact.addressProvince,
      postal: contact.addressPostal,
      icon: contact.addressIcon || null,
    },
    phone: {
      number: contact.phoneNumber,
      whatsapp: contact.phoneWhatsapp || '',
      icon: contact.phoneIcon || null,
    },
    email: {
      general: contact.emailGeneral,
      submission: contact.emailSubmission || '',
      icon: contact.emailIcon || null,
    },
    hours: {
      weekdays: contact.hoursWeekdays || '',
      weekend: contact.hoursWeekend || '',
      closed: contact.hoursClosed || '',
      icon: contact.hoursIcon || null,
    },
    social: contact.socialLinks.map((s) => ({
      platform: s.platform,
      url: s.url,
      icon: s.icon || null,
    })),
  };

  return NextResponse.json({ status: 'success', data: formatted });
}
