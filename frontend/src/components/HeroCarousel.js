'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function HeroCarousel({ slides = [] }) {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        if (!slides.length) return;
        const timer = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [slides.length]);

    if (!slides.length) return null;

    return (
        <section className="hero-carousel">
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className="hero-slide"
                    style={{
                        display: index === activeIndex ? 'grid' : 'none',
                        background:
                            'linear-gradient(120deg, rgba(15,17,17,0.95), rgba(35,47,62,0.96))',
                    }}
                >
                    <div>
                        <p
                            className="badge badge-primary"
                            style={{ marginBottom: 'var(--space-lg)' }}
                        >
                            Featured
                        </p>
                        <h1 style={{ marginBottom: 'var(--space-md)' }}>{slide.title}</h1>
                        <p
                            style={{
                                marginBottom: 'var(--space-xl)',
                                color: '#e5e7eb',
                                fontSize: '1.1rem',
                            }}
                        >
                            {slide.subtitle}
                        </p>
                        <Link href={slide.ctaLink} className="btn btn-primary btn-lg">
                            {slide.ctaLabel}
                        </Link>
                    </div>
                    <img src={slide.image} alt={slide.title} />
                </div>
            ))}
            <div
                style={{
                    position: 'absolute',
                    bottom: 16,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: '0.5rem',
                }}
            >
                {slides.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setActiveIndex(idx)}
                        style={{
                            width: idx === activeIndex ? 24 : 10,
                            height: 10,
                            borderRadius: 999,
                            border: 'none',
                            background:
                                idx === activeIndex
                                    ? 'var(--brand-orange)'
                                    : 'rgba(255,255,255,0.5)',
                            cursor: 'pointer',
                        }}
                    />
                ))}
            </div>
        </section>
    );
}

