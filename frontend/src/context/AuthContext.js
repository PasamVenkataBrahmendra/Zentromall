'use client';

import { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkUserLoggedIn = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const { data } = await api.get('/users/profile');
                    setUser(data);
                } catch (error) {
                    console.error('Auth check failed:', error);
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };
        checkUserLoggedIn();
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await api.post('/users/login', { email, password });
            localStorage.setItem('token', data.token);
            setUser(data);
            router.push('/');
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.message || 'Login failed' };
        }
    };

    const register = async (name, email, password) => {
        try {
            const { data } = await api.post('/users/register', { name, email, password });
            localStorage.setItem('token', data.token);
            setUser(data);
            router.push('/');
            return { success: true };
        } catch (error) {
            console.error('Registration error:', error);
            
            // Provide more specific error messages
            let errorMessage = 'Registration failed';
            
            if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
                errorMessage = 'Cannot connect to server. Please make sure the backend is running.';
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.status === 400) {
                errorMessage = 'Invalid registration data. Please check your information.';
            } else if (error.response?.status === 500) {
                errorMessage = 'Server error. Please try again later.';
            }
            
            return { success: false, error: errorMessage };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
