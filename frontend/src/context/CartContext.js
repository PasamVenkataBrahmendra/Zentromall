'use client';

import { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(null);
    const { user } = useAuth();

    const fetchCart = async () => {
        if (!user) return;
        try {
            const { data } = await api.get('/cart');
            setCart(data);
        } catch (error) {
            console.error('Failed to fetch cart:', error);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [user]);

    const addToCart = async (productId, quantity = 1) => {
        if (!user) {
            alert('Please login to add items to cart');
            return;
        }
        try {
            const { data } = await api.post('/cart', { productId, quantity });
            setCart(data);
            alert('Added to cart!');
        } catch (error) {
            console.error('Add to cart failed:', error);
            alert('Failed to add to cart');
        }
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, fetchCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
