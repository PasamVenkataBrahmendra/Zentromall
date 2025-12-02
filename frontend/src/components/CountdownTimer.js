'use client';

import { useState, useEffect } from 'react';

export default function CountdownTimer({ endTime }) {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    function calculateTimeLeft() {
        const difference = new Date(endTime) - new Date();

        if (difference <= 0) {
            return { ended: true };
        }

        return {
            ended: false,
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60)
        };
    }

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [endTime]);

    if (timeLeft.ended) {
        return <span style={{ color: 'var(--danger)', fontWeight: '600' }}>Sale Ended</span>;
    }

    const TimeUnit = ({ value, label }) => (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minWidth: '50px'
        }}>
            <div style={{
                background: 'var(--danger)',
                color: 'white',
                padding: 'var(--space-sm) var(--space-md)',
                borderRadius: 'var(--radius-md)',
                fontSize: '1.5rem',
                fontWeight: '700',
                minWidth: '50px',
                textAlign: 'center'
            }}>
                {String(value).padStart(2, '0')}
            </div>
            <span style={{
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                marginTop: 'var(--space-xs)',
                textTransform: 'uppercase'
            }}>
                {label}
            </span>
        </div>
    );

    return (
        <div style={{
            display: 'flex',
            gap: 'var(--space-sm)',
            alignItems: 'center'
        }}>
            {timeLeft.days > 0 && <TimeUnit value={timeLeft.days} label="Days" />}
            <TimeUnit value={timeLeft.hours} label="Hrs" />
            <span style={{ fontSize: '1.5rem', fontWeight: '700' }}>:</span>
            <TimeUnit value={timeLeft.minutes} label="Min" />
            <span style={{ fontSize: '1.5rem', fontWeight: '700' }}>:</span>
            <TimeUnit value={timeLeft.seconds} label="Sec" />
        </div>
    );
}
