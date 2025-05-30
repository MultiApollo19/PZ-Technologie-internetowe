import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
        return NextResponse.json([]);
    }

    try {
        const missions = await prisma.missions.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { description_short: { contains: query, mode: 'insensitive' } },
                    { agency: { contains: query, mode: 'insensitive' } },
                    { status: { contains: query, mode: 'insensitive' } },
                    { category: { contains: query, mode: 'insensitive' } },
                    { destitation: { contains: query, mode: 'insensitive' } }
                ]
            },
            select: {
                id: true,
                name: true,
                description_short: true,
                agency: true,
                status: true,
                category: true,
                destitation: true
            },
            take: 8
        });

        const suggestions = missions.map(mission => {
            // Określ dlaczego ta misja pasuje do wyszukiwania
            let matchReason = '';
            const lowerQuery = query.toLowerCase();

            if (mission.name?.toLowerCase().includes(lowerQuery)) {
                matchReason = 'Mission name';
            } else if (mission.agency?.toLowerCase().includes(lowerQuery)) {
                matchReason = `Agency: ${mission.agency}`;
            } else if (mission.status?.toLowerCase().includes(lowerQuery)) {
                matchReason = `Status: ${mission.status}`;
            } else if (mission.category?.toLowerCase().includes(lowerQuery)) {
                matchReason = `Category: ${mission.category.replace(/_/g, ' ')}`;
            } else if (mission.destitation?.toLowerCase().includes(lowerQuery)) {
                matchReason = `Destination: ${mission.destitation}`;
            } else if (mission.description_short?.toLowerCase().includes(lowerQuery)) {
                matchReason = 'Description';
            }

            return {
                id: mission.id,
                text: mission.name || 'Unknown Mission',
                description: matchReason || mission.description_short
            };
        });

        return NextResponse.json(suggestions);
    } catch (error) {
        console.error('Error fetching suggestions:', error);
        return NextResponse.json([]);
    }
}
