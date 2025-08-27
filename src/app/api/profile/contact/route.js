import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { authorize } from '@/lib/authorize';

export const revalidate = 0;

export async function GET() {
    try {
        const contact = await prisma.contact.findFirst({
            include: { socialLinks: { orderBy: { order: 'asc' } } },
        });
        return NextResponse.json({ status: 'success', data: contact });
    } catch (e) {
        console.error(e);
        return NextResponse.json(
            { status: 'error', message: 'Failed to fetch contact' },
            { status: 500 }
        );
    }
}

export async function PUT(request) {
    const authError = await authorize(request, ['ADMIN']);
    if (authError) return authError;

    try {
        const body = await request.json();
        const { address, phone, email, hours, socialLinks } = body;

        // Upsert contact information
        const contact = await prisma.contact.upsert({
            where: { id: 1 },
            update: {
                // 1. Data alamat yang sudah benar
                addressStreet: address.street,
                addressCity: address.city,
                addressProvince: address.province,
                addressPostal: address.postal,

                // 2. Ratakan (flatten) data telepon
                phoneNumber: phone.number,
                phoneWhatsapp: phone.whatsapp,

                // 3. Ratakan (flatten) data email
                emailGeneral: email.general,
                emailSubmission: email.submission,

                // 4. Ratakan (flatten) data jam operasional
                hoursWeekdays: hours.weekdays,
                hoursWeekend: hours.weekend,
                hoursClosed: hours.closed,
            },
            create: {
                id: 1,
                // Lakukan hal yang sama untuk 'create'
                addressStreet: address.street,
                addressCity: address.city,
                addressProvince: address.province,
                addressPostal: address.postal,

                phoneNumber: phone.number,
                phoneWhatsapp: phone.whatsapp,

                emailGeneral: email.general,
                emailSubmission: email.submission,

                hoursWeekdays: hours.weekdays,
                hoursWeekend: hours.weekend,
                hoursClosed: hours.closed,
            },
        });

        // Delete existing social links
        await prisma.socialLink.deleteMany({
            where: { contactId: contact.id },
        });

        // Create new social links
        if (Array.isArray(socialLinks)) {
            for (const [index, social] of socialLinks.entries()) {
                await prisma.socialLink.create({
                    data: {
                        contactId: contact.id,
                        platform: social.platform,
                        url: social.url,
                        icon: social.icon,
                        order: index,
                    },
                });
            }
        }

        // Fetch updated data
        const updated = await prisma.contact.findFirst({
            include: { socialLinks: { orderBy: { order: 'asc' } } },
        });

        return NextResponse.json({ status: 'success', data: updated });
    } catch (e) {
        console.error(e);
        return NextResponse.json(
            { status: 'error', message: 'Failed to update contact' },
            { status: 500 }
        );
    }
}
