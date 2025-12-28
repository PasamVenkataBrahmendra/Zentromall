'use client';

import { useState, useEffect } from 'react';
import api from '../utils/api';

export default function ApiTest() {
  const [result, setResult] = useState('Testing...');

  useEffect(() => {
    const testApi = async () => {
      try {
        console.log('Testing API connection...');
        
        // Test 1: Health endpoint
        const healthResponse = await api.get('/health');
        console.log('Health check response:', healthResponse);
        
        // Test 2: Login endpoint with test data
        const loginResponse = await api.post('/users/login', { 
          email: 'test@example.com', 
          password: 'test123' 
        });
        console.log('Login test response:', loginResponse);
        
        setResult(`Health: OK, Login: ${loginResponse.status}`);
      } catch (error) {
        console.error('API test failed:', error);
        setResult(`Error: ${error.message} - ${error.code || 'No code'}`);
      }
    };

    testApi();
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'white',
      padding: '10px',
      border: '1px solid black',
      zIndex: 9999,
      fontSize: '12px',
      maxWidth: '300px'
    }}>
      <strong>API Test:</strong> {result}
    </div>
  );
}
