import Link from 'next/link';
import prisma from "@/lib/prisma";
import ImageSlideshow from '@/components/ImageSlideshow';

// Funkcja do pobierania statystyk z bazy
async function getStats() {
  try {
    const [totalMissions, totalRockets, activeMissions] = await Promise.all([
      prisma.missions.count(),
      prisma.rockets.count(),
      prisma.missions.count({
        where: {
          OR: [
            { status: 'ACTIVE' },
            { endTime: null }
          ]
        }
      })
    ]);

    return { totalMissions, totalRockets, activeMissions };
  } catch (error) {
    console.error('Error fetching stats:', error);
    return { totalMissions: 0, totalRockets: 0, activeMissions: 0 };
  }
}

// Funkcja do pobierania zdjęć misji dla slideshow
async function getFeaturedMissions() {
  try {
    const missions = await prisma.missions.findMany({
      where: {
        image: {
          not: null
        },
        name: {
          in: ['Apollo 8', 'Apollo 11', 'Mars Science Laboratory Curiosity', 'Mars Pathfinder']
        }
      },
      select: {
        id: true,
        name: true,
        image: true,
        description_short: true
      },
      take: 4
    });

    // Jeśli nie ma wystarczająco misji, pobierz dodatkowe z obrazami
    if (missions.length < 4) {
      const additionalMissions = await prisma.missions.findMany({
        where: {
          image: {
            not: null
          },
          NOT: {
            name: {
              in: missions.map(m => m.name).filter(Boolean) as string[]
            }
          }
        },
        select: {
          id: true,
          name: true,
          image: true,
          description_short: true
        },
        take: 4 - missions.length
      });

      missions.push(...additionalMissions);
    }

    return missions;
  } catch (error) {
    console.error('Error fetching featured missions:', error);
    return [];
  }
}

export default async function AboutPage() {
  const [stats, featuredMissions] = await Promise.all([
    getStats(),
    getFeaturedMissions()
  ]);

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 text-center mb-20">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
          About SpaceLab
        </h1>
        <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
          Since 1957, humanity has been pushing the boundaries of what&apos;s possible in space exploration.
          SpaceLab aims to present the most important space missions in an accessible and engaging way,
          sharing knowledge about technology, bravery, and scientific breakthroughs that shaped our journey beyond Earth.
        </p>
      </div>


      {/* Mission Statement */}
      <div className="max-w-6xl mx-auto px-6 mb-20">
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-8 text-white text-center">Our Mission</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-gray-300 leading-relaxed text-lg">
                We believe that space exploration represents humanity&apos;s greatest achievements and most ambitious dreams.
                From the first artificial satellite to landing rovers on Mars, these missions showcase human ingenuity,
                courage, and our relentless pursuit of knowledge.
              </p>
              <p className="text-gray-300 leading-relaxed text-lg">
                Our platform brings together comprehensive information about historic space missions and the incredible
                rockets that made them possible, creating an educational resource for space enthusiasts, students,
                and anyone curious about our cosmic journey.
              </p>
            </div>

            {/* SLIDESHOW W MIEJSCU ZAZNACZONYM NA CZERWONO */}
            <ImageSlideshow missions={featuredMissions} />
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="max-w-7xl mx-auto px-6 mb-20">
        <h2 className="text-3xl font-bold text-white text-center mb-12">By the Numbers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-8 text-center border border-blue-500/20">
            <div className="text-4xl font-bold text-blue-400 mb-2">{stats.totalMissions}</div>
            <div className="text-gray-300 font-medium">Historic Missions</div>
            <div className="text-sm text-gray-500 mt-2">From Sputnik to modern Mars rovers</div>
          </div>

          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-8 text-center border border-purple-500/20">
            <div className="text-4xl font-bold text-purple-400 mb-2">{stats.totalRockets}</div>
            <div className="text-gray-300 font-medium">Launch Vehicles</div>
            <div className="text-sm text-gray-500 mt-2">Rockets that made it all possible</div>
          </div>

          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-8 text-center border border-green-500/20">
            <div className="text-4xl font-bold text-green-400 mb-2">{stats.activeMissions}</div>
            <div className="text-gray-300 font-medium">Active Missions</div>
            <div className="text-sm text-gray-500 mt-2">Currently exploring space</div>
          </div>
        </div>
      </div>

      {/* What You'll Find */}
      <div className="max-w-6xl mx-auto px-6 mb-20">
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-12 text-white text-center">What You&apos;ll Discover</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Historic Space Missions</h3>
                  <p className="text-gray-300">Detailed information about humanity&apos;s greatest space achievements, from Apollo moon landings to Mars exploration.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Rocket Technology</h3>
                  <p className="text-gray-300">Technical specifications, payload capacities, and performance data for the rockets that launched these missions.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Live Mission Tracking</h3>
                  <p className="text-gray-300">Real-time mission duration counters and status updates for ongoing space exploration missions.</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">High-Quality Images</h3>
                  <p className="text-gray-300">Stunning photography from space missions, including iconic images that changed our perspective of Earth and space.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Smart Search</h3>
                  <p className="text-gray-300">Advanced search capabilities to find missions by name, agency, destination, status, or mission category.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Educational Resources</h3>
                  <p className="text-gray-300">Comprehensive technical data, mission timelines, and educational content suitable for all knowledge levels.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Sources */}
      <div className="max-w-6xl mx-auto px-6 mb-20">
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-8 text-white text-center">Our Data Sources</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-blue-400 mb-4">Official Space Agencies</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green-400 mr-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  NASA (National Aeronautics and Space Administration)
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green-400 mr-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  ESA (European Space Agency)
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green-400 mr-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>

                  CNSA (China National Space Administration)
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green-400 mr-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  Historical Soviet Space Program archives
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-purple-400 mb-4">Technical Resources</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green-400 mr-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  Peer-reviewed scientific publications
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green-400 mr-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  Official mission documentation
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green-400 mr-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  Rocket manufacturer specifications
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green-400 mr-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  Historical space program records
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Why Space Exploration Matters */}
      <div className="max-w-6xl mx-auto px-6 mb-20">
        <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-blue-500/20">
          <h2 className="text-3xl font-bold mb-8 text-white text-center">Why Space Exploration Matters</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Scientific Discovery</h3>
              <p className="text-gray-300">Space missions expand our understanding of the universe, from planetary geology to the search for extraterrestrial life.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Technological Innovation</h3>
              <p className="text-gray-300">Space technology drives innovation that benefits life on Earth, from GPS and satellites to medical devices and materials.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 12v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Human Inspiration</h3>
              <p className="text-gray-300">Space exploration inspires future generations to pursue science, technology, engineering, and mathematics careers.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Technology Stack */}
      <div className="max-w-6xl mx-auto px-6 mb-20">
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-8 text-white text-center">Built with Modern Technology</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="bg-black/30 rounded-lg p-6">
              <div className="text-2xl font-bold text-blue-400 mb-2">Next.js 15</div>
              <div className="text-sm text-gray-400">React Framework</div>
            </div>

            <div className="bg-black/30 rounded-lg p-6">
              <div className="text-2xl font-bold text-purple-400 mb-2">Tailwind CSS</div>
              <div className="text-sm text-gray-400">Styling</div>
            </div>

            <div className="bg-black/30 rounded-lg p-6">
              <div className="text-2xl font-bold text-green-400 mb-2">PostgreSQL</div>
              <div className="text-sm text-gray-400">Database</div>
            </div>

            <div className="bg-black/30 rounded-lg p-6">
              <div className="text-2xl font-bold text-orange-400 mb-2">Prisma</div>
              <div className="text-sm text-gray-400">ORM</div>
            </div>
          </div>

          <p className="text-center text-gray-400 mt-8">
            Open source and built with performance, accessibility, and user experience in mind.
          </p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-white mb-4">Start Exploring</h2>
          <p className="text-blue-100 text-lg mb-8">
            Ready to discover humanity&apos;s greatest space achievements? Explore our collection of historic missions and cutting-edge rockets.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/missions"
              className="px-8 py-4 bg-white text-blue-600 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Explore Missions
            </Link>
            <Link
              href="/rockets"
              className="px-8 py-4 border-2 border-white text-white rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              View Rockets
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
