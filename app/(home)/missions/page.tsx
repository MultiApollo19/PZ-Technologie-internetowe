import prisma from "@/lib/prisma";
import { unstable_cache } from 'next/cache'
import MissionCard from "@/components/MissionCard";
import SmartSearch from "@/components/SmartSearch";

interface MissionsPageProps {
    searchParams: Promise<{
        q?: string;
        sort?: 'name' | 'startTime';
        order?: 'asc' | 'desc';
    }>;
}

const getMissions = unstable_cache(
    async (query?: string, sort: string = 'startTime', order: string = 'desc') => {
        const where = query ? {
            OR: [
                { name: { contains: query, mode: 'insensitive' as const } },
                { description: { contains: query, mode: 'insensitive' as const } },
                { description_short: { contains: query, mode: 'insensitive' as const } },
                // Nowe kolumny do wyszukiwania
                { agency: { contains: query, mode: 'insensitive' as const } },
                { status: { contains: query, mode: 'insensitive' as const } },
                { category: { contains: query, mode: 'insensitive' as const } },
                { destitation: { contains: query, mode: 'insensitive' as const } }
            ]
        } : {};

        let orderBy;

        if (sort === 'name') {
            orderBy = [
                { name: order as 'asc' | 'desc' },
                { startTime: 'desc' as const }
            ];
        } else {
            orderBy = { startTime: order as 'asc' | 'desc' };
        }

        const missions = await prisma.missions.findMany({
            where,
            orderBy
        });

        if (sort === 'name') {
            return missions.sort((a, b) => {
                const nameA = (a.name || '').toLowerCase();
                const nameB = (b.name || '').toLowerCase();

                if (order === 'asc') {
                    return nameA.localeCompare(nameB);
                } else {
                    return nameB.localeCompare(nameA);
                }
            });
        }

        return missions;
    },
    ['missions-search'],
    { revalidate: 10 }
)

// Rozszerzona funkcja do pobierania sugestii
export default async function MissionsPage({ searchParams }: MissionsPageProps) {
    const params = await searchParams;
    const query = params.q || '';
    const sort = params.sort || 'startTime';
    const order = params.order || 'desc';

    const missions = await getMissions(query, sort, order);

    return (
        <div className="min-h-screen pt-24 pb-20">
            {/* Header */}
            <div className="max-w-7xl mx-auto px-6 text-center mb-16">
                <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                    Space Missions
                </h1>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                    Explore humanity&apos;s greatest achievements in space exploration
                </p>

                {/* Smart Search */}
                <SmartSearch
                    currentQuery={query}
                    currentSort={sort}
                    currentOrder={order}
                />

                {/* Search Tips */}
                {query && (
                    <div className="mt-4 text-sm text-gray-400 max-w-2xl mx-auto">
                        <p>💡 Search tip: Try searching by mission name, agency (NASA, CNSA), status (ACTIVE, COMPLETED),
                            category (LUNAR_EXPLORATION, MARS_EXPLORATION), or destination (Moon, Mars)</p>
                    </div>
                )}

                {/* Results Count */}
                <div className="inline-block bg-black/30 backdrop-blur-sm rounded-lg px-6 py-3 mt-8">
                    <div className="text-2xl font-bold text-blue-400">{missions.length}</div>
                    <div className="text-sm text-gray-300">
                        {query ? `Results for "${query}"` : 'Total Missions'}
                    </div>
                </div>
            </div>

            {/* Missions Grid */}
            <div className="max-w-7xl mx-auto px-6">
                {missions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {missions.map((mission) => (
                            <MissionCard key={mission.id} {...mission} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🔍</div>
                        <h2 className="text-2xl font-bold text-gray-300 mb-2">
                            {query ? `No missions found for "${query}"` : 'No Missions Found'}
                        </h2>
                        <p className="text-gray-400 mb-4">
                            {query ? 'Try a different search term' : 'Check back later for mission updates'}
                        </p>
                        {query && (
                            <div className="text-sm text-gray-500 max-w-md mx-auto">
                                <p className="mb-2">Try searching for:</p>
                                <div className="flex flex-wrap justify-center gap-2">
                                    <span className="bg-gray-800 px-2 py-1 rounded text-xs">NASA</span>
                                    <span className="bg-gray-800 px-2 py-1 rounded text-xs">Apollo</span>
                                    <span className="bg-gray-800 px-2 py-1 rounded text-xs">Mars</span>
                                    <span className="bg-gray-800 px-2 py-1 rounded text-xs">ACTIVE</span>
                                    <span className="bg-gray-800 px-2 py-1 rounded text-xs">Moon</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
