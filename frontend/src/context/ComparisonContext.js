'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const ComparisonContext = createContext();

export function ComparisonProvider({ children }) {
  const [compareList, setCompareList] = useState([]);

  // Load from local storage
  useEffect(() => {
    const stored = localStorage.getItem('compareList');
    if (stored) {
      setCompareList(JSON.parse(stored));
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('compareList', JSON.stringify(compareList));
  }, [compareList]);

  const addToCompare = (product) => {
    if (compareList.find(p => p._id === product._id)) {
      alert('Product already in comparison list');
      return;
    }
    if (compareList.length >= 4) {
      alert('You can compare up to 4 products at a time. Please remove one to add another.');
      return;
    }
    setCompareList([...compareList, product]);
  };

  const removeFromCompare = (productId) => {
    setCompareList(compareList.filter(p => p._id !== productId));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  return (
    <ComparisonContext.Provider value={{
      compareList,
      addToCompare,
      removeFromCompare,
      clearCompare
    }}>
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  return useContext(ComparisonContext);
}
