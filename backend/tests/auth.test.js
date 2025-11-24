const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('../routes/authRoutes');
const User = require('../models/User');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use('/api/users', authRoutes);

// Mock DB Connection for tests (or use a separate test DB)
// For simplicity in this demo, we'll mock the Mongoose models or just test the route logic if possible.
// However, integration tests usually need a real DB. 
// Let's assume we are connecting to a test DB or the main one (careful!).
// BETTER APPROACH: Mocking Mongoose functions.

jest.mock('../models/User');

describe('Auth API', () => {
    it('should register a new user', async () => {
        User.findOne.mockResolvedValue(null);
        User.create.mockResolvedValue({
            _id: '123',
            name: 'Test User',
            email: 'test@example.com',
            role: 'user',
            matchPassword: () => true,
        });
        // We need to mock the save or create flow. 
        // Since our controller uses User.create or new User().save(), we need to match that.
        // Controller uses: const userExists = await User.findOne... const user = await User.create...

        const res = await request(app)
            .post('/api/users/register')
            .send({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            });

        // Expect 201 Created or 200 OK depending on implementation
        // Our controller returns 201.
        // Note: We might run into issues with JWT generation if env vars aren't set or if we don't mock it.
        // But let's try basic assertion.
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('token');
    });
});
