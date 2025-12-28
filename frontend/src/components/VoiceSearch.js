'use client';

import { useState, useEffect } from 'react';
import { FaMicrophone, FaStop } from 'react-icons/fa';

export default function VoiceSearch({ onResult }) {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            setError('Voice search is not supported in your browser');
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setTranscript(transcript);
            if (onResult) {
                onResult(transcript);
            }
            setIsListening(false);
        };

        recognition.onerror = (event) => {
            setError(`Error: ${event.error}`);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        if (isListening) {
            recognition.start();
        } else {
            recognition.stop();
        }

        return () => {
            recognition.stop();
        };
    }, [isListening, onResult]);

    const toggleListening = () => {
        setError(null);
        setTranscript('');
        setIsListening(!isListening);
    };

    if (error) {
        return (
            <div style={{ padding: 'var(--space-sm)', color: 'var(--error)', fontSize: '0.9rem' }}>
                {error}
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <button
                onClick={toggleListening}
                style={{
                    padding: 'var(--space-sm)',
                    background: isListening ? 'var(--error)' : 'var(--primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                title={isListening ? 'Stop listening' : 'Start voice search'}
            >
                {isListening ? <FaStop /> : <FaMicrophone />}
            </button>
            {transcript && (
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    "{transcript}"
                </span>
            )}
            {isListening && (
                <span style={{ fontSize: '0.9rem', color: 'var(--primary)' }}>
                    Listening...
                </span>
            )}
        </div>
    );
}

