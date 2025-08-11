import { prisma } from '@/lib/db';
import { authorize } from '@/lib/authorize';

export async function GET() {
    try {
        const data = await prisma.setting.findUnique({ where: { id: 1 } });
        return Response.json(data || {});
    } catch (err) {
        return Response.json(
            { status: 'error', message: 'Failed to load settings' },
            { status: 500 }
        );
    }
}

export async function PUT(request) {
    const authError = await authorize(request);
    if (authError) return authError;

    try {
        const body = await request.json();
        const data = await prisma.setting.upsert({
            where: { id: 1 },
            update: body,
            create: { id: 1, ...body },
        });
        return Response.json({ status: 'success', data });
    } catch (err) {
        return Response.json(
            { status: 'error', message: 'Failed to update settings' },
            { status: 500 }
        );
    }
}
