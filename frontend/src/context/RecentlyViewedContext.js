'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const RecentlyViewedContext = createContext();

export const useRecentlyViewed = () => {
    const context = useContext(RecentlyViewedContext);
    if (!context) {
        throw new Error('useRecentlyViewed must be used within RecentlyViewedProvider');
    }
    return context;
};

export const RecentlyViewedProvider = ({ children }) => {
    const [recentlyViewed, setRecentlyViewed] = useState([]);
    const MAX_ITEMS = 12;

    useEffect(() => {
        // Load from localStorage on mount
        const stored = localStorage.getItem('recentlyViewed');
        if (stored) {
            try {
                setRecentlyViewed(JSON.parse(stored));
            } catch (error) {
                console.error('Error parsing recently viewed:', error);
            }
        }
    }, []);

    const addToRecentlyViewed = (product) => {
        setRecentlyViewed(prev => {
            // Remove if already exists
            const filtered = prev.filter(p => p._id !== product._id);

            // Add to beginning
            const updated = [product, ...filtered].slice(0, MAX_ITEMS);

            // Save to localStorage
            localStorage.setItem('recentlyViewed', JSON.stringify(updated));

            return updated;
        });
    };

    const clearRecentlyViewed = () => {
        setRecentlyViewed([]);
        localStorage.removeItem('recentlyViewed');
    };

    const value = {
        recentlyViewed,
        addToRecentlyViewed,
        clearRecentlyViewed
    };

    return (
        <RecentlyViewedContext.Provider value={value}>
            {children}
        </RecentlyViewedContext.Provider>
    );
};
