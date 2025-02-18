const express = require('express');
const Cart = require('../models/cartModel');

const router = express.Router();

router.post("/:userId", async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: req.params.userId });

        if (!cart) {
            cart = new Cart({ userId: req.params.userId, products: [] });
        }

        // Check if product already in cart
        const productIndex = cart.products.findIndex(p => p.productId.toString() === req.body.productId);
        if (productIndex !== -1) {
            cart.products[productIndex].quantity += req.body.quantity;
        } else {
            cart.products.push({ productId: req.body.productId, quantity: req.body.quantity });
        }

        await cart.save();
        res.json(cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET: Retrieve user cart
router.get("/:userId", async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId }).populate("products.productId");
        if (!cart) return res.status(404).json({ message: "Cart is empty" });
        res.json(cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE: Remove product from cart
router.delete("/:userId/item/:productId", async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        cart.products = cart.products.filter(p => p.productId.toString() !== req.params.productId);
        await cart.save();
        res.json(cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
