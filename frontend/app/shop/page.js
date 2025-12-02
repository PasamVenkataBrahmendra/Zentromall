'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '../../src/utils/api';
import ProductCard from '../../src/components/ProductCard';
import { FALLBACK_PRODUCTS, FALLBACK_META } from '../../src/data/fallbackData';

const joinParam = (values = []) => values.filter(Boolean).join(',');

function ShopView() {
    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
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

        router.push(`/shop?${params.toString()}`);
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ marginBottom: 4 }}>Browse ZentroMall</h1>
                    <p style={{ margin: 0, color: 'var(--gray)' }}>
                        {pagination
                            ? `${pagination.total} products · Page ${pagination.page} of ${pagination.pages}`
                            : 'Loading...'}
                    </p>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
                    <label style={{ color: 'var(--gray)', fontWeight: 600 }}>Sort by</label>
                    <select
                        value={searchParams.get('sort') || 'relevance'}
                        onChange={(e) => updateParam('sort', e.target.value)}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: 'var(--radius)',
                            border: '1px solid var(--gray-lighter)',
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
                    <button className="btn btn-outline btn-sm" onClick={clearFilters}>
                        Clear filters
                    </button>
                </div>
            </div>

            <div className="shop-layout">
                <aside className="filter-sidebar">
                    <div className="filter-group">
                        <h4>Category</h4>
                        <div>
                            {meta?.categories?.map((category) => (
                                <button
                                    key={category.slug}
                                    className={`filter-chip ${
                                        appliedCategories.includes(category.slug) ? 'active' : ''
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
                                    className={`filter-chip ${
                                        appliedBrands.includes(brand) ? 'active' : ''
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
                                    className={`filter-chip ${
                                        Number(appliedRating) === bucket ? 'active' : ''
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
                        <h4>Quick filters</h4>
                        <div>
                            <button
                                className={`filter-chip ${
                                    searchParams.get('deal') === 'true' ? 'active' : ''
                                }`}
                                onClick={() =>
                                    updateParam(
                                        'deal',
                                        searchParams.get('deal') === 'true' ? null : 'true'
                                    )
                                }
                            >
                                Deals of the Day
                            </button>
                            <button
                                className={`filter-chip ${
                                    searchParams.get('fastDelivery') === 'true' ? 'active' : ''
                                }`}
                                onClick={() =>
                                    updateParam(
                                        'fastDelivery',
                                        searchParams.get('fastDelivery') === 'true' ? null : 'true'
                                    )
                                }
                            >
                                Fast delivery
                            </button>
                        </div>
                    </div>
                </aside>

                <section style={{ flex: 1 }}>
                    {loading ? (
                        <div className="card" style={{ textAlign: 'center' }}>
                            Loading products...
                        </div>
                    ) : (
                        <>
                            <div
                                style={{
                                    marginBottom: 'var(--space-md)',
                                    color: 'var(--gray)',
                                }}
                            >
                                Showing <strong>{productCount}</strong> items
                            </div>
                            {productCount === 0 ? (
                                <div className="card">No products match these filters.</div>
                            ) : (
                                <div className="shop-grid">
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
        <Suspense fallback={<div className="card">Loading storefront...</div>}>
            <ShopView />
        </Suspense>
    );
}
