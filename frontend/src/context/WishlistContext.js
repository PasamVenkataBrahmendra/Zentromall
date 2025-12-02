'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const WishlistContext = createContext();

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within WishlistProvider');
    }
    return context;
};

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState({ products: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }
            const { data } = await api.get('/wishlist');
            setWishlist(data);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        } finally {
            setLoading(false);
        }
    };

    const addToWishlist = async (productId) => {
        try {
            const { data } = await api.post(`/wishlist/${productId}`);
            setWishlist(data);
            return { success: true, message: 'Added to wishlist' };
        } catch (error) {
            return { success: false, error: error.response?.data?.message || 'Failed to add to wishlist' };
        }
    };

    const removeFromWishlist = async (productId) => {
        try {
            const { data } = await api.delete(`/wishlist/${productId}`);
            setWishlist(data);
            return { success: true, message: 'Removed from wishlist' };
        } catch (error) {
            return { success: false, error: error.response?.data?.message || 'Failed to remove from wishlist' };
        }
    };

    const clearWishlist = async () => {
        try {
            await api.delete('/wishlist');
            setWishlist({ products: [] });
            return { success: true, message: 'Wishlist cleared' };
        } catch (error) {
            return { success: false, error: error.response?.data?.message || 'Failed to clear wishlist' };
        }
    };

    const moveToCart = async (productId) => {
        try {
            await api.post(`/wishlist/${productId}/move-to-cart`);
            await fetchWishlist();
            return { success: true, message: 'Moved to cart' };
        } catch (error) {
            return { success: false, error: error.response?.data?.message || 'Failed to move to cart' };
        }
    };

    const isInWishlist = (productId) => {
        return wishlist.products.some(item => item.product._id === productId);
    };

    const value = {
        wishlist,
        loading,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        moveToCart,
        isInWishlist,
        wishlistCount: wishlist.products.length
    };

    return (
        <WishlistContext.Provider value={value}>
            {children}
        </WishlistContext.Provider>
    );
};
