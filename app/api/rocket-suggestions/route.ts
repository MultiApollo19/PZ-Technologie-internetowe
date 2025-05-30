import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
        return NextResponse.json([]);
    }

    try {
        const rockets = await prisma.rockets.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { operator: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } }
                ]
            },
            select: {
                id: true,
                name: true,
                operator: true,
                description: true
            },
            take: 8
        });

        const suggestions = rockets.map(rocket => {
            let matchReason = '';
            const lowerQuery = query.toLowerCase();

            if (rocket.name?.toLowerCase().includes(lowerQuery)) {
                matchReason = 'Rocket name';
            } else if (rocket.operator?.toLowerCase().includes(lowerQuery)) {
                matchReason = `Operator: ${rocket.operator}`;
            } else if (rocket.description?.toLowerCase().includes(lowerQuery)) {
                matchReason = 'Description';
            }

            return {
                id: rocket.id,
                text: rocket.name || 'Unknown Rocket',
                description: matchReason || `Operated by ${rocket.operator}`
            };
        });

        return NextResponse.json(suggestions);
    } catch (error) {
        console.error('Error fetching rocket suggestions:', error);
        return NextResponse.json([]);
    }
}
