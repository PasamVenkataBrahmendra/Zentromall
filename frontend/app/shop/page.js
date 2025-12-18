'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '../../src/utils/api';
import ProductCard from '../../src/components/ProductCard';
import FilterSidebar from '../../src/components/FilterSidebar';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import { FALLBACK_PRODUCTS, FALLBACK_META } from '../../src/data/fallbackData';

const joinParam = (values = []) => values.filter(Boolean).join(',');

function ShopView() {
    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [meta, setMeta] = useState(null);
    const [priceDraft, setPriceDraft] = useState([0, 0]);

    const router = useRouter();
    const searchParams = useSearchParams();

    const appliedCategories = useMemo(
        () => searchParams.get('category')?.split(',').filter(Boolean) || [],
        [searchParams]
    );
    const appliedBrands = useMemo(
        () => searchParams.get('brand')?.split(',').filter(Boolean) || [],
        [searchParams]
    );
    const appliedRating = searchParams.get('rating');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    // Set price slider bounds when meta or query changes
    useEffect(() => {
        if (!meta) return;
        setPriceDraft([
            Number(minPrice || meta.priceRange.min),
            Number(maxPrice || meta.priceRange.max),
        ]);
    }, [minPrice, maxPrice, meta]);

    // Fetch filter metadata
    useEffect(() => {
        const fetchMeta = async () => {
            try {
                const { data } = await api.get('/products/filters/meta');
                setMeta(data);
            } catch (error) {
                console.error('Failed to load filter metadata:', error);
                setMeta(FALLBACK_META);
            }
        };

        fetchMeta();
    }, []);

    // Fetch products with filters
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params = Object.fromEntries(searchParams.entries());
                const { data } = await api.get('/products', { params });

                // Support:
                // 1) data = { products, pagination }
                // 2) data = [ ...products ]
                if (Array.isArray(data)) {
                    setProducts(data);
                    setPagination({
                        total: data.length,
                        page: 1,
                        pages: 1,
                        limit: data.length,
                    });
                } else {
                    setProducts(data.products || []);
                    setPagination(data.pagination || null);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
                setProducts(FALLBACK_PRODUCTS);
                setPagination({
                    total: FALLBACK_PRODUCTS.length,
                    page: 1,
                    pages: 1,
                    limit: FALLBACK_PRODUCTS.length,
                });
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [searchParams]);

    const updateParam = (key, value) => {
        const params = new URLSearchParams(searchParams.toString());

        if (!value || (Array.isArray(value) && !value.length)) {
            params.delete(key);
        } else {
            params.set(key, Array.isArray(value) ? joinParam(value) : value);
        }

        router.push(`/shop?${params.toString()}`, { scroll: false });
    };

    const toggleMultiSelect = (key, value) => {
        const current = key === 'category' ? appliedCategories : appliedBrands;
        const next = current.includes(value)
            ? current.filter((item) => item !== value)
            : [...current, value];
        updateParam(key, next);
    };

    const applyPriceFilter = () => {
        if (!meta) return;
        updateParam('minPrice', priceDraft[0]);
        updateParam('maxPrice', priceDraft[1]);
    };

    const clearFilters = () => {
        router.push('/shop');
    };

    const productCount = Array.isArray(products) ? products.length : 0;

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
                    {pagination
                        ? `${pagination.total} products · Page ${pagination.page} of ${pagination.pages}`
                        : 'Loading...'}
                </p>
            </div>

            {/* Search Bar - Re-integrated for cleaner look in the header area */}
            <div style={{
                marginBottom: 'var(--space-xl)',
                display: 'flex',
                gap: 'var(--space-md)',
                flexWrap: 'wrap',
                justifyContent: 'center'
            }}>
                <div style={{ position: 'relative', flex: '0 1 500px' }}>
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
                        defaultValue={searchParams.get('keyword') || ''}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') updateParam('keyword', e.target.value);
                        }}
                        style={{
                            width: '100%',
                            padding: '12px 12px 12px 45px',
                            borderRadius: 'var(--radius-full)',
                            border: '2px solid var(--border-color)',
                            fontSize: '1rem',
                            outline: 'none',
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

            <div style={{ display: 'grid', gridTemplateColumns: showFilters ? '280px 1fr' : '1fr', gap: 'var(--space-xl)' }}>
                {showFilters && (
                    <aside className="filter-sidebar">
                        <div className="filter-group">
                            <h4>Category</h4>
                            <div>
                                {meta?.categories?.map((category) => (
                                    <button
                                        key={category.slug}
                                        className={`filter-chip ${appliedCategories.includes(category.slug) ? 'active' : ''
                                            }`}
                                        onClick={() => toggleMultiSelect('category', category.slug)}
                                    >
                                        {category.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="filter-group">
                            <h4>Brands</h4>
                            <div>
                                {meta?.brands?.map((brand) => (
                                    <button
                                        key={brand}
                                        className={`filter-chip ${appliedBrands.includes(brand) ? 'active' : ''
                                            }`}
                                        onClick={() => toggleMultiSelect('brand', brand)}
                                    >
                                        {brand}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="filter-group">
                            <h4>Customer Rating</h4>
                            <div>
                                {meta?.ratingBuckets?.map((bucket) => (
                                    <button
                                        key={bucket}
                                        className={`filter-chip ${Number(appliedRating) === bucket ? 'active' : ''
                                            }`}
                                        onClick={() =>
                                            updateParam(
                                                'rating',
                                                Number(appliedRating) === bucket ? null : bucket
                                            )
                                        }
                                    >
                                        {bucket}+ Stars
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="filter-group">
                            <h4>Price</h4>
                            <div
                                style={{
                                    display: 'flex',
                                    gap: '0.5rem',
                                    marginBottom: '0.5rem',
                                }}
                            >
                                <input
                                    type="number"
                                    value={priceDraft[0]}
                                    onChange={(e) =>
                                        setPriceDraft([Number(e.target.value), priceDraft[1]])
                                    }
                                    placeholder="Min"
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        borderRadius: 'var(--radius)',
                                        border: '1px solid var(--gray-lighter)',
                                    }}
                                />
                                <input
                                    type="number"
                                    value={priceDraft[1]}
                                    onChange={(e) =>
                                        setPriceDraft([priceDraft[0], Number(e.target.value)])
                                    }
                                    placeholder="Max"
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        borderRadius: 'var(--radius)',
                                        border: '1px solid var(--gray-lighter)',
                                    }}
                                />
                            </div>
                            <button className="btn btn-primary btn-sm" onClick={applyPriceFilter}>
                                Apply
                            </button>
                        </div>

                        <div className="filter-group">
                            <button className="btn btn-outline btn-sm" onClick={clearFilters} style={{ width: '100%' }}>
                                Clear all filters
                            </button>
                        </div>
                    </aside>
                )}

                <section style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-md)', alignItems: 'center' }}>
                        <div style={{ color: 'var(--gray)' }}>
                            Showing <strong>{productCount}</strong> items
                        </div>
                        <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
                            <select
                                value={searchParams.get('sort') || 'relevance'}
                                onChange={(e) => updateParam('sort', e.target.value)}
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: 'var(--radius)',
                                    border: '1px solid var(--gray-lighter)',
                                    cursor: 'pointer'
                                }}
                            >
                                <option value="relevance">Relevance</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                                <option value="rating">Customer Reviews</option>
                                <option value="best-selling">Best Sellers</option>
                                <option value="discount">Discount</option>
                                <option value="newest">New Arrivals</option>
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="grid-products">
                            {[1, 2, 3, 4].map((n) => (
                                <div key={n} style={{ height: '400px', background: 'var(--gray-100)', borderRadius: 'var(--radius-xl)' }}></div>
                            ))}
                        </div>
                    ) : (
                        <>
                            {productCount === 0 ? (
                                <div className="card">No products match these filters.</div>
                            ) : (
                                <div className="grid-products">
                                    {products.map((product) => (
                                        <ProductCard
                                            key={product._id || product.slug || product.title}
                                            product={product}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </section>
            </div>
        </div>
    );
}

export default function ShopPage() {
    return (
        <Suspense fallback={<div className="container" style={{ padding: '50px' }}>Loading storefront...</div>}>
            <ShopView />
        </Suspense>
    );
}
