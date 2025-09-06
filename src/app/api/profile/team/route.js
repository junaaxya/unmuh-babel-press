import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { authorize } from '@/lib/authorize';

export const revalidate = 0;

export async function GET() {
    try {
        const team = await prisma.teamMember.findMany({
            orderBy: { order: 'asc' },
        });
        const normalized = team.map((member) => ({
            id: member.id,
            name: member.name,
            position: member.position,
            image: member.image || '',
            description: member.description || member.position || '',
            order: member.order,
        }));
        return NextResponse.json({ status: 'success', data: normalized });
    } catch (e) {
        console.error(e);
        return NextResponse.json(
            { status: 'error', message: 'Failed to fetch team' },
            { status: 500 }
        );
    }
}

export async function PUT(request) {
    const authError = await authorize(request, ['ADMIN']);
    if (authError) return authError;

    try {
        const teamMembers = await request.json();

        // Delete all existing team members
        await prisma.teamMember.deleteMany();

        // Create new team members
        if (Array.isArray(teamMembers)) {
            for (const [index, member] of teamMembers.entries()) {
                await prisma.teamMember.create({
                    data: {
                        name: member.name || '',
                        position: member.description || member.position || '',
                        description: member.description || member.position || '',
                        image: member.image || null,
                        order: index,
                    },
                });
            }
        }

        // Fetch updated data
        const updated = await prisma.teamMember.findMany({
            orderBy: { order: 'asc' },
        });
        const normalized = updated.map((member) => ({
            id: member.id,
            name: member.name,
            position: member.position,
            image: member.image || '',
            description: member.description || member.position || '',
            order: member.order,
        }));

        return NextResponse.json({ status: 'success', data: normalized });
    } catch (e) {
        console.error(e);
        return NextResponse.json(
            { status: 'error', message: 'Failed to update team' },
            { status: 500 }
        );
    }
}
