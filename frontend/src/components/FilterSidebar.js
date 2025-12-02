'use client';

import { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

export default function FilterSidebar({ filters, onFilterChange, onClearFilters }) {
    const [filterOptions, setFilterOptions] = useState({
        brands: [],
        priceRange: { minPrice: 0, maxPrice: 10000 },
        sizes: [],
        colors: []
    });

    useEffect(() => {
        // Fetch available filter options
        const fetchFilterOptions = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/products/filters`);
                const data = await response.json();
                setFilterOptions(data);
            } catch (error) {
                console.error('Error fetching filter options:', error);
            }
        };
        fetchFilterOptions();
    }, []);

    const handlePriceChange = (type, value) => {
        onFilterChange({
            ...filters,
            [type]: value
        });
    };

    const handleBrandToggle = (brand) => {
        const currentBrands = filters.brand || [];
        const newBrands = currentBrands.includes(brand)
            ? currentBrands.filter(b => b !== brand)
            : [...currentBrands, brand];

        onFilterChange({
            ...filters,
            brand: newBrands
        });
    };

    const handleRatingChange = (rating) => {
        onFilterChange({
            ...filters,
            rating: filters.rating === rating ? null : rating
        });
    };

    const handleStockToggle = () => {
        onFilterChange({
            ...filters,
            inStock: !filters.inStock
        });
    };

    return (
        <div className="glass" style={{
            padding: 'var(--space-lg)',
            borderRadius: 'var(--radius-xl)',
            position: 'sticky',
            top: '100px'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'var(--space-lg)'
            }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Filters</h3>
                <button
                    onClick={onClearFilters}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--primary)',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: '600'
                    }}
                >
                    Clear All
                </button>
            </div>

            {/* Price Range */}
            <div style={{ marginBottom: 'var(--space-xl)' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: 'var(--space-md)' }}>
                    Price Range
                </h4>
                <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-sm)' }}>
                    <input
                        type="number"
                        placeholder="Min"
                        value={filters.minPrice || ''}
                        onChange={(e) => handlePriceChange('minPrice', e.target.value)}
                        style={{
                            flex: 1,
                            padding: 'var(--space-sm)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border-color)',
                            fontSize: '0.875rem'
                        }}
                    />
                    <span style={{ alignSelf: 'center' }}>-</span>
                    <input
                        type="number"
                        placeholder="Max"
                        value={filters.maxPrice || ''}
                        onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
                        style={{
                            flex: 1,
                            padding: 'var(--space-sm)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border-color)',
                            fontSize: '0.875rem'
                        }}
                    />
                </div>
                <input
                    type="range"
                    min={filterOptions.priceRange.minPrice}
                    max={filterOptions.priceRange.maxPrice}
                    value={filters.maxPrice || filterOptions.priceRange.maxPrice}
                    onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
                    style={{ width: '100%' }}
                />
            </div>

            {/* Brand Filter */}
            {filterOptions.brands.length > 0 && (
                <div style={{ marginBottom: 'var(--space-xl)' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: 'var(--space-md)' }}>
                        Brand
                    </h4>
                    <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {filterOptions.brands.map((brand) => (
                            <label
                                key={brand}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--space-sm)',
                                    marginBottom: 'var(--space-sm)',
                                    cursor: 'pointer',
                                    fontSize: '0.875rem'
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={(filters.brand || []).includes(brand)}
                                    onChange={() => handleBrandToggle(brand)}
                                    style={{ cursor: 'pointer' }}
                                />
                                {brand}
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {/* Rating Filter */}
            <div style={{ marginBottom: 'var(--space-xl)' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: 'var(--space-md)' }}>
                    Rating
                </h4>
                {[4, 3, 2, 1].map((rating) => (
                    <label
                        key={rating}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-sm)',
                            marginBottom: 'var(--space-sm)',
                            cursor: 'pointer',
                            fontSize: '0.875rem'
                        }}
                    >
                        <input
                            type="radio"
                            name="rating"
                            checked={filters.rating === rating}
                            onChange={() => handleRatingChange(rating)}
                            style={{ cursor: 'pointer' }}
                        />
                        <span>{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</span>
                        <span style={{ color: 'var(--text-secondary)' }}>& up</span>
                    </label>
                ))}
            </div>

            {/* Availability */}
            <div>
                <label
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-sm)',
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                    }}
                >
                    <input
                        type="checkbox"
                        checked={filters.inStock || false}
                        onChange={handleStockToggle}
                        style={{ cursor: 'pointer' }}
                    />
                    In Stock Only
                </label>
            </div>
        </div>
    );
}
