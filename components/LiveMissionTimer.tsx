"use client";

import { useState, useEffect } from 'react';

interface LiveMissionTimerProps {
    startTime: string; // ISO string
    endTime?: string | null; // ISO string or null
    missionName?: string;
}

interface TimeElapsed {
    years: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

export default function LiveMissionTimer({ startTime, endTime, missionName }: LiveMissionTimerProps) {
    const [timeElapsed, setTimeElapsed] = useState<TimeElapsed>({
        years: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    const calculateElapsedTime = (): TimeElapsed => {
        const now = new Date();
        const start = new Date(startTime);
        const end = endTime ? new Date(endTime) : now;
        const diffMs = end.getTime() - start.getTime();
        
        if (diffMs < 0) {
            return { years: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
        }

        const years = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365.25));
        const remainingAfterYears = diffMs % (1000 * 60 * 60 * 24 * 365.25);
        
        const days = Math.floor(remainingAfterYears / (1000 * 60 * 60 * 24));
        const remainingAfterDays = remainingAfterYears % (1000 * 60 * 60 * 24);
        
        const hours = Math.floor(remainingAfterDays / (1000 * 60 * 60));
        const remainingAfterHours = remainingAfterDays % (1000 * 60 * 60);
        
        const minutes = Math.floor(remainingAfterHours / (1000 * 60));
        const seconds = Math.floor((remainingAfterHours % (1000 * 60)) / 1000);

        return { years, days, hours, minutes, seconds };
    };

    useEffect(() => {
        // Calculate initial value
        setTimeElapsed(calculateElapsedTime());

        if (endTime) {
            // If mission ended, don't start interval
            return;
        }

        // Start interval for live updates
        const interval = setInterval(() => {
            setTimeElapsed(calculateElapsedTime());
        }, 1000);

        return () => clearInterval(interval);
    }, [startTime, endTime]);

    const formatNumber = (num: number): string => {
        return num.toString().padStart(2, '0');
    };

    const formatDuration = () => {
        let duration = '';
        
        if (timeElapsed.years > 0) {
            duration += `${timeElapsed.years} year${timeElapsed.years > 1 ? 's' : ''}, `;
        }
        if (timeElapsed.days > 0) {
            duration += `${timeElapsed.days} day${timeElapsed.days > 1 ? 's' : ''}, `;
        }
        if (timeElapsed.hours > 0) {
            duration += `${timeElapsed.hours} hour${timeElapsed.hours > 1 ? 's' : ''}, `;
        }
        if (timeElapsed.minutes > 0) {
            duration += `${timeElapsed.minutes} minute${timeElapsed.minutes > 1 ? 's' : ''}, `;
        }
        duration += `${timeElapsed.seconds} second${timeElapsed.seconds > 1 ? 's' : ''}`;
        
        return duration;
    };

    return (
        <div className="bg-black/30 p-4 rounded-lg border border-green-500/30">
            <div className="text-gray-300 font-mono text-sm bg-black/50 p-3 rounded border border-green-500/20">
                {formatDuration()}
            </div>
            {!endTime && (
                <div className="flex items-center justify-center mt-3 text-green-400 text-xs">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                    <span className="font-mono">LIVE COUNTING - MISSION ONGOING</span>
                    <div className="ml-2 flex space-x-1">
                        <div className="w-1 h-1 bg-green-400 rounded-full animate-ping"></div>
                        <div className="w-1 h-1 bg-green-400 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-1 h-1 bg-green-400 rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                </div>
            )}
            {endTime && (
                <div className="flex items-center justify-center mt-3 text-blue-400 text-xs">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                    <span className="font-mono">MISSION COMPLETED</span>
                </div>
            )}
        </div>
    );
}
