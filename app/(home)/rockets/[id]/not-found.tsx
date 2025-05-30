import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
            <div className="text-center">
                <div className="text-8xl mb-8">🚀</div>
                <h1 className="text-4xl font-bold text-white mb-4">Rocket Not Found</h1>
                <p className="text-xl text-gray-300 mb-8 max-w-md">
                    The rocket you're looking for doesn't exist or has been moved.
                </p>
                <Link 
                    href="/rockets"
                    className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Rockets
                </Link>
            </div>
        </div>
    );
}
