// Import required modules
const express = require('express');

// Initialize Express app
const app = express();
const PORT = 3001;

// Mock server URL (this can be dynamically set or hardcoded)
const SERVER_URL = 'localhost:3001';

// Define the /getServer route
app.get('/getServer', (req, res) => {
    res.json({ code: 200, server: SERVER_URL });
});

// Start the server
app.listen(PORT, () => {
    console.log(`DNS Registry Server running on http://localhost:${PORT}`);
});