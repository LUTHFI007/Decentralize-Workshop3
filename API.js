// Import required modules
const express = require('express');
const bodyParser = require('body-parser');

// Initialize Express app
const app = express();
const PORT = 4000;

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// In-memory database simulation
let products = [
    { id: 1, name: 'Laptop', description: 'High-performance laptop', price: 1200, category: 'Electronics', inStock: true },
    { id: 2, name: 'Smartphone', description: 'Latest smartphone model', price: 800, category: 'Electronics', inStock: true },
    { id: 3, name: 'T-shirt', description: 'Comfortable cotton t-shirt', price: 25, category: 'Apparel', inStock: false }
];
let nextProductId = 4; // Auto-increment ID for new products

let orders = []; // List of all orders
let carts = {};  // User-specific shopping carts (key: userId, value: cart)

// Helper functions
function getProductById(id) {
    return products.find(product => product.id === parseInt(id));
}

function validateProductData(data) {
    return data.name && data.description && data.price !== undefined && data.category !== undefined && data.inStock !== undefined;
}

function calculateTotalPrice(items) {
    return items.reduce((total, item) => {
        const product = getProductById(item.productId);
        return total + (product ? product.price * item.quantity : 0);
    }, 0);
}

// Products Routes

// GET /products - Retrieve all products with optional filters
app.get('/products', (req, res) => {
    const { category, inStock } = req.query;

    let filteredProducts = products;

    if (category) {
        filteredProducts = filteredProducts.filter(product => product.category === category);
    }

    if (inStock !== undefined) {
        const inStockBool = inStock.toLowerCase() === 'true';
        filteredProducts = filteredProducts.filter(product => product.inStock === inStockBool);
    }

    res.json(filteredProducts);
});

// GET /products/:id - Retrieve a specific product by ID
app.get('/products/:id', (req, res) => {
    const product = getProductById(req.params.id);

    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
});

// POST /products - Add a new product
app.post('/products', (req, res) => {
    const newProduct = req.body;

    if (!validateProductData(newProduct)) {
        return res.status(400).json({ error: 'Invalid product data' });
    }

    const productWithId = { id: nextProductId++, ...newProduct };
    products.push(productWithId);

    res.status(201).json(productWithId);
});

// PUT /products/:id - Update an existing product
app.put('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const updatedData = req.body;

    const productIndex = products.findIndex(product => product.id === productId);

    if (productIndex === -1) {
        return res.status(404).json({ error: 'Product not found' });
    }

    const updatedProduct = { ...products[productIndex], ...updatedData };
    products[productIndex] = updatedProduct;

    res.json(updatedProduct);
});

// DELETE /products/:id - Delete a product
app.delete('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const productIndex = products.findIndex(product => product.id === productId);

    if (productIndex === -1) {
        return res.status(404).json({ error: 'Product not found' });
    }

    products.splice(productIndex, 1);

    res.json({ message: 'Product deleted successfully' });
});

// Orders Routes

// POST /orders - Create a new order
app.post('/orders', (req, res) => {
    const { userId, items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Invalid order items' });
    }

    try {
        const orderItems = items.map(item => {
            const product = getProductById(item.productId);
            if (!product || !product.inStock) {
                throw new Error(`Product ${item.productId} is not available`);
            }
            return { productId: product.id, quantity: item.quantity, price: product.price };
        });

        const totalPrice = calculateTotalPrice(orderItems);
        const orderId = orders.length + 1;

        const newOrder = {
            id: orderId,
            userId,
            items: orderItems,
            totalPrice,
            status: 'placed'
        };

        orders.push(newOrder);

        res.status(201).json(newOrder);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// GET /orders/:userId - Retrieve all orders for a user
app.get('/orders/:userId', (req, res) => {
    const userId = req.params.userId;
    const userOrders = orders.filter(order => order.userId === userId);

    res.json(userOrders);
});

// Cart Routes

// POST /cart/:userId - Add a product to the user's cart
app.post('/cart/:userId', (req, res) => {
    const userId = req.params.userId;
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity <= 0) {
        return res.status(400).json({ error: 'Invalid product or quantity' });
    }

    const product = getProductById(productId);
    if (!product || !product.inStock) {
        return res.status(400).json({ error: `Product ${productId} is not available` });
    }

    if (!carts[userId]) {
        carts[userId] = [];
    }

    const cartItemIndex = carts[userId].findIndex(item => item.productId === parseInt(productId));
    if (cartItemIndex !== -1) {
        carts[userId][cartItemIndex].quantity += quantity;
    } else {
        carts[userId].push({ productId: parseInt(productId), quantity });
    }

    const cartTotalPrice = calculateTotalPrice(carts[userId]);

    res.json({
        cart: carts[userId],
        totalPrice: cartTotalPrice
    });
});

// GET /cart/:userId - Retrieve the user's cart
app.get('/cart/:userId', (req, res) => {
    const userId = req.params.userId;
    const userCart = carts[userId] || [];

    const cartWithDetails = userCart.map(item => {
        const product = getProductById(item.productId);
        return {
            ...product,
            quantity: item.quantity,
            subtotal: product.price * item.quantity
        };
    });

    const cartTotalPrice = calculateTotalPrice(userCart);

    res.json({
        cart: cartWithDetails,
        totalPrice: cartTotalPrice
    });
});

// DELETE /cart/:userId/item/:productId - Remove a product from the user's cart
app.delete('/cart/:userId/item/:productId', (req, res) => {
    const userId = req.params.userId;
    const productId = parseInt(req.params.productId);

    if (!carts[userId]) {
        return res.status(404).json({ error: 'Cart not found for this user' });
    }

    const cartIndex = carts[userId].findIndex(item => item.productId === productId);
    if (cartIndex === -1) {
        return res.status(404).json({ error: 'Product not found in cart' });
    }

    carts[userId].splice(cartIndex, 1);

    const cartTotalPrice = calculateTotalPrice(carts[userId]);

    res.json({
        cart: carts[userId],
        totalPrice: cartTotalPrice
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`E-commerce API Server running on http://localhost:${PORT}`);
});