"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

interface Suggestion {
    id: string;
    text: string;
    description?: string | null;
}

interface SmartSearchProps {
    currentQuery: string;
    currentSort: string;
    currentOrder: string;
}

export default function SmartSearch({ 
    currentQuery, 
    currentSort, 
    currentOrder
}: SmartSearchProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    
    const [query, setQuery] = useState(currentQuery);
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
    
    const inputRef = useRef<HTMLInputElement>(null);

    // Fetch suggestions from API
    const fetchSuggestions = async (searchQuery: string) => {
        if (searchQuery.length < 2) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        setIsLoadingSuggestions(true);
        try {
            const response = await fetch(`/api/suggestions?q=${encodeURIComponent(searchQuery)}`);
            const results = await response.json();
            setSuggestions(results);
            setShowSuggestions(true);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            setSuggestions([]);
        } finally {
            setIsLoadingSuggestions(false);
        }
    };

    // Debounced suggestions
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchSuggestions(query);
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    const updateURL = (searchQuery: string) => {
        const params = new URLSearchParams(searchParams.toString());
        
        if (searchQuery.trim()) {
            params.set('q', searchQuery.trim());
        } else {
            params.delete('q');
        }

        startTransition(() => {
            router.push(`/missions?${params.toString()}`);
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowSuggestions(false);
        updateURL(query);
    };

    const handleSuggestionClick = (suggestion: Suggestion) => {
        setQuery(suggestion.text);
        setShowSuggestions(false);
        updateURL(suggestion.text);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!showSuggestions || suggestions.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev => 
                    prev < suggestions.length - 1 ? prev + 1 : 0
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => 
                    prev > 0 ? prev - 1 : suggestions.length - 1
                );
                break;
            case 'Enter':
                if (selectedIndex >= 0) {
                    e.preventDefault();
                    handleSuggestionClick(suggestions[selectedIndex]);
                }
                break;
            case 'Escape':
                setShowSuggestions(false);
                setSelectedIndex(-1);
                break;
        }
    };

    const updateSort = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set(key, value);
        
        startTransition(() => {
            router.push(`/missions?${params.toString()}`);
        });
    };

    const clearSearch = () => {
        setQuery('');
        setSuggestions([]);
        setShowSuggestions(false);
        updateURL('');
    };

    return (
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 max-w-4xl mx-auto relative z-30">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
                {/* Search Input with Autocomplete */}
                <div className="flex-1 w-full lg:w-auto relative">
                    <form onSubmit={handleSubmit}>
                        <div className="relative">
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                    setSelectedIndex(-1);
                                }}
                                onKeyDown={handleKeyDown}
                                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                                onBlur={() => {
                                    // Delay hiding suggestions to allow clicks
                                    setTimeout(() => setShowSuggestions(false), 200);
                                }}
                                placeholder="Search missions (e.g., Apollo, Mars, NASA, ACTIVE)..."
                                className="w-full px-4 py-3 pl-10 pr-10 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
                            />
                            <svg className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            
                            {isLoadingSuggestions ? (
                                <div className="absolute right-3 top-3.5 w-4 h-4">
                                    <svg className="animate-spin w-4 h-4 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </div>
                            ) : query && (
                                <button
                                    type="button"
                                    onClick={clearSearch}
                                    className="absolute right-3 top-3.5 w-4 h-4 text-gray-400 hover:text-white"
                                >
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </form>

                    {/* Suggestions Dropdown - ZWIĘKSZONY Z-INDEX */}
                    {showSuggestions && suggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl z-[100] max-h-64 overflow-y-auto">
                            {suggestions.map((suggestion, index) => (
                                <button
                                    key={suggestion.id}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className={`w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors ${
                                        index === selectedIndex ? 'bg-gray-700' : ''
                                    }`}
                                >
                                    <div className="font-medium text-white">{suggestion.text}</div>
                                    {suggestion.description && (
                                        <div className="text-sm text-gray-400 truncate">
                                            {suggestion.description}
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sort Controls */}
                <div className="flex gap-3 w-full lg:w-auto">
                    <select
                        value={currentSort}
                        onChange={(e) => updateSort('sort', e.target.value)}
                        className="px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
                        disabled={isPending}
                    >
                        <option value="startTime">By Date</option>
                        <option value="name">By Name</option>
                    </select>

                    <select
                        value={currentOrder}
                        onChange={(e) => updateSort('order', e.target.value)}
                        className="px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
                        disabled={isPending}
                    >
                        <option value="desc">{currentSort === 'name' ? 'Z-A' : 'Newest'}</option>
                        <option value="asc">{currentSort === 'name' ? 'A-Z' : 'Oldest'}</option>
                    </select>
                </div>
            </div>

            {/* Loading indicator */}
            {isPending && (
                <div className="mt-4 text-center">
                    <div className="inline-flex items-center text-blue-400">
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Searching...
                    </div>
                </div>
            )}
        </div>
    );
}
