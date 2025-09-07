import { prisma } from '@/lib/db';
import { eventSchema } from '@/lib/validation';
import { authorize } from '@/lib/authorize';
import { serializeBigInt } from '@/lib/serialize';

function getDateRange(filter) {
    const now = new Date();
    switch (filter) {
        case 'today':
            return new Date(now.getFullYear(), now.getMonth(), now.getDate());
        case 'week':
            now.setDate(now.getDate() - 7);
            return now;
        case 'month':
            now.setMonth(now.getMonth() - 1);
            return now;
        default:
            return new Date(0);
    }
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category");
    const status = searchParams.get("status"); // Ini untuk 'Upcoming', 'Ongoing', dll.
    const dateFilter = searchParams.get("date_filter") || "all";

    // --- TAMBAHKAN BARIS INI ---
    // Ambil parameter 'publishStatus' dari URL.
    const publishStatus = searchParams.get("publishStatus");

    const skip = (page - 1) * limit;

    // --- PERBAIKI LOGIKA 'where' ---
    const where = {
        AND: [
            {
                OR: [{ title: { contains: search } }, { excerpt: { contains: search } }, { organizer: { contains: search } }],
            },
            category ? { category } : {},
            status ? { status } : {},
            dateFilter !== "all" ? { date: { gte: getDateRange(dateFilter) } } : {},
            
            // --- TAMBAHKAN KONDISI INI ---
            // Jika parameter 'publishStatus' ada, tambahkan sebagai filter.
            // Ini akan memastikan hanya item 'published' yang diambil saat diminta
            // oleh halaman publik /berita-event.
            publishStatus ? { publishStatus } : {},
        ],
    };

    const [items, totalItems] = await Promise.all([
        prisma.event.findMany({
            where,
            skip,
            take: limit,
            orderBy: { date: "desc" },
        }),
        prisma.event.count({ where }),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return Response.json(
        serializeBigInt({
            status: "success",
            data: {
                items,
                pagination: {
                    current_page: page,
                    total_pages: totalPages,
                    total_items: totalItems,
                    items_per_page: limit,
                },
            },
        })
    );
}

// ============ POST =========
export async function POST(request) {
    // Only ADMIN or EDITOR may create events; VIEWER will receive 403
    const authError = await authorize(request);
    if (authError) return authError;

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

        const slug =
            title
                .toLowerCase()
                .replace(/ /g, '-')
                .replace(/[^\w-]+/g, '') + `-${Date.now()}`;

        const event = await prisma.event.create({
            data: {
                ...rest,
                title,
                slug,
                publishStatus: publishStatus || 'draft',
                published_at: publishStatus === 'published' ? new Date() : null,
                date: new Date(parsed.data.date),
                registrationDeadline: parsed.data.registrationDeadline
                    ? new Date(parsed.data.registrationDeadline)
                    : null,
            },
        });

        return Response.json(
            serializeBigInt({ status: 'success', data: event }),
            { status: 201 }
        );
    } catch (err) {
        console.error('EVENT POST ERROR:', err);
        return Response.json(
            { status: 'error', message: 'Terjadi kesalahan pada server.' },
            { status: 500 }
        );
    }
}
