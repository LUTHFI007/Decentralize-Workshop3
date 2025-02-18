const express = require('express');
const Order = require('../models/orderModel');
const Product = require("../models/productModel");

const router = express.Router();

// POST - Create a new order
router.post("/", async (req, res) => {
    try {
        let totalPrice = 0;

        // Validate and calculate total price
        for (const item of req.body.products) {
            const product = await Product.findById(item.productId);
            if (!product) return res.status(404).json({ message: `Product not found: ${item.productId}` });

            totalPrice += product.price * item.quantity;
        }

        const newOrder = new Order({ userId: req.body.userId, products: req.body.products, totalPrice });
        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET: Retrieve all orders for a specific user
router.get("/:userId", async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId }).populate("products.productId");
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
