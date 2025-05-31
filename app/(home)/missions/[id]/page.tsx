import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from 'next';
import LiveMissionTimer from "@/components/LiveMissionTimer";

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const mission = await prisma.missions.findUnique({
        where: { id },
        select: { name: true, description_short: true }
    });

    if (!mission) {
        return { title: 'Mission Not Found' };
    }

    return {
        title: `${mission.name} | Space Missions`,
        description: mission.description_short || `Learn about the ${mission.name} space mission`
    };
}

export default async function MissionPage({ params }: Props) {
    const { id } = await params;

    // Pobierz misję wraz z powiązaną rakietą
    const mission = await prisma.missions.findUnique({
        where: { id },
        include: {
            rockets: {
                select: {
                    id: true,
                    name: true,
                    operator: true,
                    image: true,
                    massToOrbit: true,
                    height: true,
                    diameter: true,
                    stages: true,
                    status: true
                }
            }
        }
    });

    if (!mission) {
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

    const formatDecimal = (value: number | null | undefined): string | null => {
        if (value === null || value === undefined) return null;
        return value.toString();
    };

    const getMissionStatus = () => {
        if (mission.endTime && mission.status == "COMPLETED") {
            return { status: 'Completed', color: 'text-blue-400' };
        }

        if (mission.status) {
            return { status: formatStatus(mission.status), color: getStatusColor(mission.status) };
        }

        const now = new Date();
        const start = new Date(mission.startTime);

        if (now < start) return { status: 'Planned', color: 'text-yellow-400' };
        return { status: 'Active', color: 'text-green-400' };
    };

    const getStatusColor = (status: string | null) => {
        switch (status?.toUpperCase()) {
            case 'PLANNED': return 'text-yellow-400';
            case 'ACTIVE': return 'text-green-400';
            case 'COMPLETED': return 'text-blue-400';
            case 'FAILED': return 'text-red-400';
            case 'CANCELLED': return 'text-gray-400';
            default: return 'text-gray-400';
        }
    };

    const getStatusBadgeColor = (status: string | null) => {
        switch (status?.toUpperCase()) {
            case 'PLANNED': return 'bg-yellow-600';
            case 'ACTIVE': return 'bg-green-600';
            case 'COMPLETED': return 'bg-blue-600';
            case 'FAILED': return 'bg-red-600';
            case 'CANCELLED': return 'bg-gray-600';
            default: return 'bg-gray-600';
        }
    };

    const formatCategory = (category: string | null) => {
        if (!category) return 'Unknown';
        return category.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
    };

    const formatStatus = (status: string | null) => {
        if (!status) return 'Unknown';
        return status.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
    };

    const currentStatus = getMissionStatus();

    return (
        <div className="min-h-screen pt-24 pb-20">
            {/* Back Navigation */}
            <div className="max-w-7xl mx-auto px-6 mb-8">
                <Link
                    href="/missions"
                    className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Missions
                </Link>
            </div>

            {/* Mission Header */}
            <div className="max-w-7xl mx-auto px-6 mb-16">
                <div className="text-center mb-12">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                        {mission.name || 'Unknown Mission'}
                    </h1>

                    {mission.description_short && (
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                            {mission.description_short}
                        </p>
                    )}

                    {/* Mission Badges */}
                    <div className="flex flex-wrap justify-center gap-4 mb-8">
                        <div className="bg-blue-600 text-white px-4 py-2 rounded-full text-lg font-semibold">
                            {new Date(mission.startTime).getFullYear()}
                        </div>

                        {mission.isCrewed !== null && (
                            <div className={`px-4 py-2 rounded-full text-lg font-semibold ${mission.isCrewed
                                ? 'bg-green-600 text-white'
                                : 'bg-purple-600 text-white'
                                }`}>
                                {mission.isCrewed ? 'Crewed Mission' : 'Robotic Mission'}
                            </div>
                        )}

                        {mission.destitation && (
                            <div className="bg-orange-600 text-white px-4 py-2 rounded-full text-lg font-semibold">
                                {mission.destitation}
                            </div>
                        )}

                        <div className={`${getStatusBadgeColor(mission.status)} text-white px-4 py-2 rounded-full text-lg font-semibold`}>
                            {currentStatus.status}
                        </div>

                        {mission.agency && (
                            <div className="bg-indigo-600 text-white px-4 py-2 rounded-full text-lg font-semibold">
                                {mission.agency}
                            </div>
                        )}

                        {mission.category && (
                            <div className="bg-teal-600 text-white px-4 py-2 rounded-full text-lg font-semibold">
                                {formatCategory(mission.category)}
                            </div>
                        )}
                    </div>
                </div>

                {/* Mission Image */}
                {mission.image && (
                    <div className="relative max-w-4xl mx-auto mb-16">
                        <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                            <Image
                                src={mission.image}
                                alt={mission.name || "Mission image"}
                                fill
                                className="object-cover"
                                priority
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        </div>
                    </div>
                )}
            </div>

            {/* Mission Content */}
            <div className="max-w-6xl mx-auto px-6">
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 md:p-12">
                    <h2 className="text-3xl font-bold mb-8 text-white">Mission Details</h2>

                    {mission.description ? (
                        <div className="prose prose-invert prose-lg max-w-none">
                            <p className="text-gray-300 leading-relaxed text-lg">
                                {mission.description}
                            </p>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📡</div>
                            <h3 className="text-2xl font-bold text-gray-300 mb-2">No Details Available</h3>
                            <p className="text-gray-400">Detailed information about this mission is not yet available.</p>
                        </div>
                    )}

                    {/* Mission Stats */}
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-black/30 rounded-lg p-6 text-center">
                            <div className="text-2xl font-bold text-blue-400">
                                {new Date(mission.startTime).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            </div>
                            <div className="text-sm text-gray-300">Launch Date</div>
                        </div>

                        <div className="bg-black/30 rounded-lg p-6 text-center">
                            <div className="text-2xl font-bold text-purple-400">
                                {mission.destitation || 'Unknown'}
                            </div>
                            <div className="text-sm text-gray-300">Destination</div>
                        </div>

                        <div className="bg-black/30 rounded-lg p-6 text-center">
                            <div className="text-2xl font-bold text-green-400">
                                {mission.isCrewed === true ? 'Crewed' :
                                    mission.isCrewed === false ? 'Robotic' : 'Unknown'}
                            </div>
                            <div className="text-sm text-gray-300">Mission Type</div>
                        </div>
                    </div>

                    {/* Launch Vehicle Section */}
                    {mission.rockets && (
                        <Link href={`/rockets/${mission.rockets.id}`}>
                            <div className="mt-12 rounded-2xl border border-blue-700/30 bg-gradient-to-br from-gray-900/70 via-gray-900/80 to-gray-800/80 shadow-xl p-1">
                                <div className="rounded-2xl bg-gray-900/70 p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 transition-shadow duration-300 hover:shadow-blue-700/30 hover:shadow-2xl">
                                    {/* Rocket Image */}
                                    <div className="relative w-48 h-60 md:w-56 md:h-70 flex-shrink-0 rounded-xl overflow-hidden shadow-lg border-2 border-blue-700/20">
                                        <Image
                                            src={mission.rockets.image || '/Images/placeholder.png'}
                                            alt={mission.rockets.name}
                                            fill
                                            className="object-contain bg-gradient-to-t from-black/60 via-transparent to-transparent"
                                            sizes="(max-width: 768px) 192px, 224px"
                                        />
                                        <div className="absolute bottom-0 left-0 w-full h-6 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                                    </div>

                                    {/* Rocket Info */}
                                    <div className="flex-1 flex flex-col justify-center gap-4">
                                        <div>
                                            <h4 className="text-3xl font-extrabold text-white mb-1 tracking-tight flex items-center gap-2">
                                                {mission.rockets.name}
                                                <span className="ml-2 inline-block px-3 py-1 rounded-full bg-blue-600/80 text-xs font-semibold text-white tracking-wide shadow-sm">
                                                    {mission.rockets.operator}
                                                </span>
                                            </h4>
                                        </div>

                                        <div className="flex flex-wrap gap-4 mb-2">
                                            {/* Height */}
                                            {mission.rockets.height && (
                                                <div className="bg-gradient-to-br from-blue-800/60 to-blue-500/30 rounded-lg px-4 py-3 flex flex-col items-center min-w-[88px] shadow-inner">
                                                    <span className="text-lg font-bold text-blue-300">{mission.rockets.height?.toString()}<span className="text-blue-500">m</span></span>
                                                    <span className="text-xs text-blue-100 mt-1">Height</span>
                                                </div>
                                            )}
                                            {/* Stages */}
                                            {mission.rockets.stages && (
                                                <div className="bg-gradient-to-br from-purple-800/60 to-purple-500/30 rounded-lg px-4 py-3 flex flex-col items-center min-w-[88px] shadow-inner">
                                                    <span className="text-lg font-bold text-purple-300">{mission.rockets.stages}</span>
                                                    <span className="text-xs text-purple-100 mt-1">Stages</span>
                                                </div>
                                            )}
                                            {/* LEO Payload */}
                                            {mission.rockets.massToOrbit?.[0] && (
                                                <div className="bg-gradient-to-br from-green-800/60 to-green-500/30 rounded-lg px-4 py-3 flex flex-col items-center min-w-[110px] shadow-inner">
                                                    <span className="text-lg font-bold text-green-300">
                                                        {Number(mission.rockets.massToOrbit[0].toString()) >= 1000
                                                            ? `${(Number(mission.rockets.massToOrbit[0].toString()) / 1000).toFixed(1)} tons`
                                                            : `${mission.rockets.massToOrbit[0]} kg`
                                                        }
                                                    </span>
                                                    <span className="text-xs text-green-100 mt-1">LEO Payload</span>
                                                </div>
                                            )}
                                            {/* Status */}
                                            {mission.rockets.status && (
                                                <div className={`rounded-lg px-4 py-3 flex flex-col items-center min-w-[88px] shadow-inner
              ${mission.rockets.status === 'ACTIVE'
                                                        ? 'bg-green-700/60 text-green-300'
                                                        : mission.rockets.status === 'RETIRED'
                                                            ? 'bg-blue-800/60 text-blue-300'
                                                            : 'bg-gray-700/60 text-gray-300'
                                                    }`}>
                                                    <span className="text-lg font-bold uppercase tracking-wide">
                                                        {mission.rockets.status}
                                                    </span>
                                                    <span className="text-xs mt-1 text-white/60">Status</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* CTA */}
                                        <Link
                                            href={`/rockets/${mission.rockets.id}`}
                                            className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 font-semibold text-base mt-2 transition-colors group"
                                        >
                                            View Full Rocket Details
                                            <svg className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            </div></Link>
                    )}

                    {/* Comprehensive Mission Overview */}
                    <div className="mt-12 p-8 bg-black/20 rounded-xl border border-gray-700">
                        <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                            <svg className="w-6 h-6 mr-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Mission Overview
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Basic Information */}
                            <div className="space-y-4">
                                <h4 className="text-lg font-semibold text-blue-400 border-b border-blue-400/30 pb-2">
                                    Basic Information
                                </h4>

                                <div className="space-y-3 text-gray-300">
                                    <div>
                                        <span className="font-semibold text-white">Mission Name:</span>
                                        <div className="text-gray-300">{mission.name || 'Unknown'}</div>
                                    </div>

                                    {mission.agency && (
                                        <div>
                                            <span className="font-semibold text-white">Agency:</span>
                                            <div className="text-gray-300">{mission.agency}</div>
                                        </div>
                                    )}

                                    <div>
                                        <span className="font-semibold text-white">Status:</span>
                                        <div className={`font-semibold ${currentStatus.color}`}>
                                            {currentStatus.status}
                                        </div>
                                    </div>

                                    {mission.category && (
                                        <div>
                                            <span className="font-semibold text-white">Category:</span>
                                            <div className="text-gray-300">{formatCategory(mission.category)}</div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Mission Timeline */}
                            <div className="space-y-4">
                                <h4 className="text-lg font-semibold text-purple-400 border-b border-purple-400/30 pb-2">
                                    Mission Timeline
                                </h4>

                                <div className="space-y-3 text-gray-300">
                                    <div>
                                        <span className="font-semibold text-white">Launch:</span>
                                        <div className="text-gray-300">
                                            {new Date(mission.startTime).toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </div>
                                        <div className="text-gray-400 text-sm">
                                            {new Date(mission.startTime).toLocaleTimeString('en-US', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                second: '2-digit',
                                                timeZoneName: 'short'
                                            })}
                                        </div>
                                    </div>

                                    {mission.endTime && (
                                        <div>
                                            <span className="font-semibold text-white">End Date:</span>
                                            <div className="text-gray-300">
                                                {new Date(mission.endTime).toLocaleDateString('en-US', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </div>
                                            <div className="text-gray-400 text-sm">
                                                {new Date(mission.endTime).toLocaleTimeString('en-US', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    second: '2-digit',
                                                    timeZoneName: 'short'
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <span className="font-semibold text-white">Mission Duration:</span>
                                        <LiveMissionTimer
                                            startTime={mission.startTime.toISOString()}
                                            endTime={mission.endTime?.toISOString() || null}
                                            missionName={mission.name || 'Unknown Mission'}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Technical Details */}
                            <div className="space-y-4">
                                <h4 className="text-lg font-semibold text-green-400 border-b border-green-400/30 pb-2">
                                    Technical Details
                                </h4>

                                <div className="space-y-3 text-gray-300">
                                    {mission.isCrewed !== null && (
                                        <div>
                                            <span className="font-semibold text-white">Crew Type:</span>
                                            <div className="text-gray-300">
                                                {mission.isCrewed ? 'Human crew aboard' : 'Unmanned robotic mission'}
                                            </div>
                                        </div>
                                    )}

                                    {mission.destitation && (
                                        <div>
                                            <span className="font-semibold text-white">Target Destination:</span>
                                            <div className="text-gray-300">{mission.destitation}</div>
                                        </div>
                                    )}

                                    <div>
                                        <span className="font-semibold text-white">Mission Objective:</span>
                                        <div className="text-gray-300">
                                            {mission.description_short || 'Scientific exploration and research'}
                                        </div>
                                    </div>

                                    {mission.rockets && (
                                        <div>
                                            <span className="font-semibold text-white">Launch Vehicle:</span>
                                            <div className="text-gray-300">{mission.rockets.name}</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Missions CTA */}
            <div className="max-w-4xl mx-auto px-6 mt-16 text-center">
                <Link
                    href="/missions"
                    className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-lg font-semibold transition-colors"
                >
                    Explore More Missions
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </Link>
            </div>
        </div>
    );
}
