const request = require('supertest');
const express = require('express');
jest.mock('../models/Product');

const productRoutes = require('../routes/productRoutes');
const Product = require('../models/Product');
const Category = require('../models/Category');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use('/api/products', productRoutes);

describe('Product API', () => {
    it('should fetch all products', async () => {
        const mockProducts = [
            { title: 'Product 1', price: 100 },
            { title: 'Product 2', price: 200 }
        ];

        const chain = {
            populate: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            sort: jest.fn().mockResolvedValue(mockProducts)
        };

        Product.find.mockReturnValue(chain);
        Product.countDocuments.mockResolvedValue(mockProducts.length);
        const categorySpy = jest.spyOn(Category, 'find').mockResolvedValue([]);

        const res = await request(app).get('/api/products');

        expect(res.statusCode).toEqual(200);
        expect(res.body.products.length).toEqual(2);
        expect(res.body.pagination.total).toEqual(2);

        categorySpy.mockRestore();
    });
});
