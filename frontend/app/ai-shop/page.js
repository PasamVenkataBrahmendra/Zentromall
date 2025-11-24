'use client';

import AIWizard from '../../src/components/AIWizard';

export default function AIShopPage() {
    return (
        <div>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 style={{ fontSize: '40px', marginBottom: '10px', color: 'var(--primary)' }}>Shop with AI</h1>
                <p style={{ fontSize: '18px', color: 'var(--text-gray)' }}>Answer a few questions and let our AI find the perfect products for you.</p>
            </div>
            <AIWizard />
        </div>
    );
}
