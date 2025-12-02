'use client';

import { createContext, useContext, useState } from 'react';

const CheckoutContext = createContext();

export const useCheckout = () => {
    const context = useContext(CheckoutContext);
    if (!context) {
        throw new Error('useCheckout must be used within CheckoutProvider');
    }
    return context;
};

export const CheckoutProvider = ({ children }) => {
    const [checkoutData, setCheckoutData] = useState({
        step: 1,
        selectedAddress: null,
        paymentMethod: 'cod',
        couponCode: '',
        discount: 0
    });

    const updateCheckoutData = (data) => {
        setCheckoutData(prev => ({ ...prev, ...data }));
    };

    const nextStep = () => {
        setCheckoutData(prev => ({ ...prev, step: prev.step + 1 }));
    };

    const prevStep = () => {
        setCheckoutData(prev => ({ ...prev, step: prev.step - 1 }));
    };

    const resetCheckout = () => {
        setCheckoutData({
            step: 1,
            selectedAddress: null,
            paymentMethod: 'cod',
            couponCode: '',
            discount: 0
        });
    };

    const value = {
        checkoutData,
        updateCheckoutData,
        nextStep,
        prevStep,
        resetCheckout
    };

    return (
        <CheckoutContext.Provider value={value}>
            {children}
        </CheckoutContext.Provider>
    );
};
