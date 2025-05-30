"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Mission {
    id: string;
    name: string | null;
    image: string | null;
    description_short: string | null;
}

interface ImageSlideshowProps {
    missions: Mission[];
}

export default function ImageSlideshow({ missions }: ImageSlideshowProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Auto-advance slides every 5 seconds
    useEffect(() => {
        if (missions.length === 0) return;
        
        const interval = setInterval(() => {
            handleSlideChange((prevIndex) => 
                prevIndex === missions.length - 1 ? 0 : prevIndex + 1
            );
        }, 5000);

        return () => clearInterval(interval);
    }, [missions.length]);

    const handleSlideChange = (newIndexOrFunction: number | ((prev: number) => number)) => {
        setIsTransitioning(true);
        setTimeout(() => {
            if (typeof newIndexOrFunction === 'function') {
                setCurrentIndex(newIndexOrFunction);
            } else {
                setCurrentIndex(newIndexOrFunction);
            }
            setTimeout(() => setIsTransitioning(false), 50);
        }, 300);
    };

    if (missions.length === 0) {
        return (
            <div className="relative h-64 md:h-80 rounded-xl overflow-hidden bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
                <div className="text-center animate-pulse">
                    <div className="text-6xl mb-4 animate-bounce">🚀</div>
                    <p className="text-white font-semibold">Space Exploration</p>
                </div>
            </div>
        );
    }

    const currentMission = missions[currentIndex];

    return (
        <div className="relative h-64 md:h-80 rounded-xl overflow-hidden group">
            {/* Background Images with Parallax Effect */}
            <div className="absolute inset-0">
                <Image
                    src={currentMission.image || '/images/placeholder-mission.jpg'}
                    alt={currentMission.name || 'Space Mission'}
                    fill
                    className={`object-cover transition-all duration-700 ease-in-out transform ${
                        isTransitioning 
                            ? 'scale-110 opacity-0 blur-sm' 
                            : 'scale-100 opacity-100 blur-0 group-hover:scale-105'
                    }`}
                    sizes="(max-width: 768px) 100vw, 50vw"
                />
            </div>
            
            {/* Animated Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-all duration-500 ${
                isTransitioning ? 'opacity-80' : 'opacity-60'
            }`}></div>
            
            {/* Floating Particles Effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-ping"></div>
                <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-blue-400/40 rounded-full animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-purple-400/30 rounded-full animate-bounce delay-500"></div>
            </div>
            
            {/* Mission Info with Slide Animation */}
            <div className={`absolute bottom-4 left-4 text-white transition-all duration-500 transform ${
                isTransitioning 
                    ? 'translate-y-4 opacity-0' 
                    : 'translate-y-0 opacity-100'
            }`}>
                <p className="text-sm font-semibold mb-1 animate-fadeInUp">
                    {currentMission.name || 'Historic Space Mission'}
                </p>
                <p className="text-xs text-gray-300 animate-fadeInUp delay-100">
                    {currentMission.description_short || 'Exploring the cosmos'}
                </p>
            </div>

            {/* Animated Progress Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-black/20">
                <div 
                    className="h-full bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-5000 ease-linear"
                    style={{
                        width: isTransitioning ? '0%' : '100%',
                        transition: isTransitioning ? 'width 0.3s' : 'width 5s linear'
                    }}
                ></div>
            </div>

            {/* Animated Slide Indicators */}
            <div className="absolute bottom-4 right-4 flex space-x-2">
                {missions.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => handleSlideChange(index)}
                        className={`relative w-3 h-3 rounded-full transition-all duration-300 transform hover:scale-125 ${
                            index === currentIndex 
                                ? 'bg-white shadow-lg shadow-white/50' 
                                : 'bg-white/50 hover:bg-white/70'
                        }`}
                    >
                        {index === currentIndex && (
                            <div className="absolute inset-0 rounded-full bg-white animate-ping"></div>
                        )}
                    </button>
                ))}
            </div>

            {/* Animated Navigation Arrows */}
            <button
                onClick={() => handleSlideChange(currentIndex === 0 ? missions.length - 1 : currentIndex - 1)}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100 hover:shadow-lg"
            >
                <svg className="w-4 h-4 transition-transform duration-200 hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            
            <button
                onClick={() => handleSlideChange(currentIndex === missions.length - 1 ? 0 : currentIndex + 1)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100 hover:shadow-lg"
            >
                <svg className="w-4 h-4 transition-transform duration-200 hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>

            {/* Corner Glow Effect */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-400/20 to-transparent rounded-bl-full animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-400/20 to-transparent rounded-tr-full animate-pulse delay-1000"></div>
        </div>
    );
}
