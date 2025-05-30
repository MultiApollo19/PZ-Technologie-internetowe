import Image from "next/image";
import Link from "next/link";

interface Props {
  id: string;
  name: string | null;
  operator: string | null;
  image: string | null;
  massToOrbit: number[];
  description?: string | null;
}

export default function RocketCard({ id, name, operator, image, massToOrbit, description }: Props) {
  if (!id) {
    return (
      <div className="bg-gray-900 rounded-xl p-6 text-center">
        <div className="text-red-400">Rocket not found</div>
      </div>
    );
  }

  const formatPayload = (value: number) => {
    if (value === 0) return null;
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}t`;
    }
    return `${value.toLocaleString()}kg`;
  };

  return (
    <Link href={`/rockets/${id}`} className="group">
      <div className="bg-gray-900 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-500 shadow-lg h-full">
        {/* Rocket Image */}
        <div className="relative h-72 md:h-80 overflow-hidden">
          <Image 
            src={image || '/images/placeholder-rocket.jpg'} 
            alt={name || "Rocket"} 
            fill
            className="object-cover group-hover:scale-125 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
          
          {/* Operator Badge */}
          {operator && (
            <div className="absolute top-4 right-4 bg-blue-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold">
              {operator}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Rocket Name */}
          <h3 className="text-xl font-bold mb-2 text-white group-hover:text-blue-400 transition-colors">
            {name || 'Unknown Rocket'}
          </h3>

          {/* Operator */}
          {operator && (
            <p className="text-gray-400 text-sm mb-4">
              Operated by {operator}
            </p>
          )}

          {/* Payload Capacity */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-300 mb-2">Payload Capacity</h4>
            <div className="space-y-1">
              {massToOrbit[0] !== 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">LEO:</span>
                  <span className="text-blue-400 font-semibold">{formatPayload(massToOrbit[0])}</span>
                </div>
              )}
              {massToOrbit[1] !== 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">GTO:</span>
                  <span className="text-purple-400 font-semibold">{formatPayload(massToOrbit[1])}</span>
                </div>
              )}
              {massToOrbit[2] !== 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">TLI:</span>
                  <span className="text-green-400 font-semibold">{formatPayload(massToOrbit[2])}</span>
                </div>
              )}
              
              {massToOrbit.every(mass => mass === 0) && (
                <div className="text-gray-500 text-sm italic">
                  No payload data available
                </div>
              )}
            </div>
          </div>

          {/* Description Preview */}
          {description && (
            <p className="text-gray-400 text-sm line-clamp-2">
              {description}
            </p>
          )}

          {/* View Details Link */}
          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="flex items-center text-blue-400 text-sm font-semibold group-hover:text-blue-300 transition-colors">
              View Details
              <svg className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
