import Image from 'next/image'
import Link from 'next/link'

interface MissionCardProps {
    id: string
    name: string | null
    description: string | null
    image: string | null
    description_short: string | null
    startTime: Date
}

export default function MissionCard({ 
    id, 
    name, 
    description, 
    image, 
    description_short, 
    startTime 
}: MissionCardProps) {
    return (
        <Link href={`/missions/${id}`} className="group">
            <div className="bg-gray-900 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300 shadow-lg">
                <div className="relative h-64">
                    <Image
                        src={image || '/Images/placeholder.png'}
                        alt={name || 'Space Mission'}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {new Date(startTime).getFullYear()}
                    </div>
                </div>
                <div className="p-6">
                    <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-blue-400 transition-colors">
                        {name || 'Unknown Mission'}
                    </h3>
                    <p className="text-gray-300 line-clamp-3">
                        {description_short || description || 'No description available'}
                    </p>
                </div>
            </div>
        </Link>
    )
}
