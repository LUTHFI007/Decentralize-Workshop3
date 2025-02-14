// Import required modules
const express = require('express');

// Initialize Express app
const app = express();
const PORT = 3000;

// Define a route for the root URL
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Hello World Server running on http://localhost:${PORT}`);
});