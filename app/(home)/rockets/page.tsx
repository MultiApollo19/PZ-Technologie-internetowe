import prisma from "@/lib/prisma";
import { unstable_cache } from 'next/cache'
import RocketCard from "@/components/RocketCard";
import SmartRocketSearch from "@/components/SmartRocketSearch";

interface RocketsPageProps {
    searchParams: Promise<{
        q?: string;
        sort?: 'name' | 'operator';
        order?: 'asc' | 'desc';
    }>;
}

const getRockets = unstable_cache(
    async (query?: string, sort: string = 'name', order: string = 'asc') => {
        const where = query ? {
            OR: [
                { name: { contains: query, mode: 'insensitive' as const } },
                { operator: { contains: query, mode: 'insensitive' as const } },
                { description: { contains: query, mode: 'insensitive' as const } }
            ]
        } : {};

        let orderBy;

        if (sort === 'name') {
            orderBy = [
                { name: order as 'asc' | 'desc' },
                { operator: 'asc' as const }
            ];
        } else {
            orderBy = { operator: order as 'asc' | 'desc' };
        }

        const rockets = await prisma.rockets.findMany({
            where,
            orderBy
        });

        if (sort === 'name') {
            return rockets.sort((a, b) => {
                const nameA = (a.name || '').toLowerCase();
                const nameB = (b.name || '').toLowerCase();

                if (order === 'asc') {
                    return nameA.localeCompare(nameB);
                } else {
                    return nameB.localeCompare(nameA);
                }
            });
        }

        return rockets;
    },
    ['rockets-search'],
    { revalidate: 10 }
)

export default async function RocketsPage({ searchParams }: RocketsPageProps) {
    const params = await searchParams;
    const query = params.q || '';
    const sort = params.sort || 'name';
    const order = params.order || 'asc';

    const rockets = await getRockets(query, sort, order);

    return (
        <div className="min-h-screen pt-24 pb-20">
            {/* Header */}
            <div className="max-w-7xl mx-auto px-6 text-center mb-16">
                <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                    Launch Vehicles
                </h1>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                    Discover the powerful rockets that carried humanity&apos;s greatest missions beyond Earth
                </p>

                {/* Smart Search */}
                <SmartRocketSearch
                    currentQuery={query}
                    currentSort={sort}
                    currentOrder={order}
                />

                {/* Search Tips */}
                {query && (
                    <div className="mt-4 text-sm text-gray-400 max-w-2xl mx-auto">
                        <p>💡 Search tip: Try searching by rocket name (Saturn V, Atlas V),
                            operator (NASA, ULA, SpaceX), or description</p>
                    </div>
                )}

                {/* Results Count */}
                <div className="inline-block bg-black/30 backdrop-blur-sm rounded-lg px-6 py-3 mt-8">
                    <div className="text-2xl font-bold text-blue-400">{rockets.length}</div>
                    <div className="text-sm text-gray-300">
                        {query ? `Results for "${query}"` : 'Total Rockets'}
                    </div>
                </div>
            </div>

            {/* Rockets Grid */}
            <div className="max-w-7xl mx-auto px-6">
                {rockets.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {rockets.map((rocket) => (
                            <RocketCard key={rocket.id} {...rocket} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🚀</div>
                        <h2 className="text-2xl font-bold text-gray-300 mb-2">
                            {query ? `No rockets found for "${query}"` : 'No Rockets Found'}
                        </h2>
                        <p className="text-gray-400 mb-4">
                            {query ? 'Try a different search term' : 'Check back later for rocket updates'}
                        </p>
                        {query && (
                            <div className="text-sm text-gray-500 max-w-md mx-auto">
                                <p className="mb-2">Try searching for:</p>
                                <div className="flex flex-wrap justify-center gap-2">
                                    <span className="bg-gray-800 px-2 py-1 rounded text-xs">Saturn V</span>
                                    <span className="bg-gray-800 px-2 py-1 rounded text-xs">Atlas</span>
                                    <span className="bg-gray-800 px-2 py-1 rounded text-xs">NASA</span>
                                    <span className="bg-gray-800 px-2 py-1 rounded text-xs">SpaceX</span>
                                    <span className="bg-gray-800 px-2 py-1 rounded text-xs">Delta</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
