// src/app/api/events/[id]/route.js
import { prisma } from '@/lib/db';
import { eventSchema } from '@/lib/validation';
import { authorize } from '@/lib/authorize';

const buildSlug = (title) => {
    return (
        title
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '') + `-${Date.now()}`
    );
};

const badRequest = (message, extra = {}) =>
    Response.json({ status: 'error', message, ...extra }, { status: 400 });

const notFound = (message) =>
    Response.json({ status: 'error', message }, { status: 404 });

const internalError = (message = 'Terjadi kesalahan internal') =>
    Response.json({ status: 'error', message }, { status: 500 });

const parseId = (params) => {
    const id = parseInt(params?.id ?? '', 10);
    if (Number.isNaN(id)) return null;
    return id;
};

export async function GET(request, context) {
    const { params: maybeParams } = await context;
    const params = await maybeParams; // // ⚠️ wajib await
    const id = parseId(params);
    if (id === null) return badRequest('ID tidak valid');

    try {
        const event = await prisma.event.findUnique({ where: { id } });
        if (!event) return notFound('Event tidak ditemukan');

        return Response.json({ status: 'success', data: event });
    } catch (err) {
        console.error('GET /api/events/[id] error:', err);
        return internalError('Gagal mengambil event');
    }
}

export async function PUT(request, context) {
    const { params: maybeParams } = context;
    const params = await maybeParams; 
    const authError = await authorize(request);
    if (authError) return authError;

    const id = parseInt(params.id);
    if (isNaN(id))
        return Response.json(
            { status: 'error', message: 'ID tidak valid' },
            { status: 400 }
        );

    try {
        let body = await request.json();

        if (!body.registrationEnabled) {
            body.registrationTitle = '';
            body.registrationDescription = '';
            body.registrationButtonText = '';
            body.registrationLink = null;
            body.registrationDeadline = null;
        }

        const parsed = eventSchema.safeParse(body);
        if (!parsed.success) {
            return Response.json(
                { status: 'error', errors: parsed.error.flatten() },
                { status: 400 }
            );
        }

        const { title, publishStatus, ...rest } = parsed.data;

        const existingEvent = await prisma.event.findUnique({ where: { id } });
        if (!existingEvent) {
            return Response.json(
                { status: 'error', message: 'Event tidak ditemukan' },
                { status: 404 }
            );
        }

        const newPublishedAt =
            publishStatus === 'published' &&
            existingEvent.publishStatus !== 'published'
                ? new Date()
                : publishStatus === 'draft'
                ? null
                : existingEvent.published_at;

        const updatedEvent = await prisma.event.update({
            where: { id },
            data: {
                ...rest,
                title,
                // Slug tidak diubah saat edit untuk menjaga URL tetap stabil
                publishStatus: publishStatus || 'draft',
                published_at: newPublishedAt,
                date: new Date(parsed.data.date),
                registrationDeadline: parsed.data.registrationDeadline
                    ? new Date(parsed.data.registrationDeadline)
                    : null,
            },
        });

        return Response.json({ status: 'success', data: updatedEvent });
    } catch (err) {
        console.error('PUT /api/events/[id] error:', err);
        return Response.json(
            { status: 'error', message: 'Gagal memperbarui event' },
            { status: 500 }
        );
    }
}

export async function DELETE(request, context) {
    const { params: maybeParams } = await context;
    const params = await maybeParams; // // ⚠️ wajib await
    const authError = await authorize(request);
    if (authError) return authError;

    const id = parseId(params);
    if (id === null) return badRequest('ID tidak valid');

    try {
        const existing = await prisma.event.findUnique({ where: { id } });
        if (!existing) return notFound('Event tidak ditemukan');

        await prisma.event.delete({ where: { id } });

        return Response.json({
            status: 'success',
            message: 'Event berhasil dihapus',
        });
    } catch (err) {
        console.error('DELETE /api/events/[id] error:', err);
        return internalError('Gagal menghapus event');
    }
}
