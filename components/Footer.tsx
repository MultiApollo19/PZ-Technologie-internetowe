import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black/80 backdrop-blur-md border-t border-gray-800 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Image
                src="/logo.svg"
                alt="SpaceLab Logo"
                width={42}
                height={42}
                className="mr-3"
              />
              <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                SpaceLab
              </h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Exploring humanity&apos;s greatest achievements in space exploration.
              From the first satellite to modern Mars rovers.
            </p>

          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Explore</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/missions" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">
                  All Missions
                </Link>
              </li>
              <li>
                <Link href="/rockets" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">
                  Launch Vehicles
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">
                  Timeline
                </a>
              </li>
            </ul>
          </div>

          {/* Mission Categories */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Categories</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">
                  Lunar Exploration
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">
                  Mars Missions
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">
                  Earth Orbit
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">
                  Deep Space
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">
                  API Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">
                  Data Sources
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Mission Stats */}
        <div className="border-t border-gray-700 pt-8 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-black/30 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-400">8</div>
              <div className="text-xs text-gray-400">Historic Missions</div>
            </div>
            <div className="bg-black/30 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-400">7</div>
              <div className="text-xs text-gray-400">Launch Vehicles</div>
            </div>
            <div className="bg-black/30 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-400">3</div>
              <div className="text-xs text-gray-400">Active Missions</div>
            </div>
            <div className="bg-black/30 rounded-lg p-4">
              <div className="text-2xl font-bold text-yellow-400">68</div>
              <div className="text-xs text-gray-400">Years of History</div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            © {currentYear} SpaceLab. All rights reserved. Built with Next.js & Tailwind CSS.
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
              Terms of Service
            </a>
            <span className="text-gray-600">•</span>
            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
              Privacy Policy
            </a>
            <span className="text-gray-600">•</span>
            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
