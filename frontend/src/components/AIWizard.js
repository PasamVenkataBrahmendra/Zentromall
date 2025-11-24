'use client';

import { useState, useEffect } from 'react';
import api from '../utils/api';
import AIResults from './AIResults';

export default function AIWizard() {
    const [questions, setQuestions] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const { data } = await api.get('/ai-shop/questions');
                setQuestions(data);
            } catch (error) {
                console.error('Error fetching questions:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, []);

    const handleAnswer = (key, value) => {
        setAnswers(prev => ({ ...prev, [key]: value }));
    };

    const handleNext = async () => {
        if (currentStep < questions.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            // Submit
            setSubmitting(true);
            try {
                const { data } = await api.post('/ai-shop/recommend', answers);
                setResults(data);
            } catch (error) {
                console.error('Error getting recommendations:', error);
            } finally {
                setSubmitting(false);
            }
        }
    };

    const handleRestart = () => {
        setResults(null);
        setAnswers({});
        setCurrentStep(0);
    };

    if (loading) return <div>Loading wizard...</div>;

    if (results) {
        return <AIResults results={results} onRestart={handleRestart} />;
    }

    const question = questions[currentStep];

    return (
        <div style={{ maxWidth: '600px', margin: '40px auto', padding: '40px', background: 'white', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
            {/* Progress Bar */}
            <div style={{ height: '5px', background: '#eee', marginBottom: '30px', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{
                    height: '100%',
                    width: `${((currentStep + 1) / questions.length) * 100}%`,
                    background: 'var(--primary)',
                    transition: 'width 0.3s ease'
                }}></div>
            </div>

            <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>{question.text}</h2>

            <div style={{ marginBottom: '30px' }}>
                {question.type === 'select' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {question.options.map(option => (
                            <button
                                key={option}
                                onClick={() => handleAnswer(question.id, option)}
                                className={answers[question.id] === option ? 'btn btn-primary' : 'btn btn-outline'}
                                style={{ textAlign: 'left', justifyContent: 'flex-start' }}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                )}

                {question.type === 'multi-select' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {question.options.map(option => {
                            const selected = answers[question.id]?.includes(option);
                            return (
                                <button
                                    key={option}
                                    onClick={() => {
                                        const current = answers[question.id] || [];
                                        const updated = selected ? current.filter(i => i !== option) : [...current, option];
                                        handleAnswer(question.id, updated);
                                    }}
                                    className={selected ? 'btn btn-primary' : 'btn btn-outline'}
                                    style={{ textAlign: 'left', justifyContent: 'flex-start' }}
                                >
                                    {option}
                                </button>
                            );
                        })}
                    </div>
                )}

                {question.type === 'range' && (
                    <div>
                        <input
                            type="range"
                            min={question.min}
                            max={question.max}
                            value={answers[question.id] || question.max / 2}
                            onChange={(e) => handleAnswer(question.id, Number(e.target.value))}
                            style={{ width: '100%', marginBottom: '10px' }}
                        />
                        <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
                            Up to ${answers[question.id] || question.max / 2}
                        </div>
                    </div>
                )}

                {question.type === 'rating' && (
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                        {[1, 2, 3, 4, 5].map(star => (
                            <button
                                key={star}
                                onClick={() => handleAnswer(question.id, star)}
                                style={{
                                    fontSize: '30px',
                                    color: (answers[question.id] || 0) >= star ? '#FFD700' : '#ddd',
                                    background: 'none'
                                }}
                            >
                                ★
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button
                    onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                    disabled={currentStep === 0}
                    className="btn"
                    style={{ color: 'var(--text-gray)' }}
                >
                    Back
                </button>
                <button
                    onClick={handleNext}
                    className="btn btn-primary"
                    disabled={submitting}
                >
                    {submitting ? 'Analyzing...' : (currentStep === questions.length - 1 ? 'See Results' : 'Next')}
                </button>
            </div>
        </div>
    );
}
