import Image from 'next/image'
import Link from 'next/link'
import prisma from "@/lib/prisma";

interface Mission {
  id: string
  name: string | null
  description: string | null
  image: string | null
  description_short: string | null
  startTime: Date
}

async function getMissions(): Promise<Mission[]> {
  try {
    const missions = await prisma.missions.findMany({
      orderBy: {
        startTime: 'desc'
      },
      take: 6 // Pobierz tylko 6 najnowszych misji do wyświetlenia
    })
    return missions
  } catch (error) {
    console.error('Error fetching missions:', error)
    return []
  }
}

export default async function MissionHighlights() {
  const missions = await getMissions()

  if (missions.length === 0) {
    return (
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-4">No Missions Available</h2>
          <p className="text-xl text-gray-300">Check back later for mission updates.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl font-bold text-center mb-4">
          History That Changed Humanity
        </h2>
        <p className="text-xl text-gray-300 text-center mb-16 max-w-3xl mx-auto">
          From the first artificial satellite to landing on Mars, explore the missions that pushed the boundaries of human achievement
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {missions.map((mission) => (
            <Link 
              key={mission.id}
              href={`/missions/${mission.id}`}
              className="group"
            >
              <div className="bg-gray-900 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300">
                <div className="relative h-64">
                  <Image
                    src={mission.image || '/images/placeholder-mission.jpg'}
                    alt={mission.name || 'Space Mission'}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-400 transition-colors">
                    {mission.name || 'Unknown Mission'}
                  </h3>
                  <p className="text-gray-300">
                    {mission.description_short || mission.description || 'No description available'}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link 
            href="/missions"
            className="inline-flex items-center px-6 py-3 border-2 border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white rounded-lg transition-colors"
          >
            View All Missions
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
