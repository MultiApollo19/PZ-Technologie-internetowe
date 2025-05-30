import Image from 'next/image'
import Link from 'next/link'
import prisma from "@/lib/prisma";

interface HeroStats {
  totalMissions: number
  totalRockets: number
  featuredMission: {
    id: string
    name: string | null
    image: string | null
    description_short: string | null
  } | null
  recentMissions: number
  topOperator: string | null
}

async function getHeroData(): Promise<HeroStats> {
  try {
    const [
      totalMissions, 
      totalRockets, 
      featuredMission, 
      recentMissions,
      topOperator
    ] = await Promise.all([
      // Liczba wszystkich misji
      prisma.missions.count(),
      
      // Liczba wszystkich rakiet
      prisma.rockets.count(),
      
      // Featured mission (Apollo 8 z Earthrise)
      prisma.missions.findFirst({
        where: {
          name: {
            contains: 'Apollo 8',
            mode: 'insensitive'
          }
        },
        select: {
          id: true,
          name: true,
          image: true,
          description_short: true
        }
      }),
      
      // Misje z ostatnich 10 lat (symulacja)
      prisma.missions.count({
        where: {
          startTime: {
            gte: new Date(new Date().getFullYear() - 10, 0, 1)
          }
        }
      }),
      
      // Najczęściej używany operator rakiet
      prisma.rockets.groupBy({
        by: ['operator'],
        _count: {
          operator: true
        },
        orderBy: {
          _count: {
            operator: 'desc'
          }
        },
        take: 1
      }).then(result => result[0]?.operator || null)
    ])

    return {
      totalMissions,
      totalRockets,
      featuredMission,
      recentMissions,
      topOperator
    }
  } catch (error) {
    console.error('Error fetching hero data:', error)
    return {
      totalMissions: 0,
      totalRockets: 0,
      featuredMission: null,
      recentMissions: 0,
      topOperator: null
    }
  }
}

export default async function Hero() {
  const { 
    totalMissions, 
    totalRockets, 
    featuredMission, 
    recentMissions,
    topOperator 
  } = await getHeroData()

  const heroImage = featuredMission?.image || '/images/earthrise-apollo8.jpg'
  const heroAlt = featuredMission?.name || 'Space exploration'

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src={heroImage}
          alt={heroAlt}
          fill
          className="object-cover opacity-70"
          priority
        />
        <div className="absolute inset-0 cosmic-gradient opacity-60"></div>
      </div>
      
      <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
        <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
          Explore Humanity's Greatest Space Missions
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-gray-200">
          {featuredMission?.description_short || 
           "Discover the stories, vehicles, and achievements that shaped our journey beyond Earth"}
        </p>
        
        {/* Rozszerzone statystyki */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-4xl mx-auto">
          <div className="bg-black/30 backdrop-blur-sm rounded-lg px-4 py-3">
            <div className="text-2xl md:text-3xl font-bold text-blue-400">{totalMissions}</div>
            <div className="text-xs md:text-sm text-gray-300">Historic Missions</div>
          </div>
          <div className="bg-black/30 backdrop-blur-sm rounded-lg px-4 py-3">
            <div className="text-2xl md:text-3xl font-bold text-purple-400">{totalRockets}</div>
            <div className="text-xs md:text-sm text-gray-300">Launch Vehicles</div>
          </div>
          <div className="bg-black/30 backdrop-blur-sm rounded-lg px-4 py-3">
            <div className="text-2xl md:text-3xl font-bold text-green-400">{recentMissions}</div>
            <div className="text-xs md:text-sm text-gray-300">Recent Missions</div>
          </div>
          <div className="bg-black/30 backdrop-blur-sm rounded-lg px-4 py-3">
            <div className="text-lg md:text-xl font-bold text-yellow-400">
              {topOperator?.split(' ')[0] || 'NASA'}
            </div>
            <div className="text-xs md:text-sm text-gray-300">Top Operator</div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/missions"
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-semibold transition-colors"
          >
            Explore {totalMissions} Missions
          </Link>
          <Link 
            href="/rockets"
            className="px-8 py-4 border-2 border-white hover:bg-white hover:text-black rounded-lg text-lg font-semibold transition-colors"
          >
            View {totalRockets} Rockets
          </Link>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  )
}
