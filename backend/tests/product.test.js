const request = require('supertest');
const express = require('express');
const productRoutes = require('../routes/productRoutes');
const Product = require('../models/Product');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use('/api/products', productRoutes);

jest.mock('../models/Product');

describe('Product API', () => {
    it('should fetch all products', async () => {
        const mockProducts = [
            { title: 'Product 1', price: 100 },
            { title: 'Product 2', price: 200 }
        ];

        // Mock chainable populate
        Product.find.mockReturnValue({
            populate: jest.fn().mockResolvedValue(mockProducts)
        });

        const res = await request(app).get('/api/products');

        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toEqual(2);
    });
});
