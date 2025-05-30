import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from 'next';

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const rocket = await prisma.rockets.findUnique({
        where: { id },
        select: { name: true, description: true }
    });

    if (!rocket) {
        return { title: 'Rocket Not Found' };
    }

    return {
        title: `${rocket.name} | Launch Vehicles`,
        description: rocket.description || `Learn about the ${rocket.name} rocket`
    };
}

export default async function RocketPage({ params }: Props) {
    const { id } = await params;

    const rocket = await prisma.rockets.findUnique({
        where: { id }
    });

    if (!rocket) {
        notFound();
    }

    // Helper functions
    const formatPayload = (value: number) => {
        if (value === 0) return 'N/A';
        if (value >= 1000) {
            return `${(value / 1000).toFixed(1)} tons`;
        }
        return `${value.toLocaleString()} kg`;
    };

    const formatDecimal = (value: any) => {
        if (value === null || value === undefined) return null;
        return typeof value === 'object' && value.toString ? value.toString() : String(value);
    };

    const getStatusColor = (status: string | null) => {
        switch (status?.toUpperCase()) {
            case 'ACTIVE': return 'text-green-400';
            case 'RETIRED': return 'text-blue-400';
            case 'DEVELOPMENT': return 'text-yellow-400';
            case 'CANCELLED': return 'text-red-400';
            default: return 'text-gray-400';
        }
    };

    const getStatusBadgeColor = (status: string | null) => {
        switch (status?.toUpperCase()) {
            case 'ACTIVE': return 'bg-green-600';
            case 'RETIRED': return 'bg-blue-600';
            case 'DEVELOPMENT': return 'bg-yellow-600';
            case 'CANCELLED': return 'bg-red-600';
            default: return 'bg-gray-600';
        }
    };

    const formatStatus = (status: string | null) => {
        if (!status) return 'Unknown';
        return status.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
    };

    return (
        <div className="min-h-screen pt-16 sm:pt-20 md:pt-24 pb-12 sm:pb-16 md:pb-20">
            {/* Back Navigation */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8">
                <Link
                    href="/rockets"
                    className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors text-sm sm:text-base"
                >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Rockets
                </Link>
            </div>

            {/* Header z tytułem */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12">
                <div className="text-center">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                        {rocket.name}
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                        Operated by {rocket.operator}
                    </p>

                    {/* Rocket Badges */}
                    <div className="flex flex-wrap justify-center gap-4 mb-8">
                        {rocket.firstFlight && (
                            <div className="bg-blue-600 text-white px-4 py-2 rounded-full text-lg font-semibold">
                                First Flight: {new Date(rocket.firstFlight).getFullYear()}
                            </div>
                        )}

                        {rocket.status && (
                            <div className={`${getStatusBadgeColor(rocket.status)} text-white px-4 py-2 rounded-full text-lg font-semibold`}>
                                {formatStatus(rocket.status)}
                            </div>
                        )}

                        <div className="bg-purple-600 text-white px-4 py-2 rounded-full text-lg font-semibold">
                            {rocket.operator}
                        </div>

                        {rocket.stages && (
                            <div className="bg-orange-600 text-white px-4 py-2 rounded-full text-lg font-semibold">
                                {rocket.stages} Stage{rocket.stages > 1 ? 's' : ''}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* SEKCJA Z OBRAZEM I OPISEM - LAYOUT DWUKOLUMNOWY */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-start">

                    {/* LEWA STRONA - RAKIETA */}
                    <div className="order-2 lg:order-1">
                        {rocket.image && (
                            <div className="sticky top-24">
                                <div className="relative w-full max-w-md mx-auto lg:max-w-full">
                                    <Image
                                        src={rocket.image}
                                        alt={rocket.name}
                                        width={600}
                                        height={900}
                                        className="w-full h-auto rounded-2xl shadow-2xl"
                                        priority
                                        sizes="(max-width: 1024px) 400px, 600px"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* PRAWA STRONA - OPIS */}
                    <div className="order-1 lg:order-2">
                        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8">
                            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-white">About This Rocket</h2>

                            {rocket.description ? (
                                <div className="prose prose-invert prose-lg max-w-none">
                                    <p className="text-gray-300 leading-relaxed text-base sm:text-lg">
                                        {rocket.description}
                                    </p>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="text-4xl mb-4">🚀</div>
                                    <h3 className="text-xl font-bold text-gray-300 mb-2">No Details Available</h3>
                                    <p className="text-gray-400">Detailed information about this rocket is not yet available.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* RESZTA ELEMENTÓW - PIERWOTNY LAYOUT */}
            <div className="max-w-5xl mx-auto px-6">
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 md:p-12">
                    <h2 className="text-3xl font-bold mb-8 text-white">Rocket Specifications</h2>

                    {/* Payload Capacity */}
                    <div className="mb-12">
                        <h3 className="text-2xl font-bold text-white mb-6">Payload Capacity</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-black/30 rounded-xl p-6 text-center border border-blue-500/20 hover:border-blue-500/40 transition-colors">
                                <div className="text-3xl font-bold text-blue-400 mb-2">
                                    {formatPayload(rocket.massToOrbit[0])}
                                </div>
                                <div className="text-sm text-gray-300 font-medium">Low Earth Orbit</div>
                                <div className="text-xs text-gray-500 mt-1">LEO</div>
                            </div>

                            <div className="bg-black/30 rounded-xl p-6 text-center border border-purple-500/20 hover:border-purple-500/40 transition-colors">
                                <div className="text-3xl font-bold text-purple-400 mb-2">
                                    {formatPayload(rocket.massToOrbit[1])}
                                </div>
                                <div className="text-sm text-gray-300 font-medium">Geostationary Transfer</div>
                                <div className="text-xs text-gray-500 mt-1">GTO</div>
                            </div>

                            <div className="bg-black/30 rounded-xl p-6 text-center border border-green-500/20 hover:border-green-500/40 transition-colors">
                                <div className="text-3xl font-bold text-green-400 mb-2">
                                    {formatPayload(rocket.massToOrbit[2])}
                                </div>
                                <div className="text-sm text-gray-300 font-medium">Trans-Lunar Injection</div>
                                <div className="text-xs text-gray-500 mt-1">TLI</div>
                            </div>
                        </div>
                    </div>

                    {/* Comprehensive Rocket Overview */}
                    <div className="p-8 bg-black/20 rounded-xl border border-gray-700">
                        <h3 className="text-2xl font-bold text-white mb-8 flex items-center">
                            <svg className="w-6 h-6 mr-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Technical Overview
                        </h3>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Basic Information */}
                            <div className="space-y-6">
                                <h4 className="text-lg font-semibold text-blue-400 border-b border-blue-400/30 pb-3">
                                    Basic Information
                                </h4>

                                <div className="space-y-4">
                                    <div className="bg-gray-800/50 rounded-lg p-4">
                                        <div className="text-sm text-gray-400 mb-1">Rocket Name</div>
                                        <div className="text-white font-medium">{rocket.name}</div>
                                    </div>

                                    <div className="bg-gray-800/50 rounded-lg p-4">
                                        <div className="text-sm text-gray-400 mb-1">Operator</div>
                                        <div className="text-white font-medium">{rocket.operator}</div>
                                    </div>

                                    {rocket.status && (
                                        <div className="bg-gray-800/50 rounded-lg p-4">
                                            <div className="text-sm text-gray-400 mb-1">Status</div>
                                            <div className={`font-semibold ${getStatusColor(rocket.status)}`}>
                                                {formatStatus(rocket.status)}
                                            </div>
                                        </div>
                                    )}

                                    {rocket.launchSite && (
                                        <div className="bg-gray-800/50 rounded-lg p-4">
                                            <div className="text-sm text-gray-400 mb-1">Launch Site</div>
                                            <div className="text-white font-medium">{rocket.launchSite}</div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Physical Specifications */}
                            <div className="space-y-6">
                                <h4 className="text-lg font-semibold text-purple-400 border-b border-purple-400/30 pb-3">
                                    Physical Specifications
                                </h4>

                                <div className="space-y-4">
                                    {rocket.height && (
                                        <div className="bg-gray-800/50 rounded-lg p-4">
                                            <div className="text-sm text-gray-400 mb-1">Height</div>
                                            <div className="text-white font-medium">{formatDecimal(rocket.height)} meters</div>
                                        </div>
                                    )}

                                    {rocket.diameter && (
                                        <div className="bg-gray-800/50 rounded-lg p-4">
                                            <div className="text-sm text-gray-400 mb-1">Diameter</div>
                                            <div className="text-white font-medium">{formatDecimal(rocket.diameter)} meters</div>
                                        </div>
                                    )}

                                    {rocket.stages && (
                                        <div className="bg-gray-800/50 rounded-lg p-4">
                                            <div className="text-sm text-gray-400 mb-1">Stages</div>
                                            <div className="text-white font-medium">{rocket.stages}</div>
                                        </div>
                                    )}

                                    {rocket.firstFlight && (
                                        <div className="bg-gray-800/50 rounded-lg p-4">
                                            <div className="text-sm text-gray-400 mb-1">First Flight</div>
                                            <div className="text-white font-medium">
                                                {new Date(rocket.firstFlight).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Performance Data */}
                            <div className="space-y-6">
                                <h4 className="text-lg font-semibold text-green-400 border-b border-green-400/30 pb-3">
                                    Performance Data
                                </h4>

                                <div className="space-y-4">
                                    {rocket.totalLaunches && (
                                        <div className="bg-gray-800/50 rounded-lg p-4">
                                            <div className="text-sm text-gray-400 mb-1">Total Launches</div>
                                            <div className="text-white font-medium">{rocket.totalLaunches}</div>
                                        </div>
                                    )}

                                    {rocket.successRate && (
                                        <div className="bg-gray-800/50 rounded-lg p-4">
                                            <div className="text-sm text-gray-400 mb-1">Success Rate</div>
                                            <div className="text-green-400 font-semibold text-lg">{formatDecimal(rocket.successRate)}%</div>
                                        </div>
                                    )}

                                    <div className="bg-gray-800/50 rounded-lg p-4">
                                        <div className="text-sm text-gray-400 mb-1">Max Payload (LEO)</div>
                                        <div className="text-white font-medium">{formatPayload(rocket.massToOrbit[0])}</div>
                                    </div>

                                    <div className="bg-gray-800/50 rounded-lg p-4">
                                        <div className="text-sm text-gray-400 mb-1">Reliability Rating</div>
                                        <div className="text-white font-medium">
                                            {rocket.successRate && parseFloat(formatDecimal(rocket.successRate) || '0') > 95 ? '⭐⭐⭐⭐⭐ Excellent' :
                                                rocket.successRate && parseFloat(formatDecimal(rocket.successRate) || '0') > 90 ? '⭐⭐⭐⭐ Very Good' :
                                                    rocket.successRate && parseFloat(formatDecimal(rocket.successRate) || '0') > 80 ? '⭐⭐⭐ Good' : '⭐⭐ Moderate'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Rockets CTA */}
            <div className="max-w-4xl mx-auto px-6 mt-16 text-center">
                <Link
                    href="/rockets"
                    className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-lg font-semibold transition-colors shadow-lg hover:shadow-xl"
                >
                    Explore More Rockets
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </Link>
            </div>
        </div>
    );
}
