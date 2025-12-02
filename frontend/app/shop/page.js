'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '../../src/utils/api';
import ProductCard from '../../src/components/ProductCard';
import FilterSidebar from '../../src/components/FilterSidebar';
import { FaSearch, FaFilter, FaTimes, FaThLarge, FaList } from 'react-icons/fa';

export default function Shop() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

    // Filter state from URL
    const [filters, setFilters] = useState({
        keyword: searchParams.get('keyword') || '',
        category: searchParams.get('category') || '',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        brand: searchParams.getAll('brand') || [],
        rating: searchParams.get('rating') || '',
        inStock: searchParams.get('inStock') === 'true',
        sortBy: searchParams.get('sortBy') || 'newest'
    });

    useEffect(() => {
        fetchProducts();
    }, [searchParams]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            // Build query string
            const params = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value && value !== '') {
                    if (Array.isArray(value)) {
                        value.forEach(v => params.append(key, v));
                    } else {
                        params.append(key, value);
                    }
                }
            });

            const { data } = await api.get(`/products?${params.toString()}`);
            setProducts(data.products || data);
            if (data.page) {
                setPagination({
                    page: data.page,
                    pages: data.pages,
                    total: data.total
                });
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        updateURL(newFilters);
    };

    const handleClearFilters = () => {
        const clearedFilters = {
            keyword: '',
            category: '',
            minPrice: '',
            maxPrice: '',
            brand: [],
            rating: '',
            inStock: false,
            sortBy: 'newest'
        };
        setFilters(clearedFilters);
        updateURL(clearedFilters);
    };

    const updateURL = (newFilters) => {
        const params = new URLSearchParams();
        Object.entries(newFilters).forEach(([key, value]) => {
            if (value && value !== '' && value !== false) {
                if (Array.isArray(value) && value.length > 0) {
                    value.forEach(v => params.append(key, v));
                } else if (!Array.isArray(value)) {
                    params.append(key, value);
                }
            }
        });
        router.push(`/shop?${params.toString()}`, { scroll: false });
    };

    const handleSortChange = (sortBy) => {
        const newFilters = { ...filters, sortBy };
        setFilters(newFilters);
        updateURL(newFilters);
    };

    return (
        <div className="container" style={{ paddingTop: 'var(--space-xl)', paddingBottom: 'var(--space-3xl)' }}>
            {/* Header */}
            <div style={{
                marginBottom: 'var(--space-2xl)',
                textAlign: 'center',
                padding: 'var(--space-2xl) 0'
            }}>
                <h1 style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>
                    Shop <span className="text-gradient">All Products</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                    Discover our curated collection of premium products
                </p>
            </div>

            {/* Search Bar */}
            <div style={{
                marginBottom: 'var(--space-xl)',
                display: 'flex',
                gap: 'var(--space-md)',
                flexWrap: 'wrap'
            }}>
                <div style={{ position: 'relative', flex: '1', minWidth: '300px' }}>
                    <FaSearch style={{
                        position: 'absolute',
                        left: '15px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-secondary)'
                    }} />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={filters.keyword}
                        onChange={(e) => handleFilterChange({ ...filters, keyword: e.target.value })}
                        style={{
                            width: '100%',
                            padding: '12px 12px 12px 45px',
                            borderRadius: 'var(--radius-full)',
                            border: '2px solid var(--border-color)',
                            fontSize: '1rem',
                            outline: 'none',
                            transition: 'all var(--transition-fast)'
                        }}
                    />
                </div>
                <button
                    className="btn btn-outline"
                    onClick={() => setShowFilters(!showFilters)}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    {showFilters ? <FaTimes /> : <FaFilter />}
                    {showFilters ? 'Hide' : 'Show'} Filters
                </button>
            </div>

            {/* Main Content */}
            <div style={{ display: 'grid', gridTemplateColumns: showFilters ? '280px 1fr' : '1fr', gap: 'var(--space-xl)' }}>
                {/* Filters Sidebar */}
                {showFilters && (
                    <FilterSidebar
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onClearFilters={handleClearFilters}
                    />
                )}

                {/* Products Section */}
                <div>
                    {/* Toolbar */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 'var(--space-lg)',
                        flexWrap: 'wrap',
                        gap: 'var(--space-md)'
                    }}>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                            {pagination.total > 0 ? `Showing ${products.length} of ${pagination.total} products` : 'No products found'}
                        </p>

                        <select
                            value={filters.sortBy}
                            onChange={(e) => handleSortChange(e.target.value)}
                            style={{
                                padding: '8px 12px',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--border-color)',
                                fontSize: '0.875rem',
                                cursor: 'pointer'
                            }}
                        >
                            <option value="newest">Newest First</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                            <option value="rating">Top Rated</option>
                            <option value="discount">Best Discount</option>
                            <option value="popular">Most Popular</option>
                        </select>
                    </div>

                    {/* Product Grid */}
                    {loading ? (
                        <div className="grid-products">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                                <div key={n} style={{
                                    height: '400px',
                                    borderRadius: 'var(--radius-xl)',
                                    background: 'var(--gray-100)',
                                    animation: 'pulse 1.5s ease-in-out infinite'
                                }}></div>
                            ))}
                        </div>
                    ) : products.length > 0 ? (
                        <div className="grid-products">
                            {products.map(product => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div style={{
                            textAlign: 'center',
                            padding: 'var(--space-3xl) 0',
                            color: 'var(--text-secondary)'
                        }}>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-md)' }}>
                                No products found
                            </h3>
                            <p>Try adjusting your filters or search terms</p>
                            <button
                                className="btn btn-primary"
                                onClick={handleClearFilters}
                                style={{ marginTop: 'var(--space-lg)' }}
                            >
                                Clear All Filters
                            </button>
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination.pages > 1 && (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: 'var(--space-sm)',
                            marginTop: 'var(--space-2xl)'
                        }}>
                            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    className={page === pagination.page ? 'btn btn-primary' : 'btn btn-outline'}
                                    onClick={() => handleFilterChange({ ...filters, page })}
                                    style={{ minWidth: '40px' }}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
