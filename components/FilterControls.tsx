"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';

interface FilterControlsProps {
    currentFilter: string;
    currentSort: string;
    currentOrder: string;
}

export default function FilterControls({ 
    currentFilter, 
    currentSort, 
    currentOrder 
}: FilterControlsProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [filter, setFilter] = useState(currentFilter);
    const [filterType, setFilterType] = useState('contains'); // exact, contains, starts

    const updateURL = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }

        startTransition(() => {
            router.push(`/missions?${params.toString()}`);
        });
    };

    const handleFilterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Dodaj typ filtrowania do query
        let searchTerm = filter;
        if (filterType === 'exact' && filter) {
            searchTerm = `"${filter}"`;
        } else if (filterType === 'starts' && filter) {
            searchTerm = `^${filter}`;
        }
        
        updateURL('filter', searchTerm);
    };

    const clearFilters = () => {
        setFilter('');
        setFilterType('contains');
        startTransition(() => {
            router.push('/missions');
        });
    };

    return (
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 max-w-4xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
                {/* Search Filter */}
                <form onSubmit={handleFilterSubmit} className="flex-1 w-full lg:w-auto">
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                placeholder="Search missions..."
                                className="w-full px-4 py-3 pl-10 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
                            />
                            <svg className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="px-3 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
                        >
                            <option value="contains">Contains</option>
                            <option value="exact">Exact</option>
                            <option value="starts">Starts with</option>
                        </select>
                    </div>
                </form>

                {/* Sort Controls */}
                <div className="flex gap-3 w-full lg:w-auto">
                    <select
                        value={currentSort}
                        onChange={(e) => updateURL('sort', e.target.value)}
                        className="px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
                        disabled={isPending}
                    >
                        <option value="created_at">Sort by Date</option>
                        <option value="name">Sort by Name</option>
                    </select>

                    <select
                        value={currentOrder}
                        onChange={(e) => updateURL('order', e.target.value)}
                        className="px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
                        disabled={isPending}
                    >
                        <option value="desc">{currentSort === 'name' ? 'Z-A' : 'Newest First'}</option>
                        <option value="asc">{currentSort === 'name' ? 'A-Z' : 'Oldest First'}</option>
                    </select>
                </div>

                {/* Clear Filters */}
                {(currentFilter || currentSort !== 'created_at' || currentOrder !== 'desc') && (
                    <button
                        onClick={clearFilters}
                        className="px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors whitespace-nowrap"
                        disabled={isPending}
                    >
                        Clear All
                    </button>
                )}
            </div>

            {/* Loading indicator */}
            {isPending && (
                <div className="mt-4 text-center">
                    <div className="inline-flex items-center text-blue-400">
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading...
                    </div>
                </div>
            )}
        </div>
    );
}
