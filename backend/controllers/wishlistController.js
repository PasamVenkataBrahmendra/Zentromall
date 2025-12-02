const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = async (req, res) => {
    try {
        let wishlist = await Wishlist.findOne({ user: req.user._id })
            .populate({
                path: 'products.product',
                populate: { path: 'category', select: 'name' }
            });

        if (!wishlist) {
            wishlist = await Wishlist.create({ user: req.user._id, products: [] });
        }

        res.json(wishlist);
    } catch (error) {
        console.error('Error in getWishlist:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add product to wishlist
// @route   POST /api/wishlist/:productId
// @access  Private
const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.params;

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        let wishlist = await Wishlist.findOne({ user: req.user._id });

        if (!wishlist) {
            wishlist = await Wishlist.create({
                user: req.user._id,
                products: [{ product: productId }]
            });
        } else {
            // Check if product already in wishlist
            const exists = wishlist.products.some(
                item => item.product.toString() === productId
            );

            if (exists) {
                return res.status(400).json({ message: 'Product already in wishlist' });
            }

            wishlist.products.push({ product: productId });
            await wishlist.save();
        }

        await wishlist.populate({
            path: 'products.product',
            populate: { path: 'category', select: 'name' }
        });

        res.status(201).json(wishlist);
    } catch (error) {
        console.error('Error in addToWishlist:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;

        const wishlist = await Wishlist.findOne({ user: req.user._id });

        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }

        wishlist.products = wishlist.products.filter(
            item => item.product.toString() !== productId
        );

        await wishlist.save();

        await wishlist.populate({
            path: 'products.product',
            populate: { path: 'category', select: 'name' }
        });

        res.json(wishlist);
    } catch (error) {
        console.error('Error in removeFromWishlist:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Clear entire wishlist
// @route   DELETE /api/wishlist
// @access  Private
const clearWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ user: req.user._id });

        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }

        wishlist.products = [];
        await wishlist.save();

        res.json({ message: 'Wishlist cleared' });
    } catch (error) {
        console.error('Error in clearWishlist:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Move product from wishlist to cart
// @route   POST /api/wishlist/:productId/move-to-cart
// @access  Private
const moveToCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const Cart = require('../models/Cart');

        // Remove from wishlist
        const wishlist = await Wishlist.findOne({ user: req.user._id });
        if (wishlist) {
            wishlist.products = wishlist.products.filter(
                item => item.product.toString() !== productId
            );
            await wishlist.save();
        }

        // Add to cart
        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            cart = await Cart.create({ user: req.user._id, items: [] });
        }

        const existingItem = cart.items.find(
            item => item.product.toString() === productId
        );

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.items.push({ product: productId, quantity: 1 });
        }

        await cart.save();

        res.json({ message: 'Product moved to cart', cart });
    } catch (error) {
        console.error('Error in moveToCart:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    moveToCart
};
