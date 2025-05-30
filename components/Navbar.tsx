import Link from "next/link";
import Image from "next/image";

export default function Navigation() {
    return (
        <header className="w-full z-50 fixed top-0 bg-black/80 backdrop-blur-md border-b border-gray-800">
            <nav className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
                <Link href="/" className="flex items-center group">
                    <Image 
                        src="/logo.svg" 
                        alt="SpaceLab Logo" 
                        width={48} 
                        height={48}
                        className="group-hover:scale-110 transition-transform duration-300"
                    />
                    <p className="text-white ml-3 font-bold text-2xl bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                        SpaceLab
                    </p>
                </Link>
                
                <ul className="hidden md:flex text-white text-lg space-x-8">
                    <li>
                        <Link 
                            href="/about" 
                            className="hover:text-blue-400 transition-colors duration-200 relative group"
                        >
                            About
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300"></span>
                        </Link>
                    </li>
                    <li>
                        <Link 
                            href="/missions" 
                            className="hover:text-blue-400 transition-colors duration-200 relative group"
                        >
                            Missions
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300"></span>
                        </Link>
                    </li>
                    <li>
                        <Link 
                            href="/rockets" 
                            className="hover:text-blue-400 transition-colors duration-200 relative group"
                        >
                            Rockets
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300"></span>
                        </Link>
                    </li>
                </ul>

                {/* Mobile menu button */}
                <button className="md:hidden text-white p-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </nav>
        </header>
    );
}
