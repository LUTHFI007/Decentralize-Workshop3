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

// Helper function to find a product by ID
function getProductById(id) {
    return products.find(product => product.id === parseInt(id));
}

// Helper function to validate product data
function validateProductData(data) {
    return data.name && data.description && data.price !== undefined && data.category && data.inStock !== undefined;
}

// Routes

// GET /products - Retrieve all products
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

// Start the server
app.listen(PORT, () => {
    console.log(`E-commerce API Server running on http://localhost:${PORT}`);
});