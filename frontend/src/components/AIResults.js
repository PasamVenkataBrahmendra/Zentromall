'use client';

import ProductCard from './ProductCard';

export default function AIResults({ results, onRestart }) {
    const { topPicks, otherMatches } = results;

    return (
        <div>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 style={{ fontSize: '36px', marginBottom: '10px' }}>We found some great matches!</h1>
                <p style={{ fontSize: '18px', color: 'var(--text-gray)' }}>Based on your preferences, here are our top recommendations.</p>
                <button onClick={onRestart} className="btn btn-outline" style={{ marginTop: '20px' }}>Start Over</button>
            </div>

            {/* Top Picks */}
            <div style={{ marginBottom: '50px' }}>
                <h2 style={{ fontSize: '28px', marginBottom: '20px', color: 'var(--primary)' }}>Top Picks For You</h2>
                <div className="grid-products">
                    {topPicks.map(product => (
                        <div key={product._id} style={{ position: 'relative' }}>
                            <div style={{
                                position: 'absolute', top: '-10px', left: '10px', zIndex: 10,
                                background: 'var(--accent)', color: 'white', padding: '5px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold'
                            }}>
                                {Math.round(product.score)}% Match
                            </div>
                            <ProductCard product={product} />
                            <div style={{
                                background: '#e6fffa', padding: '10px', borderRadius: '0 0 var(--radius) var(--radius)',
                                marginTop: '-5px', border: '1px solid var(--accent)', borderTop: 'none', fontSize: '14px', color: '#004d40'
                            }}>
                                <strong>Why?</strong> {product.recommendationReason}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Other Matches */}
            {otherMatches.length > 0 && (
                <div>
                    <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Other Options You Might Like</h2>
                    <div className="grid-products">
                        {otherMatches.map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
